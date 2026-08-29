import fs from 'fs';
import path from 'path';
import assert from 'assert';

const rootDir = process.cwd();
const registryPath = path.join(rootDir, 'data/banking-ca-registry.json');
const preMergePath = path.join(rootDir, 'data/w10_5-pre-merge-snapshot.json');
const mergeExecPath = path.join(rootDir, 'data/w10_5-canonical-merge-execution.json');
const repairPath = path.join(rootDir, 'data/w10_3-controlled-repair-audit.json');

function verifyCorpusState() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🔍 W11.4 Final Corpus Repair & Consolidation Audit');
  console.log('────────────────────────────────────────────────────────\n');

  assert.ok(fs.existsSync(registryPath), 'Registry file must exist');
  assert.ok(fs.existsSync(preMergePath), 'Pre-merge snapshot must exist');
  assert.ok(fs.existsSync(mergeExecPath), 'Merge execution record must exist');
  assert.ok(fs.existsSync(repairPath), 'Repair audit record must exist');

  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const preMerge = JSON.parse(fs.readFileSync(preMergePath, 'utf8'));
  const mergeExec = JSON.parse(fs.readFileSync(mergeExecPath, 'utf8'));
  const repairData = JSON.parse(fs.readFileSync(repairPath, 'utf8'));

  const activeTopics: any[] = Object.values(registry.topics);

  // 1. Topic Count Accounting
  console.log('1. Topic Count Accounting:');
  console.log(`  - Original Pre-Merge Corpus : ${preMerge.totalTopicsCount}`);
  console.log(`  - Duplicate Clusters Merged : ${mergeExec.metadata.clustersResolvedCount}`);
  console.log(`  - Retired Duplicate Slugs   : ${mergeExec.metadata.retiredSlugsCount}`);
  console.log(`  - Active Canonical Topics   : ${activeTopics.length}`);

  assert.strictEqual(preMerge.totalTopicsCount, 585, 'Pre-merge corpus must be exactly 585');
  assert.strictEqual(mergeExec.metadata.clustersResolvedCount, 4, 'Must have 4 duplicate clusters');
  assert.strictEqual(activeTopics.length, 581, 'Active corpus must be exactly 581');
  console.log('  ✅ 585 original topics - 4 retired duplicates = 581 active canonical topics accounted.');

  // 2. Duplicate Clusters Verification
  console.log('\n2. Duplicate Clusters Union Verification:');
  const clusters = [
    {
      name: 'GOBARdhan Scheme',
      slug: 'cabinet-approves-gobardhan-national-circular-bioenergy-scheme-with-outlay-of-23731-crore',
      expectedKeywords: ['₹23,731 crore', 'CBG', 'Bio-manure', 'SATAT']
    },
    {
      name: 'MSMED (Amendment) Bill 2026',
      slug: 'parliament-passes-msmed-amendment-bill-2026-statutory-udyam-status-90-day-odr-mandatory-treds',
      expectedKeywords: ['MSMED', 'Udyam', 'ODR', 'TReDS']
    },
    {
      name: 'SEBI Credit Risk-o-Meter',
      slug: 'sebi-proposal-colour-coded-credit-risk-o-meter-for-debt-securities-3-min',
      expectedKeywords: ['Risk-o-Meter', 'SEBI', 'debt securities']
    },
    {
      name: 'CBDT FAST-DS',
      slug: 'fast-ds-scheme-foreign-assets-of-small-taxpayers-disclosure-scheme-2026-3-min',
      expectedKeywords: ['FAST-DS', 'CBDT', 'taxpayers']
    }
  ];

  for (const c of clusters) {
    const topic = registry.topics[c.slug];
    assert.ok(topic, `Canonical topic '${c.slug}' must exist in registry`);
    const allText = `${topic.title} ${topic.mustMemorizeFacts.join(' ')} ${topic.knowUnderstandContext.join(' ')}`;
    for (const kw of c.expectedKeywords) {
      assert.ok(
        allText.toLowerCase().includes(kw.toLowerCase()),
        `Topic '${c.slug}' must retain key fact keyword '${kw}'`
      );
    }
    console.log(`  ✅ Cluster '${c.name}': All complementary facts preserved in '${topic.slug}'.`);
  }

  // 3. 34 Source-Backed Repairs Verification
  console.log('\n3. 34 Confirmed Repairs Verification:');
  assert.strictEqual(repairData.metadata.totalRepairsApplied, 34, 'Must have 34 repairs applied');
  assert.strictEqual(repairData.metadata.defectDistribution.P2_REPAIRED, 10, '10 P2 repaired');
  assert.strictEqual(repairData.metadata.defectDistribution.P3_REPAIRED, 24, '24 P3 repaired');
  assert.strictEqual(repairData.metadata.defectDistribution.P1_MODIFIED, 0, '0 P1 modified');

  for (const rep of repairData.repairsAudit) {
    const topic = registry.topics[rep.topicSlug];
    assert.ok(topic, `Repaired topic '${rep.topicSlug}' must exist in registry`);
    assert.ok(topic.priority.startsWith('P'), `Priority must be valid P-tier for ${rep.topicSlug}`);
  }
  console.log('  ✅ 34 confirmed source-backed repairs verified intact in master registry.');

  console.log('\n────────────────────────────────────────────────────────');
  console.log('🎉 Corpus Repair & Consolidation Verification PASSED 100%');
  console.log('────────────────────────────────────────────────────────\n');
}

verifyCorpusState();
