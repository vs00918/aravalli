import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { compileBankingCaRegistry } from './compile-banking-ca';
import {
  CanonicalTopicSchema,
  PriorityLevelSchema,
  RegulatoryStatusSchema,
  VerificationStatusSchema
} from '../lib/banking-ca/schema';
import { generateStableSlug } from '../lib/banking-ca/markdown-parser';

function runTests() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🧪 Running Compiler & Data Contract Test Suite...');
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

  // Test 1: Deterministic Compilation
  test('Determinism Guarantee (Compile A === Compile B)', () => {
    const run1 = compileBankingCaRegistry();
    const run2 = compileBankingCaRegistry();
    const json1 = JSON.stringify(run1.registry);
    const json2 = JSON.stringify(run2.registry);
    assert.strictEqual(json1, json2, 'Compiler output must be byte-identical across runs');
  });

  // Test 2: Real Dataset Integration
  test('Real Dataset Integration (Zero Schema Errors)', () => {
    const { registry, validationErrors } = compileBankingCaRegistry();
    assert.strictEqual(validationErrors.length, 0, `Expected 0 validation errors, got ${validationErrors.length}`);
    assert.ok(registry.summary.totalCanonicalTopics > 0, 'Must compile canonical topics');
    assert.ok(registry.summary.activeP1Count > 0, 'Must contain active P1 topics');
  });

  // Test 3: Stable ID Format
  test('Stable ID & Slug Format Validation', () => {
    const { registry } = compileBankingCaRegistry();
    for (const [id, topic] of Object.entries(registry.topics)) {
      assert.strictEqual(id, topic.id, 'Topic map key must match topic.id');
      assert.ok(/^[a-z0-9-]+$/.test(topic.slug), `Slug must be kebab-case: ${topic.slug}`);
      assert.ok(topic.revisionMinutes > 0, `Revision minutes must be positive: ${topic.title}`);
    }
  });

  // Test 4: Priority Schema Enforcement
  test('Priority Schema Validation (Reject Invalid Priority)', () => {
    const valid = PriorityLevelSchema.safeParse('P1_CRITICAL_DEEP');
    const invalid = PriorityLevelSchema.safeParse('P9_INVALID_PRIORITY');
    assert.strictEqual(valid.success, true);
    assert.strictEqual(invalid.success, false);
  });

  // Test 5: Regulatory Status Enum Enforcement
  test('Regulatory Status Validation (Reject Invalid Status)', () => {
    const valid = RegulatoryStatusSchema.safeParse('DRAFT');
    const invalid = RegulatoryStatusSchema.safeParse('UNPUBLISHED');
    assert.strictEqual(valid.success, true);
    assert.strictEqual(invalid.success, false);
  });

  // Test 6: Verification Status Enum Enforcement
  test('Verification Status Validation (Reject Invalid Status)', () => {
    const valid = VerificationStatusSchema.safeParse('SOURCE_ONLY');
    const invalid = VerificationStatusSchema.safeParse('AI_HALLUCINATED');
    assert.strictEqual(valid.success, true);
    assert.strictEqual(invalid.success, false);
  });

  // Test 7: Missing Required Metadata Detection
  test('Missing Required Metadata Detection', () => {
    const incompleteTopic = {
      id: 'test-topic',
      slug: 'test-topic',
      title: 'Incomplete Topic'
      // missing priority, revisionMinutes, mustMemorizeFacts, etc.
    };
    const result = CanonicalTopicSchema.safeParse(incompleteTopic);
    assert.strictEqual(result.success, false, 'Schema must reject incomplete topic');
  });

  // Test 8: Security Audit (Zero Secret Leaks)
  test('Security Audit (No Environment Secrets in Output)', () => {
    const { registry } = compileBankingCaRegistry();
    const jsonStr = JSON.stringify(registry);
    assert.ok(!jsonStr.includes('ghp_'), 'Output must never contain GitHub PATs');
    assert.ok(!jsonStr.includes('antigravity_token'), 'Output must never contain Antigravity tokens');
    assert.ok(!jsonStr.includes('file:///C:/Users'), 'Output must never expose absolute host filesystem credentials');
  });

  // Test 9: Dynamic Source-vs-Registry Priority Fidelity Check
  test('Dynamic Priority Invariant (Canonical Source P1s === Compiled Registry P1s)', () => {
    const rootDir = path.join(__dirname, '..');
    const caDir = path.join(rootDir, 'knowledge-tree/banking-ca');
    const files = fs.readdirSync(caDir).filter(f => f.endsWith('.md'));

    const expectedP1Slugs = new Set<string>();
    let expectedP1Minutes = 0;

    for (const file of files) {
      const content = fs.readFileSync(path.join(caDir, file), 'utf8');
      const lines = content.split(/\r?\n/);
      let inP1 = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('PART 1: P1')) {
          inP1 = true;
          continue;
        } else if (line.includes('PART 2: P2') || line.includes('PART 3: P3') || line.includes('PART 4:') || line.includes('MENTOR SESSION-END')) {
          inP1 = false;
        }

        if (inP1) {
          const h3Match = line.match(/^###\s*(\d+[\.\)]\s*)?(.+)/);
          if (h3Match) {
            const rawTitle = h3Match[2].trim();
            const slug = generateStableSlug(rawTitle);
            expectedP1Slugs.add(slug);

            // Look ahead for revision minutes
            let minutes = 8;
            for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
              const revMatch = lines[j].match(/Revision Effort:\*\*\s*~?(\d+)\s*min/i);
              if (revMatch) {
                minutes = parseInt(revMatch[1], 10);
                break;
              }
            }
            expectedP1Minutes += minutes;
          }
        }
      }
    }

    const { registry } = compileBankingCaRegistry();
    const compiledP1Slugs = new Set([
      ...registry.indexes.byPriority.P1_CRITICAL_DEEP,
      ...registry.indexes.byPriority.P1_CRITICAL_MEMORIZE
    ]);

    // Informational logging (not hardcoded assertions)
    console.log(`     [Info] Dynamic Source Scan  : ${expectedP1Slugs.size} P1 Topics, ${expectedP1Minutes} Total Minutes`);
    console.log(`     [Info] Compiled Registry P1 : ${registry.summary.activeP1Count} P1 Topics, ${registry.summary.activeP1RevisionMinutes} Total Minutes`);

    // Assert exact equality between source extraction and compiled registry
    assert.strictEqual(
      registry.summary.activeP1Count,
      expectedP1Slugs.size,
      `Compiled P1 count (${registry.summary.activeP1Count}) must match canonical source P1 count (${expectedP1Slugs.size})`
    );

    assert.strictEqual(
      registry.summary.activeP1RevisionMinutes,
      expectedP1Minutes,
      `Compiled P1 minutes (${registry.summary.activeP1RevisionMinutes}) must match canonical source P1 minutes (${expectedP1Minutes})`
    );

    Array.from(expectedP1Slugs).forEach(slug => {
      assert.ok(compiledP1Slugs.has(slug), `P1 topic '${slug}' from canonical source must exist in compiled P1 registry index`);
    });
  });

  console.log('\n────────────────────────────────────────────────────────');
  console.log(`Results: ${passed} / ${total} Tests Passed`);
  console.log('────────────────────────────────────────────────────────\n');

  if (passed !== total) {
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}
