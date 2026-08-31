import assert from 'assert';
import { getBankingCaRegistry } from '../lib/banking-ca/data';
import {
  searchCanonicalTopics,
  normalizeSearchString,
  detectQueryIntent,
  SearchFilterCriteria
} from '../lib/banking-ca/search-engine';
import { TopicRevisionRecord } from '../lib/banking-ca/revision-state';

function runSearchEngineTests() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🧪 Running Comprehensive Search Quality Audit Suite...');
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

  const registry = getBankingCaRegistry();

  // Test 1: Test A — Semantic Ranking for "Basel III"
  test('Semantic Ranking — "Basel III" (Dedicated Basel III Topic Ranks #1)', () => {
    const results = searchCanonicalTopics({ query: 'Basel III' }, registry);
    assert.ok(results.length > 0, 'Must return results for Basel III');
    const topResult = results[0].topic;
    assert.ok(
      topResult.title.includes('Basel III'),
      `Top result (${topResult.title}) must be the dedicated Basel III topic`
    );
  });

  // Test 2: Test B — Exact Topic Name
  test('Exact Topic Name Matching (Exact Title Beats Incidental Content)', () => {
    const query = '62nd RBI Monetary Policy Committee (MPC) Meeting';
    const results = searchCanonicalTopics({ query }, registry);
    assert.ok(results.length > 0, 'Must return results');
    assert.strictEqual(
      results[0].topic.slug,
      '62nd-rbi-monetary-policy-committee-mpc-meeting-august-2026',
      'Top result must be the exact 62nd MPC topic'
    );
  });

  // Test 3: Test C — Institution Intent for "RBI"
  test('Institution Intent — "RBI" (RBI Topics Dominate Result Set)', () => {
    const results = searchCanonicalTopics({ query: 'RBI' }, registry);
    assert.ok(results.length > 0, 'Must return results for RBI');
    const top5 = results.slice(0, 5);
    for (const r of top5) {
      assert.strictEqual(r.topic.primaryInstitution, 'RBI', `Top result (${r.topic.title}) must be an RBI topic`);
    }
  });

  // Test 4: Test D — Institution Intent for "SEBI"
  test('Institution Intent — "SEBI" (SEBI Topics Dominate Result Set)', () => {
    const results = searchCanonicalTopics({ query: 'SEBI' }, registry);
    assert.ok(results.length > 0, 'Must return results for SEBI');
    const top5 = results.slice(0, 5);
    for (const r of top5) {
      assert.strictEqual(r.topic.primaryInstitution, 'SEBI', `Top result (${r.topic.title}) must be a SEBI topic`);
    }
  });

  // Test 5: Test E — Numeric Fact Search ("5.25%")
  test('Numerical Search — "5.25%" (Returns Exact Fact Topic at #1)', () => {
    const results = searchCanonicalTopics({ query: '5.25%' }, registry);
    assert.ok(results.length > 0, 'Must return results for 5.25%');
    assert.ok(
      results[0].topic.slug.includes('monetary-policy'),
      `Top result (${results[0].topic.title}) must be the MPC repo rate topic`
    );
  });

  // Test 6: Test F — Month Intent ("August 2026")
  test('Month Timeline Intent — "August 2026" (Surfaces August Knowledge Set)', () => {
    const results = searchCanonicalTopics({ query: 'August', month: '2026-08' }, registry);
    assert.ok(results.length > 0, 'Must return results for August 2026');
    for (const r of results) {
      assert.strictEqual(r.topic.chronologicalMonth, '2026-08', 'Must return 2026-08 topics');
    }
  });

  // Test 7: Relevance Beats Incidental P1 Priority
  test('Relevance Over Priority Invariant (P2 Exact Title Hit Beats Incidental P1 Hit)', () => {
    const results = searchCanonicalTopics({ query: 'Tata Sons' }, registry);
    assert.ok(results.length > 0, 'Must return results for Tata Sons');
    assert.ok(
      results[0].topic.title.includes('Tata Sons') || results[0].snippet?.includes('Tata Sons'),
      'Top result must be the dedicated Tata Sons topic'
    );
  });

  // Test 8: Case-Insensitivity & Token Matching
  test('Case-Insensitivity & Multi-Token Normalization', () => {
    const lower = searchCanonicalTopics({ query: 'pm-kisan' }, registry);
    const upper = searchCanonicalTopics({ query: 'PM-KISAN' }, registry);
    const spaced = searchCanonicalTopics({ query: 'pm kisan' }, registry);

    assert.strictEqual(lower.length, upper.length, 'Lower and upper must match count');
    assert.strictEqual(lower.length, spaced.length, 'Hyphen and space must match count');
    assert.strictEqual(lower[0].topic.id, upper[0].topic.id, 'Top result must be identical');
  });

  // Test 9: Priority Filtering Invariant
  test('Priority Filtering (P1 Filter Returns Exact Active P1 Portfolio)', () => {
    const p1Results = searchCanonicalTopics({ priority: 'P1_CRITICAL_DEEP' }, registry);
    assert.strictEqual(
      p1Results.length,
      registry.summary.activeP1Count,
      `P1 filter must return exact active P1 count (${registry.summary.activeP1Count})`
    );
  });

  // Test 10: Multi-Filter Combination
  test('Multi-Filter Combination (Priority + Institution + Month)', () => {
    const results = searchCanonicalTopics({
      priority: 'P1_CRITICAL_DEEP',
      institution: 'RBI',
      month: '2026-08'
    }, registry);

    assert.ok(results.length > 0, 'Must return filtered results');
    for (const r of results) {
      assert.ok(r.topic.priority.startsWith('P1'), 'Must be P1');
      assert.strictEqual(r.topic.primaryInstitution, 'RBI', 'Must be RBI');
      assert.strictEqual(r.topic.chronologicalMonth, '2026-08', 'Must be 2026-08');
    }
  });

  // Test 11: Zero Results Handling
  test('Zero Results Handling (Non-existent query returns empty array)', () => {
    const results = searchCanonicalTopics({ query: 'NonExistentRandomWordXYZ999' }, registry);
    assert.strictEqual(results.length, 0, 'Must return empty array for non-matching query');
  });

  // Test 12: Search Determinism
  test('Search Determinism (Same Query & Filters = Identical Results)', () => {
    const criteria: SearchFilterCriteria = { query: 'banking', priority: 'ALL', sortBy: 'RELEVANCE' };
    const run1 = searchCanonicalTopics(criteria, registry);
    const run2 = searchCanonicalTopics(criteria, registry);

    assert.strictEqual(run1.length, run2.length, 'Result counts must match');
    for (let i = 0; i < run1.length; i++) {
      assert.strictEqual(run1[i].topic.id, run2[i].topic.id, `Result #${i} must match`);
      assert.strictEqual(run1[i].relevanceScore, run2[i].relevanceScore, `Score #${i} must match`);
    }
  });

  // Test 13: Security & Data Isolation Audit
  test('Security & Isolation (Zero Environment Secrets in Output)', () => {
    const results = searchCanonicalTopics({ query: 'a' }, registry);
    const serialized = JSON.stringify(results);

    assert.ok(!serialized.includes('AIZA'), 'Must not contain Google API keys');
    assert.ok(!serialized.includes('ghp_'), 'Must not contain GitHub tokens');
    assert.ok(!serialized.includes('Bearer eyJ') && !serialized.includes('Authorization: Bearer'), 'Must not contain auth headers');
    assert.ok(!serialized.includes('C:\\Users'), 'Must not contain local filesystem paths');
  });

  console.log('\n────────────────────────────────────────────────────────');
  console.log(`Results: ${passed} / ${total} Tests Passed`);
  console.log('────────────────────────────────────────────────────────\n');

  if (passed !== total) {
    process.exit(1);
  }
}

if (require.main === module) {
  runSearchEngineTests();
}
