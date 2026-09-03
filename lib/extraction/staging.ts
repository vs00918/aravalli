import fs from 'fs';
import path from 'path';
import { ExtractedFact, SourceSpan } from './schema';
import { FactClassificationResult } from './classifier';
import { PriorityLevel, CategoryId, CanonicalTopic } from '../banking-ca/schema';

export type StagingState = 'STAGED' | 'APPROVED' | 'REJECTED' | 'QUARANTINED';

export interface StateTransitionRecord {
  fromState: StagingState;
  toState: StagingState;
  actor: string;
  timestamp: string;
  rationale: string;
}

export interface ReviewDecision {
  action: 'APPROVE' | 'REJECT' | 'QUARANTINE';
  reviewer: string;
  rationale: string;
  assignedPriority?: PriorityLevel;
  assignedCategory?: CategoryId;
  assignedAction?: 'NOVEL_TOPIC' | 'UPDATE_TOPIC' | 'RECORD_DUPLICATE';
  targetTopicId?: string;
  timestamp: string;
}

export interface PromotionResult {
  promoted: boolean;
  action: 'NOVEL_TOPIC' | 'UPDATE_TOPIC' | 'RECORD_DUPLICATE' | 'NONE';
  canonicalTopicId?: string;
  timestamp: string;
  details: string;
}

export interface StagedKnowledgeItem {
  stagingId: string;
  fact: ExtractedFact;
  classification: FactClassificationResult;
  state: StagingState;
  documentId: string;
  batchId: string;
  chunkId: string;
  createdAt: string;
  updatedAt: string;
  decision?: ReviewDecision;
  auditTrail: StateTransitionRecord[];
  promotionResult?: PromotionResult;
}

export interface PromotionPreview {
  stagingId: string;
  eligibleForPromotion: boolean;
  ineligibilityReason?: string;
  intendedAction: 'NOVEL_TOPIC' | 'UPDATE_TOPIC' | 'RECORD_DUPLICATE' | 'NONE';
  targetTopicId?: string;
  proposedTitle: string;
  proposedPriority: PriorityLevel;
  proposedCategory: CategoryId;
  proposedFact: string;
  provenance: SourceSpan;
}

/**
 * Creates a new StagedKnowledgeItem from a classified fact.
 * Enforces Provenance Firewall: If provenance is invalid or empty, state is strictly QUARANTINED.
 */
export function createStagedItem(
  fact: ExtractedFact,
  classification: FactClassificationResult,
  metadata: { documentId: string; batchId: string; chunkId: string }
): StagedKnowledgeItem {
  const timestamp = new Date().toISOString();
  const stagingId = `stg-${fact.factId}-${Date.now().toString(36)}`;

  // Provenance check
  const hasValidProvenance = fact.provenance &&
    fact.provenance.quotedText &&
    fact.provenance.quotedText.trim().length > 0;

  const initialState: StagingState = hasValidProvenance ? 'STAGED' : 'QUARANTINED';
  const initialRationale = hasValidProvenance
    ? 'Item successfully passed provenance verification and entered human review queue.'
    : 'QUARANTINED: Missing or invalid source provenance quote.';

  return {
    stagingId,
    fact,
    classification,
    state: initialState,
    documentId: metadata.documentId,
    batchId: metadata.batchId,
    chunkId: metadata.chunkId,
    createdAt: timestamp,
    updatedAt: timestamp,
    auditTrail: [
      {
        fromState: 'STAGED',
        toState: initialState,
        actor: 'SYSTEM_INGESTION_PIPELINE',
        timestamp,
        rationale: initialRationale
      }
    ]
  };
}

/**
 * Applies an explicit human reviewer decision to a staged item.
 */
export function applyReviewDecision(
  item: StagedKnowledgeItem,
  decision: ReviewDecision
): StagedKnowledgeItem {
  const previousState = item.state;
  let nextState: StagingState = 'STAGED';

  if (decision.action === 'APPROVE') {
    nextState = 'APPROVED';
  } else if (decision.action === 'REJECT') {
    nextState = 'REJECTED';
  } else if (decision.action === 'QUARANTINE') {
    nextState = 'QUARANTINED';
  }

  const updatedItem: StagedKnowledgeItem = {
    ...item,
    state: nextState,
    decision,
    updatedAt: decision.timestamp || new Date().toISOString(),
    auditTrail: [
      ...item.auditTrail,
      {
        fromState: previousState,
        toState: nextState,
        actor: decision.reviewer,
        timestamp: decision.timestamp || new Date().toISOString(),
        rationale: decision.rationale
      }
    ]
  };

  return updatedItem;
}

/**
 * Generates a Promotion Preview showing what canonical mutation would occur.
 */
