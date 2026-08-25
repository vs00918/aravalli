import { z } from 'zod';

/** Priority Tiers */
export const PriorityLevelSchema = z.enum([
  'P1_CRITICAL_DEEP',
  'P1_CRITICAL_MEMORIZE',
  'P2_HIGH',
  'P3_MODERATE',
  'P4_LOW_YIELD'
]);
export type PriorityLevel = z.infer<typeof PriorityLevelSchema>;

/** Regulatory Status */
export const RegulatoryStatusSchema = z.enum([
  'DRAFT',
  'PROPOSAL',
  'CONSULTATION',
  'APPROVED',
  'NOTIFIED',
  'IMPLEMENTED'
]);
export type RegulatoryStatus = z.infer<typeof RegulatoryStatusSchema>;

/** Verification Status */
export const VerificationStatusSchema = z.enum([
  'PRIMARY_SOURCE_VERIFIED',
  'CROSS_SOURCE_CORROBORATED',
  'SOURCE_ONLY',
  'VERIFICATION_PENDING',
  'CONFLICTING'
]);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

/** Primary Institutions */
export const InstitutionIdSchema = z.enum([
  'RBI',
  'SEBI',
  'IRDAI',
  'PFRDA',
  'NPCI',
  'IFSCA',
  'MINISTRY_OF_FINANCE',
  'EXIM_BANK',
  'NABARD',
  'SIDBI',
  'NCGTC',
  'INTERNATIONAL_BODIES',
  'OTHER'
]);
export type InstitutionId = z.infer<typeof InstitutionIdSchema>;

/** Subject Categories */
export const CategoryIdSchema = z.enum([
  'BANKING_REGULATION',
  'MONETARY_POLICY',
  'MACRO_ECONOMY',
  'CAPITAL_MARKETS',
  'INSURANCE_SECTOR',
  'PENSION_SYSTEMS',
  'DIGITAL_PAYMENTS',
  'GOVERNMENT_SCHEMES',
  'APPOINTMENTS',
  'REPORTS_AND_INDICES',
  'NATIONAL_AND_STATES',
  'INTERNATIONAL_AFFAIRS',
  'DEFENCE_AND_SCIENCE',
  'SPORTS_AND_AWARDS'
]);
export type CategoryId = z.infer<typeof CategoryIdSchema>;

/** Topic Update */
export const TopicUpdateSchema = z.object({
  updateId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  batchId: z.string().min(1),
  summary: z.string().min(1),
  previousValue: z.string().optional(),
  newValue: z.string().optional(),
  changeReason: z.string().optional()
});
export type TopicUpdate = z.infer<typeof TopicUpdateSchema>;

/** Change Alert */
export const ChangeAlertSchema = z.object({
  isChangeSensitive: z.boolean(),
  currentFactSummary: z.string().min(1),
  changeTrigger: z.string().min(1),
  targetRecheckDate: z.string().optional(),
  actionBeforeExam: z.string().min(1)
});
export type ChangeAlert = z.infer<typeof ChangeAlertSchema>;

/** Source Reference */
export const SourceReferenceSchema = z.object({
  sourceName: z.enum(['CGB_MENTORS', 'SMARTKEEDA', 'PIB', 'OFFICIAL_GAZETTE', 'OTHER']),
  batchName: z.string().min(1),
  pageNumbers: z.array(z.number().int().positive()).optional(),
  publishedDate: z.string(),
  citationSnippet: z.string().optional()
});
export type SourceReference = z.infer<typeof SourceReferenceSchema>;

/** Canonical Topic Schema */
export const CanonicalTopicSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  shortTitle: z.string().optional(),
  subtitle: z.string().optional(),
  priority: PriorityLevelSchema,
  revisionMinutes: z.number().int().min(1).max(60),
  
  primaryCategory: CategoryIdSchema,
  secondaryCategories: z.array(CategoryIdSchema).default([]),
  primaryInstitution: InstitutionIdSchema,
  
  regulatoryStatus: RegulatoryStatusSchema.default('IMPLEMENTED'),
  verificationStatus: VerificationStatusSchema.default('SOURCE_ONLY'),
  
  whatHappened: z.array(z.string()).default([]),
  mustMemorizeFacts: z.array(z.string().min(1)),
  knowUnderstandContext: z.array(z.string().min(1)).default([]),
  examFocus: z.array(z.string()).default([]),
  optionalFacts: z.array(z.string()).default([]),
  
  initialEventDate: z.string().min(1),
  lastUpdatedDate: z.string().min(1),
  chronologicalMonth: z.string().regex(/^\d{4}-\d{2}$/),
  chronologicalWeek: z.string().min(1),
  
  changeAlert: ChangeAlertSchema.optional(),
  updatesHistory: z.array(TopicUpdateSchema).default([]),
  sourceReferences: z.array(SourceReferenceSchema).default([]),
  
  contentMarkdown: z.string().min(1)
});
export type CanonicalTopic = z.infer<typeof CanonicalTopicSchema>;

/** Ingestion Batch Schema */
export const IngestionBatchSchema = z.object({
  batchId: z.string().min(1),
  sourceName: z.string().min(1),
  dateRange: z.string().min(1),
  ingestedAt: z.string().min(1),
  rawItemsCount: z.number().int().nonnegative(),
  duplicatesCount: z.number().int().nonnegative(),
  enrichmentsCount: z.number().int().nonnegative(),
  updatesCount: z.number().int().nonnegative(),
  newTopicsCount: z.number().int().nonnegative(),
  ignoredCount: z.number().int().nonnegative(),
  primaryVerifiedCount: z.number().int().nonnegative().default(0),
  sourceOnlyCount: z.number().int().nonnegative().default(0),
  verificationPendingCount: z.number().int().nonnegative().default(0),
  mentorVerdict: z.string().min(1)
});
export type IngestionBatch = z.infer<typeof IngestionBatchSchema>;

/** Master Registry Schema */
export const BankingCaMasterRegistrySchema = z.object({
  schemaVersion: z.literal('1.0.0'),
  generatedAt: z.string().min(1),
  activeWindowStart: z.string().min(1),
  
  summary: z.object({
    totalCanonicalTopics: z.number().int().nonnegative(),
    activeP1Count: z.number().int().nonnegative(),
    activeP1RevisionMinutes: z.number().int().nonnegative(),
    totalP2Count: z.number().int().nonnegative(),
    totalP3Count: z.number().int().nonnegative(),
    totalBatchesIngested: z.number().int().nonnegative()
  }),
  
  topics: z.record(z.string(), CanonicalTopicSchema),
  topicSlugMap: z.record(z.string(), z.string()),
  
  indexes: z.object({
    byPriority: z.object({
      P1_CRITICAL_DEEP: z.array(z.string()),
      P1_CRITICAL_MEMORIZE: z.array(z.string()),
      P2_HIGH: z.array(z.string()),
      P3_MODERATE: z.array(z.string()),
      P4_LOW_YIELD: z.array(z.string())
    }),
    byCategory: z.record(z.string(), z.array(z.string())),
    byInstitution: z.record(z.string(), z.array(z.string())),
    byMonth: z.record(z.string(), z.array(z.string())),
    changeSensitiveTopicIds: z.array(z.string())
  }),
  
  batches: z.array(IngestionBatchSchema)
});
export type BankingCaMasterRegistry = z.infer<typeof BankingCaMasterRegistrySchema>;
