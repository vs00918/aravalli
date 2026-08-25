import fs from 'fs';
import path from 'path';
import {
  CanonicalTopic,
  IngestionBatch,
  BankingCaMasterRegistry,
  BankingCaMasterRegistrySchema,
  ExamTargetProfile
} from '../lib/banking-ca/schema';
import { parseCanonicalMarkdownFile } from '../lib/banking-ca/markdown-parser';

export function compileBankingCaRegistry(): { registry: BankingCaMasterRegistry; validationErrors: string[] } {
  const rootDir = path.join(__dirname, '..');
  const caDir = path.join(rootDir, 'knowledge-tree/banking-ca');

  if (!fs.existsSync(caDir)) {
    throw new Error(`Canonical directory not found: ${caDir}`);
  }

  const files = fs.readdirSync(caDir)
    .filter(f => f.endsWith('.md'))
    .sort(); // Deterministic file order

  const allTopicsMap: Record<string, CanonicalTopic> = {};
  const topicSlugMap: Record<string, string> = {};
  const batches: IngestionBatch[] = [];

  for (const file of files) {
    const filePath = path.join(caDir, file);
    const batchId = path.basename(file, '.md');
    const sourceDefault = file.includes('smartkeeda') ? 'SMARTKEEDA' : 'CGB_MENTORS';
    const month = '2026-08';
    const week = file.includes('part-2') ? 'week-3' : 'week-1-2';

    const { topics, batch } = parseCanonicalMarkdownFile(filePath, batchId, sourceDefault, month, week);
    batches.push(batch);

    for (const topic of topics) {
      if (allTopicsMap[topic.id]) {
        // Deterministic merge: Append source references, updates, and union activeInMonths
        const existing = allTopicsMap[topic.id];
        existing.sourceReferences = [...existing.sourceReferences, ...topic.sourceReferences];
        if (topic.updatesHistory && topic.updatesHistory.length > 0) {
          existing.updatesHistory = [...existing.updatesHistory, ...topic.updatesHistory];
        }
        // Union activeInMonths
        const mergedMonths = Array.from(new Set([...(existing.activeInMonths || []), ...(topic.activeInMonths || [])])).sort();
        existing.activeInMonths = mergedMonths;
        if (topic.lastUpdatedDate > existing.lastUpdatedDate) {
          existing.lastUpdatedDate = topic.lastUpdatedDate;
        }
      } else {
        allTopicsMap[topic.id] = topic;
        topicSlugMap[topic.slug] = topic.id;
      }
    }
  }

  // Predefined Exam Target Profiles (Decoupled Exam Window Invariant)
  const examProfiles: ExamTargetProfile[] = [
    {
      id: 'sbi-po-mains-2026',
      name: 'SBI PO Mains — September 2026',
      targetExamDate: '2026-09',
      windowStartMonth: '2026-04',
      windowEndMonth: '2026-09',
      isDefault: true,
      description: 'Active rolling 6-month high-yield window for SBI PO Mains.'
    },
    {
      id: 'ibps-po-mains-2026',
      name: 'IBPS PO Mains — October 2026',
      targetExamDate: '2026-10',
      windowStartMonth: '2026-04',
      windowEndMonth: '2026-10',
      isDefault: false,
      description: 'Extended 7-month high-yield window for IBPS PO Mains.'
    },
    {
      id: 'full-2026-archive',
      name: '2026 Annual Complete Master Archive',
      targetExamDate: '2026-12',
      windowStartMonth: '2026-01',
      windowEndMonth: '2026-12',
      isDefault: false,
      description: 'Comprehensive annual knowledge repository including background and historical developments.'
    }
  ];

  // Build Deterministic Indexes
  const sortedTopicIds = Object.keys(allTopicsMap).sort();

  const indexes = {
    byPriority: {
      P1_CRITICAL_DEEP: [] as string[],
      P1_CRITICAL_MEMORIZE: [] as string[],
      P2_HIGH: [] as string[],
      P3_MODERATE: [] as string[],
      P4_LOW_YIELD: [] as string[]
    },
    byCategory: {} as Record<string, string[]>,
    byInstitution: {} as Record<string, string[]>,
    byMonth: {} as Record<string, string[]>,
    byYearMonth: {} as Record<string, string[]>,
    changeSensitiveTopicIds: [] as string[]
  };

  let activeP1Count = 0;
  let activeP1Minutes = 0;
  let totalP2Count = 0;
  let totalP3Count = 0;

  for (const id of sortedTopicIds) {
    const topic = allTopicsMap[id];

    // Priority index
    indexes.byPriority[topic.priority].push(id);
    if (topic.priority === 'P1_CRITICAL_DEEP' || topic.priority === 'P1_CRITICAL_MEMORIZE') {
      activeP1Count++;
      activeP1Minutes += topic.revisionMinutes;
    } else if (topic.priority === 'P2_HIGH') {
      totalP2Count++;
    } else if (topic.priority === 'P3_MODERATE') {
      totalP3Count++;
    }

    // Category index
    if (!indexes.byCategory[topic.primaryCategory]) indexes.byCategory[topic.primaryCategory] = [];
    indexes.byCategory[topic.primaryCategory].push(id);

    // Institution index
    if (!indexes.byInstitution[topic.primaryInstitution]) indexes.byInstitution[topic.primaryInstitution] = [];
    indexes.byInstitution[topic.primaryInstitution].push(id);

    // Legacy byMonth index
    if (!indexes.byMonth[topic.chronologicalMonth]) indexes.byMonth[topic.chronologicalMonth] = [];
    indexes.byMonth[topic.chronologicalMonth].push(id);

    // Multi-month byYearMonth index
    const activeMonths = topic.activeInMonths && topic.activeInMonths.length > 0
      ? topic.activeInMonths
      : [topic.chronologicalMonth];

    for (const m of activeMonths) {
      if (!indexes.byYearMonth[m]) indexes.byYearMonth[m] = [];
      if (!indexes.byYearMonth[m].includes(id)) {
        indexes.byYearMonth[m].push(id);
      }
    }

    // Change sensitive index
    if (topic.changeAlert && topic.changeAlert.isChangeSensitive) {
      indexes.changeSensitiveTopicIds.push(id);
    }
  }

  // Sort all index arrays deterministically
  for (const cat of Object.keys(indexes.byCategory)) indexes.byCategory[cat].sort();
  for (const inst of Object.keys(indexes.byInstitution)) indexes.byInstitution[inst].sort();
  for (const m of Object.keys(indexes.byMonth)) indexes.byMonth[m].sort();
  for (const ym of Object.keys(indexes.byYearMonth)) indexes.byYearMonth[ym].sort();
  indexes.changeSensitiveTopicIds.sort();

  const registryPayload: BankingCaMasterRegistry = {
    schemaVersion: '1.0.0',
    generatedAt: '2026-08-25T18:00:00Z', // Static deterministic source timestamp
    activeWindowStart: '2026-04-01',
    summary: {
      totalCanonicalTopics: sortedTopicIds.length,
      activeP1Count,
      activeP1RevisionMinutes: activeP1Minutes,
      totalP2Count,
      totalP3Count,
      totalBatchesIngested: batches.length
    },
    examProfiles,
    topics: allTopicsMap,
    topicSlugMap,
    indexes,
    batches
  };

  // Validate with Zod schema
  const parseResult = BankingCaMasterRegistrySchema.safeParse(registryPayload);
  const validationErrors: string[] = [];

  if (!parseResult.success) {
    for (const err of parseResult.error.issues) {
      validationErrors.push(`[${err.path.join('.')}] ${err.message}`);
    }
  }

  return { registry: registryPayload, validationErrors };
}

