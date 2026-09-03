import crypto from 'crypto';
import { CanonicalTopic, CategoryId, PriorityLevel, RegulatoryStatus, SourceReference } from '../schema';
import { OfficialVerificationEvidence } from '../trust-architecture';
import {
  RawIncomingFeedItem,
  ExtractedEvent,
  PipelineReport,
  VerificationRegistryRecord,
  ReviewQueueItem
} from './types';
import { EntityResolver } from './entity-resolver';
import { FactMerger } from './fact-merger';
import { TrustResolver } from './trust-resolver';
import { QualityChecker } from './quality-checker';
import { VerificationRegistry } from './verification-registry';
import { ReviewQueue } from './review-queue';

export interface IngestionOptions {
  batchId?: string;
  sourceVerificationExecutor?: (event: ExtractedEvent) => Promise<OfficialVerificationEvidence | null>;
}

export class IngestionPipeline {
  private verificationRegistry: VerificationRegistry;
  private reviewQueue: ReviewQueue;

  constructor(
    verificationRegistry?: VerificationRegistry,
    reviewQueue?: ReviewQueue
  ) {
    this.verificationRegistry = verificationRegistry || new VerificationRegistry();
    this.reviewQueue = reviewQueue || new ReviewQueue();
  }

  public parseIncomingItem(item: RawIncomingFeedItem): ExtractedEvent {
    const slugCandidate = item.headline
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Extract bullet points or sentences from bodyText
    const lines = item.bodyText
      .split(/\n+/)
      .map(l => l.trim().replace(/^[-*•\d.]\s*/, ''))
      .filter(l => l.length > 5);

    const mustMemorize = lines.slice(0, Math.min(3, lines.length));
    const context = lines.slice(3, Math.min(6, lines.length));
    const examFocus = lines.slice(6);

    const priority: PriorityLevel =
      item.priorityHint === 'P1' ? 'P1_CRITICAL_DEEP' :
      item.priorityHint === 'P2' ? 'P2_HIGH' :
      item.priorityHint === 'P4' ? 'P4_LOW_YIELD' : 'P3_MODERATE';

    const category: CategoryId = (item.categoryHint as CategoryId) || 'BANKING_REGULATION';

    const sourceRef: SourceReference = {
      sourceName: item.sourceName,
      batchName: item.batchName,
      pageNumbers: item.pageNumbers || [1],
      publishedDate: item.publishedDate,
      citationSnippet: item.bodyText.slice(0, 150)
    };

    return {
      eventId: item.id || slugCandidate,
      title: item.headline,
      slugCandidate,
      category,
      priority,
      primaryInstitution: 'RBI',
      eventDate: item.publishedDate,
      sourceReference: sourceRef,
      claims: [
        {
          claimId: 'primary',
          claimText: item.headline + ': ' + mustMemorize.join('; ')
        }
      ],
      mustMemorizeFacts: mustMemorize.length > 0 ? mustMemorize : [item.headline],
      knowUnderstandContext: context,
      examFocus,
      rawText: item.bodyText
    };
  }