export function previewPromotion(item: StagedKnowledgeItem): PromotionPreview {
  if (item.state !== 'APPROVED' || !item.decision) {
    return {
      stagingId: item.stagingId,
      eligibleForPromotion: false,
      ineligibilityReason: `Item is in '${item.state}' state. Only 'APPROVED' items can be promoted.`,
      intendedAction: 'NONE',
      proposedTitle: item.fact.statement.slice(0, 80),
      proposedPriority: 'P2_HIGH',
      proposedCategory: 'BANKING_REGULATION',
      proposedFact: item.fact.statement,
      provenance: item.fact.provenance
    };
  }

  const action = item.decision.assignedAction ||
    (item.classification.classification === 'NOVEL' ? 'NOVEL_TOPIC' :
     item.classification.classification === 'UPDATE' ? 'UPDATE_TOPIC' :
     item.classification.classification === 'DUPLICATE' ? 'RECORD_DUPLICATE' : 'NONE');

  return {
    stagingId: item.stagingId,
    eligibleForPromotion: action !== 'NONE',
    intendedAction: action,
    targetTopicId: item.decision.targetTopicId || item.classification.matchedTopicId,
    proposedTitle: item.fact.statement.slice(0, 80),
    proposedPriority: item.decision.assignedPriority || 'P2_HIGH',
    proposedCategory: item.decision.assignedCategory || 'BANKING_REGULATION',
    proposedFact: item.fact.statement,
    provenance: item.fact.provenance
  };
}

/**
 * Promotes an approved staged item.
 * Strictly verifies all preconditions before executing.
 */
export function promoteStagedItem(
  item: StagedKnowledgeItem,
  options: { dryRun?: boolean; targetDir?: string } = {}
): { success: boolean; result: PromotionResult; item: StagedKnowledgeItem } {
  const timestamp = new Date().toISOString();

  // Guard 1: Must be APPROVED
  if (item.state !== 'APPROVED' || !item.decision) {
    const failureResult: PromotionResult = {
      promoted: false,
      action: 'NONE',
      timestamp,
      details: `Promotion blocked: Item is in '${item.state}' state. Requires explicit human APPROVAL.`
    };
    return { success: false, result: failureResult, item };
  }

  // Guard 2: Provenance must be intact
  if (!item.fact.provenance || !item.fact.provenance.quotedText) {
    const failureResult: PromotionResult = {
      promoted: false,
      action: 'NONE',
      timestamp,
      details: 'Promotion blocked: Provenance data missing or corrupted.'
    };
    return { success: false, result: failureResult, item };
  }

  const preview = previewPromotion(item);
  if (!preview.eligibleForPromotion) {
    const failureResult: PromotionResult = {
      promoted: false,
      action: 'NONE',
      timestamp,
      details: preview.ineligibilityReason || 'Promotion blocked by preview validator.'
    };
    return { success: false, result: failureResult, item };
  }

  // Execution:
  let promotionAction = preview.intendedAction;
  let details = '';

  if (promotionAction === 'RECORD_DUPLICATE') {
    details = `Duplicate disposition recorded in ledger for canonical topic: ${preview.targetTopicId}. Canonical corpus unchanged.`;
  } else if (promotionAction === 'UPDATE_TOPIC') {
    details = `Chronological update staged for canonical topic: ${preview.targetTopicId}.`;
  } else if (promotionAction === 'NOVEL_TOPIC') {
    details = `Novel canonical candidate prepared for promotion: "${preview.proposedTitle}".`;
  }

  const successResult: PromotionResult = {
    promoted: true,
    action: promotionAction,
    canonicalTopicId: preview.targetTopicId,
    timestamp,
    details
  };

  const updatedItem: StagedKnowledgeItem = {
    ...item,
    promotionResult: successResult,
    updatedAt: timestamp,
    auditTrail: [
      ...item.auditTrail,
      {
        fromState: 'APPROVED',
        toState: 'APPROVED',
        actor: 'PROMOTION_ENGINE',
        timestamp,
        rationale: `Promotion transaction completed: ${details}`
      }
    ]
  };

  return { success: true, result: successResult, item: updatedItem };
}

/**
 * Isolated Staging Storage Layer
 */
export class StagingRepository {
  private baseDir: string;
  private itemsFilePath: string;
  private auditFilePath: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir || path.join(process.cwd(), 'data/staging');
    this.itemsFilePath = path.join(this.baseDir, 'staged-items.json');
    this.auditFilePath = path.join(this.baseDir, 'audit-ledger.json');
  }

  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  public loadItems(): StagedKnowledgeItem[] {
    if (!fs.existsSync(this.itemsFilePath)) return [];
    try {
      const data = fs.readFileSync(this.itemsFilePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  public saveItems(items: StagedKnowledgeItem[]): void {
    this.ensureDirectoryExists();
    fs.writeFileSync(this.itemsFilePath, JSON.stringify(items, null, 2), 'utf-8');
  }

  public appendAuditLog(entry: any): void {
    this.ensureDirectoryExists();
    let ledger: any[] = [];
    if (fs.existsSync(this.auditFilePath)) {
      try {
        ledger = JSON.parse(fs.readFileSync(this.auditFilePath, 'utf-8'));
      } catch {
        ledger = [];
      }
    }
    ledger.push(entry);
    fs.writeFileSync(this.auditFilePath, JSON.stringify(ledger, null, 2), 'utf-8');
  }
}
