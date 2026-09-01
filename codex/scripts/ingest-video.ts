import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchRawTranscript } from '../src/pipeline/fetch-transcript.ts';
import { cleanTranscript } from '../src/pipeline/clean-transcript.ts';
import { validateSourceIdentity } from '../src/pipeline/source-identity-validator.ts';
import { loadTopicIndex } from '../src/pipeline/topic-retriever.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const codexRoot = path.join(__dirname, '..');
const pipelineRunsDir = path.join(codexRoot, 'pipeline_runs');

async function main() {
  const urlOrId = process.argv[2];
  if (!urlOrId) {
    console.error('Usage: npx tsx scripts/ingest-video.ts <YouTube_URL_or_Video_ID>');
    process.exit(1);
  }

  console.log(`\n======================================================`);
  console.log(`🎬 AGENT-NATIVE INGESTION ENGINE: ACQUIRING SOURCE`);
  console.log(`======================================================\n`);

  const t0 = Date.now();
  console.log(`📡 Fetching live transcript for: ${urlOrId}...`);
  const raw = await fetchRawTranscript(urlOrId);
  const fetchMs = Date.now() - t0;

  console.log(`✅ Raw transcript retrieved in ${fetchMs}ms`);
  console.log(`- Video ID:  ${raw.video_id}`);
  console.log(`- Segments:  ${raw.segments.length}`);
  console.log(`- Duration:  ${Math.round(raw.duration_seconds)}s (${(raw.duration_seconds / 60).toFixed(1)} mins)`);

  // Source Identity Validation
  console.log('\n🔍 Validating source metadata via oEmbed...');
  const identity = await validateSourceIdentity(raw, raw.title || 'Untitled');
  console.log(`- Source Observed Title: "${identity.source_observed_title}"`);
  console.log(`- Channel:               "${identity.channel_observed}"`);
  console.log(`- Status:                ${identity.classification}`);

  // Cleaning transcript
  const clean = cleanTranscript(raw);
  const totalCleanWords = clean.cleaned_segments.reduce((acc, s) => acc + s.text.split(/\s+/).filter(Boolean).length, 0);
  console.log(`- Cleaned Segments:      ${clean.total_cleaned_segments} (Preserved ${clean.retention_rate_pct.toFixed(1)}%)`);
  console.log(`- Total Word Count:      ${totalCleanWords} words`);

  // Save isolated pipeline artifacts
  const runDir = path.join(pipelineRunsDir, raw.video_id);
  fs.mkdirSync(runDir, { recursive: true });
  fs.writeFileSync(path.join(runDir, 'raw-transcript.json'), JSON.stringify(raw, null, 2), 'utf8');
  fs.writeFileSync(path.join(runDir, 'clean-transcript.json'), JSON.stringify(clean, null, 2), 'utf8');

  // Full clean transcript plain-text export for easy agent context loading
  const transcriptText = clean.cleaned_segments.map((s) => `[${s.id}] (${s.start.toFixed(1)}s-${s.end.toFixed(1)}s): ${s.text}`).join('\n');
  fs.writeFileSync(path.join(runDir, 'transcript-for-agent.txt'), transcriptText, 'utf8');

  // Existing Codex Corpus Comparison
  console.log('\n📚 Searching existing 45-topic Codex for candidate connections...');
  const topics = loadTopicIndex();
  const textSample = transcriptText.toLowerCase();

  const candidateMatches: Array<{ slug: string; title: string; overlapScore: number }> = [];
  for (const topic of topics) {
    const titleWords = topic.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const tagWords = (topic.tags || []).map((t) => t.toLowerCase());
    const allKeywords = [...titleWords, ...tagWords];

    let matches = 0;
    for (const kw of allKeywords) {
      if (textSample.includes(kw)) matches++;
    }

    if (matches > 0) {
      candidateMatches.push({
        slug: topic.slug,
        title: topic.title,
        overlapScore: matches
      });
    }
  }

  candidateMatches.sort((a, b) => b.overlapScore - a.overlapScore);

  console.log('\n======================================================');
  console.log('📋 INGESTION READY FOR AGENT SYNTHESIS');
  console.log('======================================================');
  console.log(`📁 Artifacts Stored: codex/pipeline_runs/${raw.video_id}/`);
  console.log(`📄 Agent Transcript Text: codex/pipeline_runs/${raw.video_id}/transcript-for-agent.txt`);
  console.log(`\n🔗 Top Candidate Existing Topics for Cross-Linking:`);
  candidateMatches.slice(0, 5).forEach((c, idx) => {
    console.log(`   ${idx + 1}. [${c.slug}] "${c.title}" (Score: ${c.overlapScore})`);
  });
  console.log('\n✨ Antigravity Agent can now read transcript-for-agent.txt and synthesize the note directly using podcast-and-video-distiller skill!\n');
}

main().catch((err) => {
  console.error('Fatal ingestion error:', err);
  process.exit(1);
});
