import fs from 'fs';
import path from 'path';
import { IngestionPipeline } from '../lib/banking-ca/pipeline/ingestion-pipeline';
import { VerificationRegistry } from '../lib/banking-ca/pipeline/verification-registry';
import { ReviewQueue } from '../lib/banking-ca/pipeline/review-queue';
import { RawIncomingFeedItem } from '../lib/banking-ca/pipeline/types';
import { CanonicalTopic } from '../lib/banking-ca/schema';

const rootDir = process.cwd();
const registryPath = path.join(rootDir, 'data/banking-ca-registry.json');

export async function runIngestion(inputFilePath?: string, persistRegistry: boolean = true) {
  console.log('────────────────────────────────────────────────────────');
  console.log('🚀 Mind of Aravalli — Permanent Production Ingestion CLI');
  console.log('────────────────────────────────────────────────────────\n');

  // 1. Load active canonical corpus
  if (!fs.existsSync(registryPath)) {
    throw new Error(`Registry file not found at ${registryPath}`);
  }
  const registryRaw = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const currentCorpus: CanonicalTopic[] = Object.values(registryRaw.topics);

  // 2. Load incoming feed items
  const feedTarget = inputFilePath || path.join(rootDir, 'data/incoming-feed.json');
  if (!fs.existsSync(feedTarget)) {
    console.log(`[Info] No incoming feed file found at '${feedTarget}'. Nothing to ingest.`);
    return;
  }

  let incomingItems: RawIncomingFeedItem[] = [];
  const { PdfExtractor } = await import('../lib/banking-ca/pipeline/pdf-extractor');
  const basename = path.basename(feedTarget);

  if (feedTarget.endsWith('.json')) {
    const rawFeedData = JSON.parse(fs.readFileSync(feedTarget, 'utf8'));
    incomingItems = Array.isArray(rawFeedData) ? rawFeedData : rawFeedData.items || [];
  } else if (feedTarget.toLowerCase().endsWith('.pdf')) {
    const pdfBuffer = fs.readFileSync(feedTarget);
    incomingItems = await PdfExtractor.extractFromPdf(pdfBuffer, {
      batchName: basename
    });
  } else {
    // Treat as raw text / markdown extract
    const rawText = fs.readFileSync(feedTarget, 'utf8');
    incomingItems = PdfExtractor.extractFromText({
      rawText,
      sourceName: basename.toLowerCase().includes('cgb') ? 'CGB_MENTORS' : basename.toLowerCase().includes('smartkeeda') ? 'SMARTKEEDA' : 'PIB',
      batchName: basename,
      publishedDate: new Date().toISOString().slice(0, 10)
    });
  }

  if (incomingItems.length === 0) {
    console.log('[Info] Incoming feed contains 0 items.');
    return;
  }

  console.log(`[Ingest] Processing ${incomingItems.length} incoming current-affairs item(s) from '${feedTarget}'...`);

  // 3. Initialize Production Pipeline Modules
  const verificationRegistry = new VerificationRegistry();
  const reviewQueue = new ReviewQueue();
  const pipeline = new IngestionPipeline(verificationRegistry, reviewQueue);

  // 4. Execute Full Pipeline
  const { updatedCorpus, report } = await pipeline.processFeed(
    incomingItems,
    currentCorpus,
    { batchId: `ingest-${Date.now()}` }
  );

  // 5. Update Canonical Registry (if persistRegistry is true)
  if (persistRegistry) {
    const topicMap: Record<string, CanonicalTopic> = {};
    for (const topic of updatedCorpus) {
      topicMap[topic.slug] = topic;
    }

    const p1Topics = updatedCorpus.filter(t => t.priority.startsWith('P1'));
    const p2Topics = updatedCorpus.filter(t => t.priority === 'P2_HIGH');
    const p3Topics = updatedCorpus.filter(t => t.priority === 'P3_MODERATE');

    const updatedRegistry = {
      ...registryRaw,
      generatedAt: new Date().toISOString(),
      summary: {
        ...registryRaw.summary,
        totalCanonicalTopics: updatedCorpus.length,
        activeP1Count: p1Topics.length,
        activeP1RevisionMinutes: p1Topics.reduce((acc, t) => acc + t.revisionMinutes, 0),
        totalP2Count: p2Topics.length,
        totalP3Count: p3Topics.length
      },
      topics: topicMap
    };

    fs.writeFileSync(registryPath, JSON.stringify(updatedRegistry, null, 2), 'utf8');
  }

  // 6. Output Summary Report
  console.log('\n=== Ingestion Completed Successfully ===');
  console.log(`Total Incoming Items       : ${report.totalIncomingItems}`);
  console.log(`New Entities Created       : ${report.newEntitiesCreated}`);
  console.log(`Existing Entities Matched  : ${report.existingEntitiesMatched}`);
  console.log(`Exact Duplicates Filtered  : ${report.exactDuplicatesFiltered}`);
  console.log(`Complementary Enrichments  : ${report.complementaryEnrichments}`);
  console.log(`Verifications Reused (0 net): ${report.verificationsReused}`);
  console.log(`New Official Verifications : ${report.newOfficialVerifications}`);
  console.log(`Review Queue Items Created : ${report.reviewQueueItemsCreated}`);
  console.log(`Updated Canonical Topics   : ${updatedCorpus.length} (Total in Database)`);
  console.log('────────────────────────────────────────────────────────\n');

  return { updatedCorpus, report };
}

if (require.main === module) {
  const target = process.argv[2];
  runIngestion(target).catch(err => {
    console.error('Ingestion failed:', err);
    process.exit(1);
  });
}
