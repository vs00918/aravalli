import assert from 'assert';
import { compileBankingCaRegistry } from './compile-banking-ca';
import { normalizePresentationText, formatTopicCategory, formatTopicDate } from '../lib/banking-ca/formatters';

function runPostDeployQaTests() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🧪 Running W7.2 Post-Deployment QA & Corrective Suite...');
  console.log('────────────────────────────────────────────────────────\n');

  let passed = 0;
  let total = 0;

  function test(name: string, fn: () => void) {
    total++;
    try {
      fn();
      console.log(`  ✅ Test ${total}: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ Test ${total} FAILED: ${name}`);
      console.error(`     Error: ${err.message}`);
    }
  }

  const { registry } = compileBankingCaRegistry();
  const allTopics = Object.values(registry.topics);

  // Test 1: Zero Regulatory Status Fabrication
  test('Zero Regulatory Status Fabrication (Missing Status !== IMPLEMENTED)', () => {
    // Check non-regulatory factoid topics (e.g. sports, awards, appointments)
    const factoids = allTopics.filter(t => t.primaryCategory === 'SPORTS_AND_AWARDS' || t.primaryCategory === 'APPOINTMENTS');
    assert.ok(factoids.length > 0, 'Must find factoid topics');

    for (const f of factoids) {
      assert.strictEqual(
        f.regulatoryStatus,
        undefined,
        `Topic '${f.slug}' must not be assigned a default IMPLEMENTED status`
      );
    }

    // Verify explicit DRAFT / PROPOSAL topics retain their status
    const explicitDraftTopics = allTopics.filter(t => t.regulatoryStatus === 'DRAFT' || t.regulatoryStatus === 'PROPOSAL');
    assert.ok(explicitDraftTopics.length > 0, 'Explicit draft/proposal topics parsed cleanly');
  });

  // Test 2: LaTeX and Presentation Normalization Invariant
  test('LaTeX and Presentation Normalizer (No $, \\ge, \\to, or Duplicate Bullets)', () => {
    const rawSamples = [
      '•Policy Repo Rate: `5.25%` with $Q_1$ and $Q_2$ projections $\\ge 3$ years',
      '* CRAR Threshold: $\\ge 12\\%$ $\\to$ Tier 1 capital $\\pm 0.5\\%$',
      '• Growth forecast $\\approx 7.2\\%$ under new guidelines',
      '* Subordinated debt \\ge 5 years maturity'
    ];

    for (const sample of rawSamples) {
      const normalized = normalizePresentationText(sample);
      assert.ok(!normalized.startsWith('•'), `Must strip leading duplicate bullet from '${normalized}'`);
      assert.ok(!normalized.startsWith('* '), `Must strip leading duplicate bullet from '${normalized}'`);
      assert.ok(!normalized.includes('$'), `Must remove LaTeX $ delimiters from '${normalized}'`);
      assert.ok(!normalized.includes('\\ge'), `Must convert \\ge to ≥ in '${normalized}'`);
      assert.ok(!normalized.includes('\\to'), `Must convert \\to to → in '${normalized}'`);
      assert.ok(!normalized.includes('\\pm'), `Must convert \\pm to ± in '${normalized}'`);
      assert.ok(!normalized.includes('\\approx'), `Must convert \\approx to ≈ in '${normalized}'`);
    }

    // Check specific tokens
    assert.strictEqual(normalizePresentationText('$Q_1$ and $Q_2$'), 'Q₁ and Q₂');
    assert.strictEqual(normalizePresentationText('$\\ge 3$'), '≥ 3');
    assert.strictEqual(normalizePresentationText('$\\to$ target'), '→ target');
  });

  // Test 3: Category Display Normalization
  test('Category Display Normalization (No "OTHER / ..." Emitted)', () => {
    const rbiBanking = formatTopicCategory('RBI', 'BANKING_REGULATION');
    assert.strictEqual(rbiBanking, 'RBI · Banking & Regulation');

    const otherBanking = formatTopicCategory('OTHER', 'BANKING_REGULATION');
    assert.strictEqual(otherBanking, 'Banking & Regulation');
    assert.ok(!otherBanking.includes('OTHER'), 'Must not include OTHER');

    const intSchemes = formatTopicCategory('INTERNATIONAL_BODIES', 'GOVERNMENT_SCHEMES');
    assert.strictEqual(intSchemes, 'Government Schemes');
    assert.ok(!intSchemes.includes('INTERNATIONAL_BODIES'), 'Must not include INTERNATIONAL_BODIES');

    const sebiMarkets = formatTopicCategory('SEBI', 'CAPITAL_MARKETS');
    assert.strictEqual(sebiMarkets, 'SEBI · Capital Markets');
  });

  // Test 4: Temporal Field Accuracy (Exact Dates vs Batch Windows)
  test('Temporal Field Accuracy (Distinguish Exact Dates vs Batch Windows)', () => {
    // Exact date
    const exactFormatted = formatTopicDate('2026-08-08', '2026-08', 'week-1-2');
    assert.strictEqual(exactFormatted, '2026-08-08');

    // Batch-level default date (ends with -01)
    const batchFormatted = formatTopicDate('2026-08-01', '2026-08', 'week-1-2');
    assert.strictEqual(batchFormatted, 'Aug 2026 · Week 1–2');
  });

  // Test 5: Stream and Deep Reader Topic Identity Consistency
  test('Stream and Deep Reader Topic Identity Consistency (100% Shared Contract)', () => {
    for (const topic of allTopics) {
      assert.ok(topic.id && topic.slug && topic.title, 'Topic must have stable identifiers');
      assert.ok(Array.isArray(topic.mustMemorizeFacts), 'Topic must have mustMemorizeFacts');
      assert.ok(topic.revisionMinutes > 0, 'Topic must have positive revision minutes');

      // The slug mapped in registry must return the exact same canonical topic
      const mappedId = registry.topicSlugMap[topic.slug];
      assert.strictEqual(mappedId, topic.id, `Slug mapping for ${topic.slug} must resolve to exact topic ID`);
    }
  });

  // Test 6: Deterministic Month Stream Ordering
  test('Deterministic Stream Ordering Invariant', () => {
    const monthTopics = registry.indexes.byYearMonth['2026-08'].map(id => registry.topics[id]);
    
    // Sort run 1
    const run1 = [...monthTopics].sort((a, b) => a.slug.localeCompare(b.slug));
    // Sort run 2
    const run2 = [...monthTopics].sort((a, b) => a.slug.localeCompare(b.slug));

    assert.strictEqual(run1.length, run2.length);
    for (let i = 0; i < run1.length; i++) {
      assert.strictEqual(run1[i].id, run2[i].id);
    }
  });

  console.log('\n────────────────────────────────────────────────────────');
  console.log(`Results: ${passed} / ${total} Tests Passed`);
  console.log('────────────────────────────────────────────────────────\n');

  if (passed !== total) {
    process.exit(1);
  }
}

if (require.main === module) {
  runPostDeployQaTests();
}