  public async processFeed(
    incomingItems: RawIncomingFeedItem[],
    currentCorpus: CanonicalTopic[],
    options?: IngestionOptions
  ): Promise<{
    updatedCorpus: CanonicalTopic[];
    report: PipelineReport;
  }> {
    const batchId = options?.batchId || `batch-${Date.now()}`;
    const resolver = new EntityResolver(currentCorpus);
    const trustResolver = new TrustResolver(this.verificationRegistry);

    const corpusMap = new Map<string, CanonicalTopic>();
    for (const topic of currentCorpus) {
      corpusMap.set(topic.slug, { ...topic });
    }

    const report: PipelineReport = {
      timestamp: new Date().toISOString(),
      batchId,
      totalIncomingItems: incomingItems.length,
      newEntitiesCreated: 0,
      existingEntitiesMatched: 0,
      exactDuplicatesFiltered: 0,
      complementaryEnrichments: 0,
      verificationsReused: 0,
      newOfficialVerifications: 0,
      reviewQueueItemsCreated: 0,
      topicsProcessed: []
    };

    for (const rawItem of incomingItems) {
      const extracted = this.parseIncomingItem(rawItem);

      // 1. Quality Check
      const quality = QualityChecker.check(extracted);
      if (!quality.passed) {
        this.reviewQueue.enqueue({
          queueId: `queue-qc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toISOString(),
          reason: 'CONTENT_QUALITY_DEFECT',
          severity: 'MEDIUM',
          incomingFeedItemId: rawItem.id || extracted.slugCandidate,
          description: `Quality check failed: ${quality.issues.join('; ')}`,
          resolved: false
        });
        report.reviewQueueItemsCreated++;
        continue;
      }

      // 2. Entity Resolution
      const resolution = resolver.resolve(extracted);

      if (resolution.outcome === 'AMBIGUOUS_MATCH' && resolution.matchedTopicSlug) {
        this.reviewQueue.enqueue({
          queueId: `queue-ambig-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toISOString(),
          reason: 'AMBIGUOUS_ENTITY_MATCH',
          severity: 'HIGH',
          topicSlug: resolution.matchedTopicSlug,
          incomingFeedItemId: rawItem.id || extracted.slugCandidate,
          description: `Ambiguous match with '${resolution.matchedTopicSlug}': ${resolution.reason}`,
          resolved: false
        });
        report.reviewQueueItemsCreated++;
        continue;
      }

      if (resolution.outcome === 'EXACT_MATCH' || resolution.outcome === 'COMPLEMENTARY_MATCH') {
        report.existingEntitiesMatched++;
        const matchedSlug = resolution.matchedTopicSlug!;
        const existingTopic = corpusMap.get(matchedSlug)!;

        // 3. Fact Merge & Conflict Detection
        const mergeResult = FactMerger.merge(existingTopic, extracted);

        if (mergeResult.action === 'CONFLICT_DETECTED') {
          this.reviewQueue.enqueue({
            queueId: `queue-conflict-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            timestamp: new Date().toISOString(),
            reason: 'CONFLICT_DETECTED',
            severity: 'HIGH',
            topicSlug: existingTopic.slug,
            incomingFeedItemId: rawItem.id || extracted.slugCandidate,
            description: `Conflicting claim detected: existing '${mergeResult.conflictDetails?.existingClaim}' vs incoming '${mergeResult.conflictDetails?.incomingClaim}'`,
            conflictingDetails: {
              existingClaim: mergeResult.conflictDetails?.existingClaim || '',
              incomingClaim: mergeResult.conflictDetails?.incomingClaim || '',
              incomingSource: rawItem.sourceName
            },
            resolved: false
          });
          report.reviewQueueItemsCreated++;
          report.topicsProcessed.push({
            slug: existingTopic.slug,
            title: existingTopic.title,
            action: 'FLAGGED_CONFLICT',
            trustState: 'CONFLICT_DETECTED',
            verificationSource: 'SOURCE_GROUNDED_ONLY'
          });
          continue;
        }

        if (mergeResult.action === 'EXACT_DUPLICATE') {
          report.exactDuplicatesFiltered++;
        } else if (mergeResult.action === 'COMPLEMENTARY_ENRICHMENT') {
          report.complementaryEnrichments++;
        }

        // 4. Trust State Resolution & Verification Reuse
        const trustRes = trustResolver.resolve(mergeResult.updatedTopic, extracted);
        if (trustRes.verificationSource === 'REUSED_EXISTING_EVIDENCE') {
          report.verificationsReused++;
        }

        corpusMap.set(matchedSlug, mergeResult.updatedTopic);
        report.topicsProcessed.push({
          slug: matchedSlug,
          title: mergeResult.updatedTopic.title,
          action: mergeResult.action === 'COMPLEMENTARY_ENRICHMENT' ? 'ENRICHED' : 'PROVENANCE_ADDED',
          trustState: trustRes.trustState,
          verificationSource: trustRes.verificationSource
        });
      } else {
        // NEW_ENTITY
        report.newEntitiesCreated++;

        let newOfficialEvidence: OfficialVerificationEvidence | null = null;
        if (options?.sourceVerificationExecutor) {
          try {
            newOfficialEvidence = await options.sourceVerificationExecutor(extracted);
          } catch (e) {
            newOfficialEvidence = null;
          }
        }

        const newTopic: CanonicalTopic = {
          id: extracted.eventId,
          slug: extracted.slugCandidate,
          title: extracted.title,
          priority: extracted.priority,
          revisionMinutes: extracted.priority.startsWith('P1') ? 8 : extracted.priority === 'P2_HIGH' ? 4 : 2,
          primaryCategory: extracted.category,
          secondaryCategories: [],
          primaryInstitution: 'RBI',
          verificationStatus: 'SOURCE_ONLY',
          mustMemorizeFacts: extracted.mustMemorizeFacts,
          knowUnderstandContext: extracted.knowUnderstandContext,
          examFocus: extracted.examFocus,
          optionalFacts: [],
          whatHappened: [extracted.title],
          initialEventDate: extracted.eventDate,
          lastUpdatedDate: extracted.eventDate,
          chronologicalMonth: extracted.eventDate.slice(0, 7),
          activeInMonths: [extracted.eventDate.slice(0, 7)],
          chronologicalWeek: `Week-${Math.ceil(parseInt(extracted.eventDate.slice(8, 10)) / 7)}`,
          updatesHistory: [],
          relatedTopics: [],
          sourceReferences: [extracted.sourceReference],
          informationType: 'OTHER',
          compressionLevel: extracted.priority.startsWith('P1') ? 'C4' : extracted.priority === 'P2_HIGH' ? 'C3' : 'C1',
          lifecycleStatus: 'ACTIVE',
          contentMarkdown: `# ${extracted.title}\n\n${extracted.mustMemorizeFacts.map(f => `- ${f}`).join('\n')}`
        };

        const trustRes = trustResolver.resolve(newTopic, extracted, {
          newOfficialFetchResult: newOfficialEvidence
        });

        if (trustRes.verificationSource === 'NEW_OFFICIAL_FETCH') {
          report.newOfficialVerifications++;
        }

        corpusMap.set(newTopic.slug, newTopic);
        report.topicsProcessed.push({
          slug: newTopic.slug,
          title: newTopic.title,
          action: 'CREATED',
          trustState: trustRes.trustState,
          verificationSource: trustRes.verificationSource
        });
      }
    }

    return {
      updatedCorpus: Array.from(corpusMap.values()),
      report
    };
  }

  public getVerificationRegistry(): VerificationRegistry {
    return this.verificationRegistry;
  }

  public getReviewQueue(): ReviewQueue {
    return this.reviewQueue;
  }
}
