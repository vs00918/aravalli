import { z } from 'zod';

/**
 * Epistemic Status Hierarchy
 * Formally separates speaker assertion from structural implication and higher-level synthesis.
 */
export const EpistemicStatusSchema = z.enum([
  'SOURCE_EXTRACTED',    // Directly asserted in source text
  'SOURCE_DERIVED',      // Direct structural implication / arithmetic deduction
  'MODEL_INTERPRETATION' // Higher-level synthesis / educational bridge
]);
export type EpistemicStatus = z.infer<typeof EpistemicStatusSchema>;

/**
 * Claim Stance Taxonomy (9 Controlled Epistemic Stances)
 */
export const ClaimStanceSchema = z.enum([
  'ASSERTED',            // Source presents as factual reality
  'REFUTED',             // Source explicitly denies/disproves
  'HYPOTHETICAL',        // Conditional scenario ("If inflation breaches 6%...")
  'POSSIBLE',            // Speculative proposal / draft discussion
  'UNCERTAIN',           // Source expresses explicit ambiguity
  'QUOTED_OTHER',        // Attribution to third-party agency/report
  'ATTRIBUTED',          // Stated by committee/regulatory body
  'QUESTION',            // Exploratory inquiry
  'EXAMPLE_ONLY'         // Case illustration without universal mandate
]);
export type ClaimStance = z.infer<typeof ClaimStanceSchema>;

/**
 * Source Span Schema for Exact Provenance Verification
 */
export const SourceSpanSchema = z.object({
  startOffset: z.number().int().nonnegative().optional(),
  endOffset: z.number().int().nonnegative().optional(),
  segmentIds: z.array(z.string().min(1)),
  quotedText: z.string().min(1)
});
export type SourceSpan = z.infer<typeof SourceSpanSchema>;

/**
 * Extracted Fact Schema
 */
export const ExtractedFactSchema = z.object({
  factId: z.string().min(1),
  statement: z.string().min(1),
  epistemicStatus: EpistemicStatusSchema,
  stance: ClaimStanceSchema,
  numericalAnchors: z.array(z.string()).default([]),
  temporalAnchor: z.string().optional(),
  institutionalEntity: z.string().optional(),
  provenance: SourceSpanSchema
});
export type ExtractedFact = z.infer<typeof ExtractedFactSchema>;

/**
 * Mechanism Step Schema
 */
export const MechanismStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  action: z.string().min(1),
  result: z.string().min(1),
  provenance: SourceSpanSchema
});
export type MechanismStep = z.infer<typeof MechanismStepSchema>;

/**
 * Extracted Mechanism Schema
 */
export const ExtractedMechanismSchema = z.object({
  mechanismId: z.string().min(1),
  name: z.string().min(1),
  trigger: z.string().min(1),
  steps: z.array(MechanismStepSchema).min(1),
  outcome: z.string().min(1)
});
export type ExtractedMechanism = z.infer<typeof ExtractedMechanismSchema>;

/**
 * Knowledge Intermediate Representation (Knowledge IR) Schema
 */
export const KnowledgeIRSchema = z.object({
  irVersion: z.literal('1.0.0'),
  documentId: z.string().min(1),
  batchId: z.string().min(1),
  chunkId: z.string().min(1),
  extractedAt: z.string().min(1),
  provider: z.string().min(1),
  model: z.string().min(1),
  facts: z.array(ExtractedFactSchema),
  mechanisms: z.array(ExtractedMechanismSchema).default([]),
  uncertainties: z.array(z.object({
    description: z.string().min(1),
    reason: z.string().min(1)
  })).default([]),
  tokenUsage: z.object({
    promptTokens: z.number().int().nonnegative(),
    completionTokens: z.number().int().nonnegative(),
    totalTokens: z.number().int().nonnegative()
  })
});
export type KnowledgeIR = z.infer<typeof KnowledgeIRSchema>;
