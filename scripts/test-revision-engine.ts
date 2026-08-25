import assert from 'assert';
import { getBankingCaRegistry } from '../lib/banking-ca/data';
import {
  buildRevisionDeck,
  generateRecallPrompts,
  calculateTopicRevisionScore
} from '../lib/banking-ca/revision-engine';
import {
  LocalRevisionStateRepository,
  TopicRevisionRecord
} from '../lib/banking-ca/revision-state';

function runRevisionTests() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🧪 Running Comprehensive Revision Engine Audit Suite...');
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
  const topics = Object.values(registry.topics);
  const p1Topic = topics.find(t => t.priority.startsWith('P1'))!;
  const p2Topic = topics.find(t => t.priority === 'P2_HIGH')!;
  const p3Topic = topics.find(t => t.priority === 'P3_MODERATE')!;

  // Test 1: Time Budget Compliance
  test('Time Budget Compliance (Decks Never Exceed Budget)', () => {
    const deck15 = buildRevisionDeck(15, registry);
    const deck30 = buildRevisionDeck(30, registry);
    const deck60 = buildRevisionDeck(60, registry);
    const deckAllP1 = buildRevisionDeck('ALL_P1', registry);

    assert.ok(deck15.actualRevisionMinutes <= 15, `15-min deck must not exceed 15m (got ${deck15.actualRevisionMinutes}m)`);
    assert.ok(deck30.actualRevisionMinutes <= 30, `30-min deck must not exceed 30m (got ${deck30.actualRevisionMinutes}m)`);
    assert.ok(deck60.actualRevisionMinutes <= 60, `60-min deck must not exceed 60m (got ${deck60.actualRevisionMinutes}m)`);
    assert.strictEqual(
      deckAllP1.actualRevisionMinutes,
      registry.summary.activeP1RevisionMinutes,
      `ALL_P1 deck must match active P1 minutes (${registry.summary.activeP1RevisionMinutes}m)`
    );
    assert.strictEqual(
      deckAllP1.items.length,
      registry.summary.activeP1Count,
      `ALL_P1 deck must include all ${registry.summary.activeP1Count} P1 topics`
    );
  });

  // Test 2: Invariant Case A & D (Normal P1 vs Weak / Change-Sensitive P2)
  test('Lexicographic Invariant (Normal P1 Outranks Weak & Change-Sensitive P2)', () => {
    const weakChangeSensitiveP2Record: TopicRevisionRecord = {
      topicId: p2Topic.id,
      reviewCount: 3,
      lastReviewedAt: new Date().toISOString(),
      lastRating: 'AGAIN',
      isWeak: true,
      history: []
    };

    const scoreP1 = calculateTopicRevisionScore(p1Topic, null).score;
    const scoreP2 = calculateTopicRevisionScore(p2Topic, weakChangeSensitiveP2Record).score;

    assert.ok(
      scoreP1 > scoreP2,
      `Normal P1 score (${scoreP1}) must strictly outrank weak change-sensitive P2 score (${scoreP2})`
    );
  });

  // Test 3: Invariant Case B (Normal P1 vs Weak P3)
  test('Lexicographic Invariant (Normal P1 Outranks Weak P3)', () => {
    const weakP3Record: TopicRevisionRecord = {
      topicId: p3Topic.id,
      reviewCount: 5,
      lastReviewedAt: new Date().toISOString(),
      lastRating: 'AGAIN',
      isWeak: true,
      history: []
    };

    const scoreP1 = calculateTopicRevisionScore(p1Topic, null).score;
    const scoreP3 = calculateTopicRevisionScore(p3Topic, weakP3Record).score;

    assert.ok(scoreP1 > scoreP3, `Normal P1 (${scoreP1}) must outrank weak P3 (${scoreP3})`);
  });

  // Test 4: Invariant Case C (Normal P2 vs Change-Sensitive P3)
  test('Lexicographic Invariant (Normal P2 Outranks Change-Sensitive P3)', () => {
    const scoreP2 = calculateTopicRevisionScore(p2Topic, null).score;
    const scoreP3 = calculateTopicRevisionScore(p3Topic, null).score;

    assert.ok(scoreP2 > scoreP3, `Normal P2 (${scoreP2}) must outrank P3 (${scoreP3})`);
  });

  // Test 5: Intra-Tier Weakness Modulation
  test('Intra-Tier Weakness Modulation (Weak P1 Outranks Mastered P1)', () => {
    const weakP1Record: TopicRevisionRecord = {
      topicId: p1Topic.id,
      reviewCount: 2,
      lastReviewedAt: new Date().toISOString(),
      lastRating: 'AGAIN',
      isWeak: true,
      history: []
    };

    const easyP1Record: TopicRevisionRecord = {
      topicId: p1Topic.id,
      reviewCount: 2,
      lastReviewedAt: new Date().toISOString(),
      lastRating: 'EASY',
      isWeak: false,
      history: []
    };

    const weakScore = calculateTopicRevisionScore(p1Topic, weakP1Record).score;
    const easyScore = calculateTopicRevisionScore(p1Topic, easyP1Record).score;

    assert.ok(weakScore > easyScore, `Weak P1 score (${weakScore}) must exceed mastered P1 score (${easyScore})`);
  });

  // Test 6: Selection Determinism
  test('Selection Determinism (Deck A === Deck B with Same Registry & State)', () => {
    const run1 = buildRevisionDeck(30, registry);
    const run2 = buildRevisionDeck(30, registry);

    assert.strictEqual(run1.items.length, run2.items.length, 'Topic count must match');
    assert.strictEqual(run1.actualRevisionMinutes, run2.actualRevisionMinutes, 'Minutes must match');
    
    for (let i = 0; i < run1.items.length; i++) {
      assert.strictEqual(run1.items[i].topic.id, run2.items[i].topic.id, `Topic #${i} must be identical`);
    }
  });

  // Test 7: Recall Prompt Provenance & Safety
  test('Recall Prompt Provenance (100% of Prompt Answers Grounded in Source Facts)', () => {
    let totalPrompts = 0;
    for (const topic of Object.values(registry.topics)) {
      const prompts = generateRecallPrompts(topic);
      assert.ok(prompts.length > 0, `Topic ${topic.id} must generate at least 1 prompt`);

      for (const p of prompts) {
        totalPrompts++;
        assert.ok(p.question.length > 0, 'Question must not be empty');
        assert.ok(p.answer.length > 0, 'Answer must not be empty');
        assert.ok(
          topic.mustMemorizeFacts.some(f => f.includes(p.answer) || p.rawFact === f),
          `Answer for prompt ${p.id} must be derived directly from canonical facts`
        );
      }
    }
    console.log(`     [Info] Validated ${totalPrompts} Active Recall Prompts across all 67 topics`);
  });

  // Test 8: Storage State Isolation
  test('Storage State Isolation (Revision State Does Not Mutate Registry)', () => {
    const registryBefore = JSON.stringify(registry);
    const repo = new LocalRevisionStateRepository();

    repo.recordReview('test-topic-1', 'AGAIN');
    repo.recordReview('test-topic-1', 'HARD');
    repo.saveSession({
      sessionId: 'test-session-1',
      completedAt: new Date().toISOString(),
      totalTopics: 1,
      totalPrompts: 3,
      ratingCounts: { AGAIN: 1, HARD: 1, GOOD: 0, EASY: 1 },
      weakTopicIds: ['test-topic-1']
    });

    const registryAfter = JSON.stringify(getBankingCaRegistry());
    assert.strictEqual(registryBefore, registryAfter, 'Canonical registry must remain immutable');
  });

  console.log('\n────────────────────────────────────────────────────────');
  console.log(`Results: ${passed} / ${total} Tests Passed`);
  console.log('────────────────────────────────────────────────────────\n');

  if (passed !== total) {
    process.exit(1);
  }
}

if (require.main === module) {
  runRevisionTests();
}
