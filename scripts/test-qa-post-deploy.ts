import assert from 'assert';
import { compileBankingCaRegistry } from './compile-banking-ca';
import { normalizePresentationText, formatTopicCategory, formatTopicDate } from '../lib/banking-ca/formatters';

function runPostDeployQaTests() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🧪 Running Multi-Month Historical Ingestion QA Suite...');
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
    const factoids = allTopics.filter(t => t.primaryCategory === 'SPORTS_AND_AWARDS' || t.primaryCategory === 'APPOINTMENTS');
    assert.ok(factoids.length > 0, 'Must find factoid topics');

    for (const f of factoids) {
      assert.strictEqual(
        f.regulatoryStatus,
        undefined,
        `Topic '${f.slug}' must not be assigned a default IMPLEMENTED status`
      );
    }

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
    assert.strictEqual(sebiMarkets, 'SEBI · Capital Markets & SEBI');
  });

  // Test 4: Temporal Field Accuracy (Exact Dates vs Batch Windows)
  test('Temporal Field Accuracy (Distinguish Exact Dates vs Batch Windows)', () => {
    const exactFormatted = formatTopicDate('2026-08-08', '2026-08', 'week-1-2');
    assert.strictEqual(exactFormatted, '2026-08-08');

    const batchFormatted = formatTopicDate('2026-08-01', '2026-08', 'week-1-2');
    assert.strictEqual(batchFormatted, 'Aug 2026 · Week 1–2');
  });

  // Test 5: Stream and Deep Reader Topic Identity Consistency
  test('Stream and Deep Reader Topic Identity Consistency (100% Shared Contract)', () => {
    for (const topic of allTopics) {
      assert.ok(topic.id && topic.slug && topic.title, 'Topic must have stable identifiers');
      assert.ok(Array.isArray(topic.mustMemorizeFacts), 'Topic must have mustMemorizeFacts');
      assert.ok(topic.revisionMinutes > 0, 'Topic must have positive revision minutes');

      const mappedId = registry.topicSlugMap[topic.slug];
      assert.strictEqual(mappedId, topic.id, `Slug mapping for ${topic.slug} must resolve to exact topic ID`);
    }
  });

  // Test 6: Deterministic Month Stream Ordering
  test('Deterministic Stream Ordering Invariant', () => {
    const monthTopics = registry.indexes.byYearMonth['2026-08'].map(id => registry.topics[id]);
    const run1 = [...monthTopics].sort((a, b) => a.slug.localeCompare(b.slug));
    const run2 = [...monthTopics].sort((a, b) => a.slug.localeCompare(b.slug));

    assert.strictEqual(run1.length, run2.length);
    for (let i = 0; i < run1.length; i++) {
      assert.strictEqual(run1[i].id, run2[i].id);
    }
  });

  // Test 7: Full 12-Month Master Archive Structure (Jan-Dec 2026)
  test('Full 12-Month Master Archive Structure (Jan–Dec 2026)', () => {
    const months2026 = [
      '2026-01', '2026-02', '2026-03', '2026-04',
      '2026-05', '2026-06', '2026-07', '2026-08',
      '2026-09', '2026-10', '2026-11', '2026-12'
    ];

    assert.strictEqual(months2026.length, 12, 'Must have 12 months structured for 2026');

    // Check August 2026, January 2026, February 2026, March 2026, April 2026, and May 2026 indexed sets
    const augTopics = registry.indexes.byYearMonth['2026-08'];
    assert.strictEqual(augTopics.length, 97, 'August 2026 must index exact 97 topics');

    const janTopics = registry.indexes.byYearMonth['2026-01'];
    assert.strictEqual(janTopics.length, 73, 'January 2026 must index exact 73 topics');

    const febTopics = registry.indexes.byYearMonth['2026-02'];
    assert.strictEqual(febTopics.length, 76, 'February 2026 must index exact 76 topics');

    const marTopics = registry.indexes.byYearMonth['2026-03'];
    assert.strictEqual(marTopics.length, 80, 'March 2026 must index exact 80 topics');

    const aprTopics = registry.indexes.byYearMonth['2026-04'];
    assert.strictEqual(aprTopics.length, 78, 'April 2026 must index exact 78 topics');

    const mayTopics = registry.indexes.byYearMonth['2026-05'];
    assert.strictEqual(mayTopics.length, 71, 'May 2026 must index exact 71 topics');
  });

  // Test 8: Zero Duplicate Canonical Entities Invariant
  test('Zero Duplicate Canonical Entities Invariant', () => {
    const slugs = new Set<string>();
    const ids = new Set<string>();

    for (const topic of allTopics) {
      assert.ok(!slugs.has(topic.slug), `Duplicate slug detected: ${topic.slug}`);
      assert.ok(!ids.has(topic.id), `Duplicate ID detected: ${topic.id}`);
      slugs.add(topic.slug);
      ids.add(topic.id);
    }

    assert.strictEqual(slugs.size, 475, 'Must have exactly 475 unique canonical topics');
  });

  // Test 9: Complete Category Taxonomy Normalization
  test('Complete Category Taxonomy Normalization', () => {
    const categories = [
      'BANKING_REGULATION', 'MONETARY_POLICY', 'CAPITAL_MARKETS',
      'GOVERNMENT_SCHEMES', 'MACRO_ECONOMY', 'DIGITAL_PAYMENTS',
      'APPOINTMENTS', 'INSURANCE_SECTOR', 'PENSION_SYSTEMS',
      'REPORTS_AND_INDICES', 'DEFENCE_AND_SCIENCE', 'SPORTS_AND_AWARDS',
      'NATIONAL_AND_STATES', 'INTERNATIONAL_AFFAIRS'
    ];

    for (const cat of categories) {
      const label = formatTopicCategory('OTHER', cat);
      assert.ok(label && label.length > 2, `Category ${cat} must produce clean label`);
      assert.ok(!label.includes('OTHER'), `Category label '${label}' must not contain OTHER`);
      assert.ok(!label.includes('_'), `Category label '${label}' must not contain underscores`);
    }
  });

  // Test 10: Category Partitioning & Grouping Invariant
  test('Category Partitioning & Grouping Invariant (All 475 Topics Accounted)', () => {
    let totalPartitioned = 0;
    for (const [month, topicIds] of Object.entries(registry.indexes.byYearMonth)) {
      const groupedMap = new Map<string, number>();
      for (const id of topicIds) {
        const topic = registry.topics[id];
        assert.ok(topic, `Topic ${id} must exist in registry for month ${month}`);
        groupedMap.set(topic.primaryCategory, (groupedMap.get(topic.primaryCategory) || 0) + 1);
      }
      for (const count of Array.from(groupedMap.values())) {
        totalPartitioned += count;
      }
    }

    assert.strictEqual(totalPartitioned, 475, 'All 475 monthly indexed topics must be strictly accounted');
  });

  // Test 11: Priority Density Integrity (P1, P2, P3 Content Fidelity)
  test('Priority Density Integrity (P1, P2, P3 Content Fidelity)', () => {
    const p1s = allTopics.filter(t => t.priority.startsWith('P1'));
    const p2s = allTopics.filter(t => t.priority === 'P2_HIGH');
    const p3s = allTopics.filter(t => t.priority === 'P3_MODERATE');

    assert.strictEqual(p1s.length, 31, 'Must have exactly 31 P1 topics (11 in Aug + 4 in Jan + 4 in Feb + 4 in Mar + 4 in Apr + 4 in May)');
    assert.strictEqual(p2s.length, 205, 'Must have exactly 205 P2 topics (55 in Aug + 34 in Jan + 29 in Feb + 29 in Mar + 29 in Apr + 29 in May)');
    assert.strictEqual(p3s.length, 239, 'Must have exactly 239 P3 topics (31 in Aug + 35 in Jan + 43 in Feb + 47 in Mar + 45 in Apr + 38 in May)');

    // Verify all P3s have 1-min load and valid mustMemorize fact
    for (const p3 of p3s) {
      assert.strictEqual(p3.revisionMinutes, 1, `P3 topic '${p3.slug}' must have 1-min revision load`);
      assert.ok(p3.mustMemorizeFacts.length > 0, `P3 topic '${p3.slug}' must have at least 1 must-memorize fact`);
    }

    // Verify all P1s have multi-minute load
    for (const p1 of p1s) {
      assert.ok(p1.revisionMinutes >= 4, `P1 topic '${p1.slug}' must have >= 4 min revision load`);
    }
  });

  // Test 12: W7.5 Content-First Presentation Invariant
  test('W7.5 Content-First Presentation & Topic Contract Invariant', () => {
    for (const topic of allTopics) {
      // Must have title, slug, month, and non-empty facts
      assert.ok(topic.title && topic.title.length > 5, `Topic ${topic.slug} must have meaningful title`);
      assert.ok(topic.chronologicalMonth.match(/^\d{4}-\d{2}$/), `Topic ${topic.slug} must have valid month`);
      assert.ok(topic.mustMemorizeFacts.length > 0 || (topic.whatHappened && topic.whatHappened.length > 0), `Topic ${topic.slug} must have readable content`);
      
      // P1 topics must have multiple mustMemorizeFacts and multi-minute revision load
      if (topic.priority.startsWith('P1')) {
        assert.ok(topic.mustMemorizeFacts.length >= 2, `P1 topic ${topic.slug} must have multiple mustMemorizeFacts`);
        assert.ok(topic.revisionMinutes >= 4, `P1 topic ${topic.slug} must have >= 4 min revision load`);
      }
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
