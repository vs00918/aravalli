import assert from 'assert';
import { getBankingCaRegistry } from '../lib/banking-ca/data';
import {
  searchCanonicalTopics,
  normalizeSearchString,
  SearchFilterCriteria
} from '../lib/banking-ca/search-engine';
import { TopicRevisionRecord } from '../lib/banking-ca/revision-state';

function runSearchEngineTests() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🧪 Running Search, Exploration & Advanced Filters Test Suite...');
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

  // Test 1: Exact Title Search
  test('Exact Title Search (Top Result Matches Query)', () => {
    const results = searchCanonicalTopics({ query: '62nd RBI Monetary Policy Committee' }, registry);
    assert.ok(results.length > 0, 'Must return results');
    assert.strictEqual(
      results[0].topic.slug,
      '62nd-rbi-monetary-policy-committee-mpc-meeting-august-2026',
      'Top result must be 62nd MPC topic'
    );
  });

  // Test 2: Institution Search
  test('Institution Search ("RBI" Returns RBI Topics)', () => {
    const results = searchCanonicalTopics({ query: 'RBI' }, registry);
    assert.ok(results.length > 0, 'Must return RBI topics');
    const rbiMatches = results.filter(r => r.topic.primaryInstitution === 'RBI');
    assert.ok(rbiMatches.length >= 5, 'Must contain multiple RBI topics');
  });

  // Test 3: Case-Insensitivity
  test('Case-Insensitivity ("rbi" === "RBI" === "Rbi")', () => {
    const lower = searchCanonicalTopics({ query: 'rbi' }, registry);
    const upper = searchCanonicalTopics({ query: 'RBI' }, registry);
    const mixed = searchCanonicalTopics({ query: 'Rbi' }, registry);

    assert.strictEqual(lower.length, upper.length, 'Result counts must match across cases');
    assert.strictEqual(lower.length, mixed.length, 'Result counts must match across cases');
    assert.strictEqual(lower[0].topic.id, upper[0].topic.id, 'Top result must be identical');
  });

  // Test 4: Keyword & Token Search
  test('Partial Keyword & Token Search ("Tata Sons")', () => {
    const results = searchCanonicalTopics({ query: 'Tata Sons' }, registry);
    assert.ok(results.length > 0, 'Must return results for Tata Sons');
    assert.ok(
      results[0].topic.title.includes('Tata Sons') || results[0].topic.contentMarkdown.includes('Tata Sons'),
      'Top result must mention Tata Sons'
    );
  });

  // Test 5: Number / Fact Search
  test('Numerical & Percentage Search ("5.25%")', () => {
    const results = searchCanonicalTopics({ query: '5.25%' }, registry);
    assert.ok(results.length > 0, 'Must return results for 5.25%');
    assert.ok(
      results.some(r => r.topic.slug.includes('monetary-policy')),
      'Must match monetary policy topic'
    );
  });

  // Test 6: Priority Filtering Invariant
  test('Priority Filtering (P1 Filter Returns Exact 7 P1 Topics)', () => {
    const p1Results = searchCanonicalTopics({ priority: 'P1_CRITICAL_DEEP' }, registry);
    assert.strictEqual(
      p1Results.length,
      registry.summary.activeP1Count,
      `P1 filter must return exact active P1 count (${registry.summary.activeP1Count})`
    );
  });

  // Test 7: Multi-Filter Combination
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

  // Test 8: Regulatory Status Filter
  test('Regulatory Status Filter ("DRAFT" Topics)', () => {
    const draftResults = searchCanonicalTopics({ regulatoryStatus: 'DRAFT' }, registry);
    assert.ok(draftResults.length > 0, 'Must return draft topics');
    for (const r of draftResults) {
      assert.strictEqual(r.topic.regulatoryStatus, 'DRAFT', 'Topic must have DRAFT status');
    }
  });

  // Test 9: Change-Sensitive Filter
  test('Change-Sensitive Filter (Returns Topics with Active Alert)', () => {
    const changeResults = searchCanonicalTopics({ changeSensitiveOnly: true }, registry);
    const expectedCount = registry.indexes.changeSensitiveTopicIds.length;
    assert.strictEqual(
      changeResults.length,
      expectedCount,
      `Must match registry change alert count (${expectedCount})`
    );
  });

  // Test 10: Personal Revision State Filtering
  test('Personal Revision State Filter ("WEAK" Topics)', () => {
    const topics = Object.values(registry.topics);
    const mockWeakTopic = topics[0];
    
    const userStateMap: Record<string, TopicRevisionRecord> = {
      [mockWeakTopic.id]: {
        topicId: mockWeakTopic.id,
        reviewCount: 2,
        lastReviewedAt: new Date().toISOString(),
        lastRating: 'AGAIN',
        isWeak: true,
        history: []
      }
    };

    const weakResults = searchCanonicalTopics({ revisionStatus: 'WEAK' }, registry, userStateMap);
    assert.strictEqual(weakResults.length, 1, 'Must return exactly 1 weak topic');
    assert.strictEqual(weakResults[0].topic.id, mockWeakTopic.id, 'Must return the simulated weak topic');
  });

  // Test 11: Zero Results Handling
  test('Zero Results Handling (Non-existent query returns empty array)', () => {
    const results = searchCanonicalTopics({ query: 'NonExistentRandomWordXYZ999' }, registry);
    assert.strictEqual(results.length, 0, 'Must return empty array for non-matching query');
  });

  // Test 12: Determinism Invariant
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
    assert.ok(!serialized.includes('Bearer'), 'Must not contain auth headers');
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
