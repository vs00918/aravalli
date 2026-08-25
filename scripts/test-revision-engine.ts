import assert from 'assert';
import fs from 'fs';
import path from 'path';
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
  console.log('🧪 Running Revision Engine & Active Recall Test Suite...');
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

  // Test 2: Priority Ordering Invariant
  test('Priority Ordering Invariant (P1 Outranks P2, P2 Outranks P3)', () => {
    const topics = Object.values(registry.topics);
    const p1Topic = topics.find(t => t.priority.startsWith('P1'))!;
    const p2Topic = topics.find(t => t.priority === 'P2_HIGH')!;
    const p3Topic = topics.find(t => t.priority === 'P3_MODERATE')!;

    const scoreP1 = calculateTopicRevisionScore(p1Topic).score;
    const scoreP2 = calculateTopicRevisionScore(p2Topic).score;
    const scoreP3 = calculateTopicRevisionScore(p3Topic).score;

    assert.ok(scoreP1 > scoreP2, `P1 score (${scoreP1}) must outrank P2 score (${scoreP2})`);
    assert.ok(scoreP2 > scoreP3, `P2 score (${scoreP2}) must outrank P3 score (${scoreP3})`);
  });

  // Test 3: Weakness Re-prioritization
  test('Weakness Modulation (AGAIN/HARD Scores Higher than GOOD/EASY)', () => {
    const p2Topic = Object.values(registry.topics).find(t => t.priority === 'P2_HIGH')!;
    
    const weakRecord: TopicRevisionRecord = {
      topicId: p2Topic.id,
      reviewCount: 1,
      lastReviewedAt: new Date().toISOString(),
      lastRating: 'AGAIN',
      isWeak: true,
      history: [{ reviewedAt: new Date().toISOString(), rating: 'AGAIN' }]
    };

    const goodRecord: TopicRevisionRecord = {
      topicId: p2Topic.id,
      reviewCount: 1,
      lastReviewedAt: new Date().toISOString(),
      lastRating: 'GOOD',
      isWeak: false,
      history: [{ reviewedAt: new Date().toISOString(), rating: 'GOOD' }]
    };

    const weakScore = calculateTopicRevisionScore(p2Topic, weakRecord).score;
    const goodScore = calculateTopicRevisionScore(p2Topic, goodRecord).score;

    assert.ok(weakScore > goodScore, `Weak topic score (${weakScore}) must exceed mastered score (${goodScore})`);
  });

  // Test 4: Selection Determinism
  test('Selection Determinism (Deck A === Deck B with Same Input)', () => {
    const run1 = buildRevisionDeck(30, registry);
    const run2 = buildRevisionDeck(30, registry);

    assert.strictEqual(run1.items.length, run2.items.length, 'Topic count must match');
    assert.strictEqual(run1.actualRevisionMinutes, run2.actualRevisionMinutes, 'Minutes must match');
    
    for (let i = 0; i < run1.items.length; i++) {
      assert.strictEqual(run1.items[i].topic.id, run2.items[i].topic.id, `Topic #${i} must be identical`);
    }
  });

  // Test 5: Recall Prompt Provenance
  test('Recall Prompt Provenance (Answers Grounded in Canonical Facts)', () => {
    for (const topic of Object.values(registry.topics)) {
      const prompts = generateRecallPrompts(topic);
      assert.ok(prompts.length > 0, `Topic ${topic.id} must generate at least 1 prompt`);

      for (const p of prompts) {
        assert.ok(p.question.length > 0, 'Question must not be empty');
        assert.ok(p.answer.length > 0, 'Answer must not be empty');
        assert.ok(
          topic.mustMemorizeFacts.some(f => f.includes(p.answer) || p.rawFact === f),
          `Answer for prompt ${p.id} must be derived directly from canonical facts`
        );
      }
    }
  });

  // Test 6: Storage State Isolation
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