// Direct CLI Execution
if (require.main === module) {
  try {
    console.log('────────────────────────────────────────────────────────');
    console.log('⚡ Compiling Banking Current Affairs Master Registry...');
    console.log('────────────────────────────────────────────────────────');

    const { registry, validationErrors } = compileBankingCaRegistry();

    if (validationErrors.length > 0) {
      console.error(`\n❌ COMPILATION FAILED: ${validationErrors.length} Schema Validation Errors:`);
      validationErrors.forEach(err => console.error(`  - ${err}`));
      process.exit(1);
    }

    const outPath = path.join(__dirname, '../data/banking-ca-registry.json');
    fs.writeFileSync(outPath, JSON.stringify(registry, null, 2));

    // Also update knowledge-registry.json for backward compatibility
    const compatRegistry = {
      volumes: [
        {
          id: "banking-ca-2026",
          slug: "banking-ca-2026",
          number: 1,
          title: "Banking & Economy Current Affairs (April 2026 – Oct 2026)",
          shortTitle: "Banking CA 2026",
          icon: "🏦",
          tagline: "SBI PO & IBPS PO Mains Exam Intelligence",
          description: "High-yield, deduplicated, and exam-filtered current affairs covering RBI regulations, banking reforms, monetary policy, schemes, and reports.",
          chapters: registry.batches.map((b, idx) => ({
            slug: b.batchId,
            number: idx + 1,
            title: `Banking & Economy CA: ${b.dateRange}`,
            subtitle: b.mentorVerdict
          }))
        }
      ]
    };

    const compatPath = path.join(__dirname, '../data/knowledge-registry.json');
    fs.writeFileSync(compatPath, JSON.stringify(compatRegistry, null, 2));

    console.log('\n✅ CA Knowledge Compilation Successful!');
    console.log('────────────────────────────────────────────────────────');
    console.log(`Canonical Files Scanned : ${registry.batches.length}`);
    console.log(`Total Canonical Topics  : ${registry.summary.totalCanonicalTopics}`);
    console.log(`Active P1 Topics        : ${registry.summary.activeP1Count} (${registry.summary.activeP1RevisionMinutes} min total)`);
    console.log(`P2 High-Yield Topics    : ${registry.summary.totalP2Count}`);
    console.log(`P3 Moderate Topics      : ${registry.summary.totalP3Count}`);
    console.log(`Change-Sensitive Alerts : ${registry.indexes.changeSensitiveTopicIds.length}`);
    console.log(`Exam Target Profiles    : ${registry.examProfiles.length}`);
    console.log(`Indexed Months (YYYY-MM): ${Object.keys(registry.indexes.byYearMonth).join(', ')}`);
    console.log('Errors: 0 | Warnings: 0');
    console.log('Output: data/banking-ca-registry.json');
    console.log('────────────────────────────────────────────────────────\n');

  } catch (error: any) {
    console.error(`\n❌ COMPILATION CRASH: ${error.message}`);
    process.exit(1);
  }
}
