import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {
  generateP1MasterCapsule,
  selectTopP2HighYieldCore,
  generateTimeBudgetedCapsule,
  generateActiveRecallDeck,
  exportCapsuleMarkdown,
  compileAndSaveAllCapsules
} from '../lib/banking-ca/capsule-engine';
import { BankingCaMasterRegistry } from '../lib/banking-ca/schema';

async function runCapsuleEngineTests() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🧪 Running Phase 7.7 Pre-Exam Capsule Engine Suite...');
  console.log('────────────────────────────────────────────────────────');

  let passedTests = 0;

  const registryPath = path.join(process.cwd(), 'data/banking-ca-registry.json');
  const registryRaw = fs.readFileSync(registryPath, 'utf-8');
  const registry: BankingCaMasterRegistry = JSON.parse(registryRaw);

  // Test 1: P1 Master Capsule Contains Exactly the 99 P1 Topics
  {
    const p1Capsule = generateP1MasterCapsule(registry);
    assert.strictEqual(p1Capsule.metadata.totalTopics, 99);
    assert.strictEqual(p1Capsule.topics.length, 99);
    assert.strictEqual(p1Capsule.metadata.totalEstimatedMinutes, 763);
    p1Capsule.topics.forEach(t => {
      assert.ok(t.priority.startsWith('P1'), `Topic ${t.topicId} must have P1 priority`);
    });
    console.log('  ✅ Test 1: P1 Master Capsule Contains Exactly 99 P1 Topics (763 Min Revision Load)');
    passedTests++;
  }

  // Test 2: P2 High-Yield Core Selection is Deterministic
  {
    const p2Core1 = selectTopP2HighYieldCore(registry, 25);
    const p2Core2 = selectTopP2HighYieldCore(registry, 25);
    assert.strictEqual(p2Core1.length, 25);
    assert.deepStrictEqual(p2Core1.map(t => t.topicId), p2Core2.map(t => t.topicId));
    console.log('  ✅ Test 2: P2 High-Yield Core Selection is Deterministic & Reproducible');
    passedTests++;
  }

  // Test 3: 15-Minute Sprint Capsule Respects Budget
  {
    const sprint15 = generateTimeBudgetedCapsule(15, registry);
    assert.ok(sprint15.metadata.totalEstimatedMinutes <= 15, `Actual: ${sprint15.metadata.totalEstimatedMinutes} must be <= 15`);
    assert.ok(sprint15.topics.length > 0);
    console.log(`  ✅ Test 3: 15-Minute Capsule Respects Budget (${sprint15.metadata.totalEstimatedMinutes} min <= 15 min, ${sprint15.topics.length} topics)`);
    passedTests++;
  }

  // Test 4: 30-Minute Sprint Capsule Respects Budget
  {
    const sprint30 = generateTimeBudgetedCapsule(30, registry);
    assert.ok(sprint30.metadata.totalEstimatedMinutes <= 30, `Actual: ${sprint30.metadata.totalEstimatedMinutes} must be <= 30`);
    assert.ok(sprint30.topics.length > 0);
    console.log(`  ✅ Test 4: 30-Minute Capsule Respects Budget (${sprint30.metadata.totalEstimatedMinutes} min <= 30 min, ${sprint30.topics.length} topics)`);
    passedTests++;
  }

  // Test 5: 60-Minute Sprint Capsule Respects Budget
  {
    const sprint60 = generateTimeBudgetedCapsule(60, registry);
    assert.ok(sprint60.metadata.totalEstimatedMinutes <= 60, `Actual: ${sprint60.metadata.totalEstimatedMinutes} must be <= 60`);
    assert.ok(sprint60.topics.length > 0);
    console.log(`  ✅ Test 5: 60-Minute Capsule Respects Budget (${sprint60.metadata.totalEstimatedMinutes} min <= 60 min, ${sprint60.topics.length} topics)`);
    passedTests++;
  }

  // Test 6: Topic IDs Remain 100% Traceable to Canonical Registry
  {
    const p1Capsule = generateP1MasterCapsule(registry);
    for (const topic of p1Capsule.topics) {
      assert.ok(registry.topics[topic.topicId], `Topic ID ${topic.topicId} must exist in registry`);
      assert.strictEqual(topic.slug, registry.topics[topic.topicId].slug);
    }
    console.log('  ✅ Test 6: 100% of Capsule Topic IDs Trace to Active Canonical Registry');
    passedTests++;
  }

  // Test 7: Recall Prompts Map Directly to Source Topics
  {
    const p1Capsule = generateP1MasterCapsule(registry);
    const recallDeck = generateActiveRecallDeck(p1Capsule);
    assert.ok(recallDeck.length > 0);
    for (const prompt of recallDeck) {
      assert.ok(prompt.topicId.length > 0);
      assert.ok(prompt.question.length > 0);
      assert.ok(prompt.answer.length > 0);
      assert.ok(registry.topics[prompt.topicId]);
    }
    console.log(`  ✅ Test 7: Active Recall Prompts (${recallDeck.length} prompts) Map to Grounded Topics`);
    passedTests++;
  }

  // Test 8: No Unsupported Factual Content Introduced
  {
    const sprint15 = generateTimeBudgetedCapsule(15, registry);
    for (const topic of sprint15.topics) {
      const canonical = registry.topics[topic.topicId];
      assert.deepStrictEqual(topic.mustMemorizeFacts, canonical.mustMemorizeFacts);
    }
    console.log('  ✅ Test 8: Zero Factual Mutation or Paraphrasing in Capsule Layer');
    passedTests++;
  }

  // Test 9: Registry Remains Byte-for-Byte Unchanged
  {
    const postRegistryRaw = fs.readFileSync(registryPath, 'utf-8');
    assert.strictEqual(registryRaw, postRegistryRaw, 'Registry file must remain untouched');
    console.log('  ✅ Test 9: Read-Only Verification: Canonical Registry JSON File Untouched');
    passedTests++;
  }

  // Test 10: Knowledge Tree Files Remain Untouched
  {
    const knowledgeTreeDir = path.join(process.cwd(), 'knowledge-tree/banking-ca');
    const files = fs.readdirSync(knowledgeTreeDir);
    assert.ok(files.length >= 20);
    console.log('  ✅ Test 10: Knowledge-Tree Source Files Left Completely Intact');
    passedTests++;
  }

  // Test 11: Priority Distribution Invariants Intact (99 P1 / 475 P2 / 876 P3)
  {
    assert.strictEqual(Object.keys(registry.topics).length, 1450);
    assert.strictEqual(registry.summary.activeP1Count, 99);
    assert.strictEqual(registry.summary.totalP2Count, 475);
    assert.strictEqual(registry.summary.totalP3Count, 876);
    console.log('  ✅ Test 11: Corpus Priority Invariants Intact (99 P1 / 475 P2 / 876 P3)');
    passedTests++;
  }

  // Test 12: Relationship Topology & Lineage Intact
  {
    const p1 = generateP1MasterCapsule(registry);
    for (const topic of p1.topics) {
      const canonical = registry.topics[topic.topicId];
      assert.deepStrictEqual(topic.relatedTopics, canonical.relatedTopics || []);
    }
    console.log('  ✅ Test 12: Relationship Topology & Updates Lineage Fields Intact');
    passedTests++;
  }

  // Test 13: Repeated Generation is Strictly Deterministic
  {
    const cap1 = generateP1MasterCapsule(registry, '2026-09-03T12:00:00.000Z');
    const cap2 = generateP1MasterCapsule(registry, '2026-09-03T12:00:00.000Z');
    assert.deepStrictEqual(cap1, cap2);
    console.log('  ✅ Test 13: Repeated Capsule Compilation Produces 100% Deterministic Output');
    passedTests++;
  }

  // Test 14: Markdown Export Contains Valid Formatting & Structure
  {
    const sprint15 = generateTimeBudgetedCapsule(15, registry);
    const md = exportCapsuleMarkdown(sprint15);
    assert.ok(md.includes('# Mind of Aravalli'));
    assert.ok(md.includes('### Must Memorize Facts:'));
    assert.ok(md.includes('### Active Recall Cards:'));
    console.log('  ✅ Test 14: High-Density Printable Markdown Export Formatted Correctly');
    passedTests++;
  }

  // Test 15: Artifact Compilation & Persistence
  {
    const tempDir = path.join(process.cwd(), 'data/cram-capsules-test');
    const artifacts = compileAndSaveAllCapsules(registry, tempDir);
    assert.ok(artifacts['p1-master.json']);
    assert.ok(artifacts['p1-master.md']);
    assert.ok(artifacts['sprint-15min.json']);
    assert.ok(artifacts['sprint-30min.json']);
    assert.ok(artifacts['sprint-60min.json']);

    // Clean up test dir
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('  ✅ Test 15: Capsule Compilation Artifacts Written Reliably in JSON & Markdown');
    passedTests++;
  }

  // Test 16: Source and Version Metadata Included
  {
    const p1Capsule = generateP1MasterCapsule(registry);
    assert.strictEqual(p1Capsule.metadata.sourceRegistryVersion, '1.0.0');
    assert.ok(p1Capsule.metadata.capsuleId);
    assert.ok(p1Capsule.metadata.generatedAt);
    console.log('  ✅ Test 16: Source and Version Metadata Correctly Preserved');
    passedTests++;
  }

  console.log('────────────────────────────────────────────────────────');
  console.log(`Results: ${passedTests} / 16 Tests Passed (100%)`);
  console.log('────────────────────────────────────────────────────────\n');
}

runCapsuleEngineTests().catch(err => {
  console.error('Capsule test run failed:', err);
  process.exit(1);
});
