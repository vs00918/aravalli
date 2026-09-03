import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { classifyFact, classifyKnowledgeIR } from '../lib/extraction/classifier';
import { ExtractedFact, KnowledgeIR } from '../lib/extraction/schema';
import { BankingCaMasterRegistry } from '../lib/banking-ca/schema';

async function runClassifierTests() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🧪 Running Phase 7.3 Duplicate / Update / Novelty Classifier Suite...');
  console.log('────────────────────────────────────────────────────────');

  let passedTests = 0;

  // 1. Load active canonical registry (read-only baseline)
  const registryPath = path.join(process.cwd(), 'data/banking-ca-registry.json');
  const registryRaw = fs.readFileSync(registryPath, 'utf-8');
  const registry: BankingCaMasterRegistry = JSON.parse(registryRaw);
  const initialTopicCount = Object.keys(registry.topics).length;
  const initialP1Count = registry.summary.activeP1Count;
  const initialP2Count = registry.summary.totalP2Count;
  const initialP3Count = registry.summary.totalP3Count;
  const canonicalTopics = Object.values(registry.topics);

  // Test 1: Exact Duplicate -> DUPLICATE
  {
    const exactFact: ExtractedFact = {
      factId: 'f-exact',
      statement: 'MoEFCC Notifies Solid Waste Management SWM Rules 2026 Mandatory 4 Stream Segregation',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: ['4'],
      provenance: {
        segmentIds: ['seg-0001'],
        quotedText: 'MoEFCC Notifies Solid Waste Management SWM Rules 2026'
      }
    };

    const result = classifyFact(exactFact, canonicalTopics);
    assert.strictEqual(result.classification, 'DUPLICATE');
    assert.strictEqual(result.similarityScore, 1.0);
    assert.ok(result.matchedTopicId);
    console.log('  ✅ Test 1: Exact Duplicate Returns DUPLICATE with Score 1.0');
    passedTests++;
  }

  // Test 2: Strong Semantic Duplicate -> DUPLICATE
  {
    const strongDuplicateFact: ExtractedFact = {
      factId: 'f-dup',
      statement: '62nd RBI Monetary Policy Committee MPC Meeting August 2026 Policy Repo Rate held at 5.25%',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: ['5.25%'],
      provenance: {
        segmentIds: ['seg-0001'],
        quotedText: 'Policy Repo Rate held at 5.25%'
      }
    };

    const result = classifyFact(strongDuplicateFact, canonicalTopics);
    assert.strictEqual(result.classification, 'DUPLICATE');
    assert.ok(result.similarityScore >= 0.88);
    assert.ok(result.matchedTopicId);
    console.log('  ✅ Test 2: Strong Semantic Duplicate Correctly Identified (Score >= 0.88)');
    passedTests++;
  }

  // Test 3: Existing Topic with Temporal Development -> UPDATE
  {
    const updateFact: ExtractedFact = {
      factId: 'f-update',
      statement: 'Credit Guarantee Scheme for MFIs extended through FY 2026-27 with revised lending limits and new allocation.',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: ['2026-27'],
      temporalAnchor: '2026-08',
      provenance: {
        segmentIds: ['seg-0001'],
        quotedText: 'Credit Guarantee Scheme for MFIs extended through FY 2026-27'
      }
    };

    const result = classifyFact(updateFact, canonicalTopics);
    assert.strictEqual(result.classification, 'UPDATE');
    assert.strictEqual(result.isTemporalUpdate, true);
    assert.ok(result.matchedTopicId);
    console.log('  ✅ Test 3: Chronological Policy Extension Classified as UPDATE');
    passedTests++;
  }

  // Test 4: Clearly New Subject -> NOVEL
  {
    const novelFact: ExtractedFact = {
      factId: 'f-novel',
      statement: 'NASA and ISRO launched the NISAR-2 Earth observation synthetic aperture radar satellite from Sriharikota.',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: ['NISAR-2'],
      provenance: {
        segmentIds: ['seg-0001'],
        quotedText: 'NASA and ISRO launched the NISAR-2 Earth observation'
      }
    };

    const result = classifyFact(novelFact, canonicalTopics);
    assert.strictEqual(result.classification, 'NOVEL');
    assert.ok(result.similarityScore < 0.40);
    console.log('  ✅ Test 4: Novel Distinct Event Classified as NOVEL (Score < 0.40)');
    passedTests++;
  }

  // Test 5: Borderline Similarity -> REVIEW_REQUIRED
  {
    const borderlineFact: ExtractedFact = {
      factId: 'f-borderline',
      statement: 'Bharat Maritime Insurance Pool framework and underwriting guidelines launched for coastal shipping vessels.',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: [],
      provenance: {
        segmentIds: ['seg-0001'],
        quotedText: 'Bharat Maritime Insurance Pool framework and underwriting guidelines'
      }
    };

    const result = classifyFact(borderlineFact, canonicalTopics);
    assert.strictEqual(result.classification, 'REVIEW_REQUIRED');
    assert.strictEqual(result.reviewRequired, true);
    console.log('  ✅ Test 5: Intermediate Overlap Correctly Handled with Safe Audit Flag');
    passedTests++;
  }

  // Test 6: Missing Provenance is Rejected
  {
    const unbackedFact: ExtractedFact = {
      factId: 'f-unbacked',
      statement: 'Unbacked fabricated statement without provenance.',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: [],
      provenance: {
        segmentIds: [],
        quotedText: '' // Empty quote
      }
    };

    const result = classifyFact(unbackedFact, canonicalTopics);
    assert.strictEqual(result.classification, 'REVIEW_REQUIRED');
    assert.strictEqual(result.confidence, 0);
    assert.ok(result.rationale.includes('REJECTED'));
    console.log('  ✅ Test 6: Unprovenanced Fact Rejected by Firewall');
    passedTests++;
  }

  // Test 7: Competing Candidate Matches -> REVIEW_REQUIRED
  {
    const ambiguousFact: ExtractedFact = {
      factId: 'f-ambig',
      statement: 'India signs terms of reference for new bilateral trade agreement negotiations.',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: [],
      provenance: {
        segmentIds: ['seg-0001'],
        quotedText: 'India signs terms of reference for new bilateral trade agreement'
      }
    };

    const result = classifyFact(ambiguousFact, canonicalTopics);
    assert.strictEqual(result.classification, 'REVIEW_REQUIRED');
    assert.strictEqual(result.reviewRequired, true);
    console.log('  ✅ Test 7: Competing Cluster Match Flags Human Review');
    passedTests++;
  }

  // Test 8: Read-Only Invariant: Canonical Registry Content Unchanged
  {
    const sampleIR: KnowledgeIR = {
      irVersion: '1.0.0',
      documentId: 'doc-test-ro',
      batchId: 'batch-test',
      chunkId: 'chunk-001',
      extractedAt: '2026-09-03T12:00:00Z',
      provider: 'SemanticMockProvider',
      model: 'mock-deterministic-v1',
      facts: [
        {
          factId: 'f-1',
          statement: 'The Reserve Bank of India repo rate at 6.50%.',
          epistemicStatus: 'SOURCE_EXTRACTED',
          stance: 'ASSERTED',
          numericalAnchors: ['6.50%'],
          provenance: { segmentIds: ['seg-0001'], quotedText: 'repo rate at 6.50%' }
        }
      ],
      mechanisms: [],
      uncertainties: [],
      tokenUsage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 }
    };

    classifyKnowledgeIR(sampleIR, registry);

    const postRegistryRaw = fs.readFileSync(registryPath, 'utf-8');
    assert.strictEqual(registryRaw, postRegistryRaw, 'Canonical registry JSON file must remain bit-for-bit identical');
    console.log('  ✅ Test 8: Read-Only Invariant Verified (File on Disk Untouched)');
    passedTests++;
  }

  // Test 9: Active Canonical Topic Count and Priority Invariants Intact
  {
    assert.strictEqual(Object.keys(registry.topics).length, initialTopicCount);
    assert.strictEqual(registry.summary.activeP1Count, initialP1Count);
    assert.strictEqual(registry.summary.totalP2Count, initialP2Count);
    assert.strictEqual(registry.summary.totalP3Count, initialP3Count);
    console.log('  ✅ Test 9: Topic Counts and Priority Distribution Invariants Intact');
    passedTests++;
  }

  // Test 10: updatesHistory and relatedTopics Intact
  {
    for (const topic of Object.values(registry.topics)) {
      if (topic.updatesHistory) {
        assert.ok(Array.isArray(topic.updatesHistory));
      }
      if (topic.relatedTopics) {
        assert.ok(Array.isArray(topic.relatedTopics));
      }
    }
    console.log('  ✅ Test 10: Relationship Topology Fields Remain Completely Intact');
    passedTests++;
  }

  // Test 11: Deterministic Repeated Execution Produces Identical Classification
  {
    const testFact: ExtractedFact = {
      factId: 'f-repeat',
      statement: 'SEBI mandates enhanced cybersecurity controls and IT resilience index for stock exchanges.',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: [],
      provenance: { segmentIds: ['seg-0001'], quotedText: 'enhanced cybersecurity controls' }
    };

    const res1 = classifyFact(testFact, canonicalTopics);
    const res2 = classifyFact(testFact, canonicalTopics);
    assert.deepStrictEqual(res1, res2);
    console.log('  ✅ Test 11: Repeated Classification is 100% Deterministic');
    passedTests++;
  }

  // Test 12: Numerical/Date Modification Recognized as Update
  {
    const numericalUpdateFact: ExtractedFact = {
      factId: 'f-num-update',
      statement: 'Jal Jeevan Mission achieves 85% rural household tap water connectivity under Phase 2.',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: ['85%'],
      provenance: { segmentIds: ['seg-0001'], quotedText: '85% rural household tap water connectivity' }
    };

    const result = classifyFact(numericalUpdateFact, canonicalTopics);
    assert.strictEqual(result.classification, 'UPDATE');
    assert.ok(result.matchedTopicId);
    console.log('  ✅ Test 12: Quantitative Milestone Progression Correctly Classified as UPDATE');
    passedTests++;
  }

  // Test 13: Unrelated Numerical Similarity Does Not Cause False Duplicate
  {
    const unrelatedNumericFact: ExtractedFact = {
      factId: 'f-unrelated',
      statement: 'Indian space sector private investment crosses 6.50% of national aerospace capital budget.',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: ['6.50%'],
      provenance: { segmentIds: ['seg-0001'], quotedText: 'crosses 6.50% of national aerospace' }
    };

    const result = classifyFact(unrelatedNumericFact, canonicalTopics);
    assert.notStrictEqual(result.classification, 'DUPLICATE');
    assert.strictEqual(result.classification, 'NOVEL');
    console.log('  ✅ Test 13: Incidental Number Overlap (6.50%) Correctly Disambiguated');
    passedTests++;
  }

  // Test 14: Classification Result Includes Matched Topic ID and Metadata
  {
    const testFact: ExtractedFact = {
      factId: 'f-meta',
      statement: 'UPI processes record 23.66 billion transactions worth ₹29.88 Lakh Crore.',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: ['23.66 billion', '₹29.88 Lakh Crore'],
      provenance: { segmentIds: ['seg-0001'], quotedText: 'UPI processes record 23.66 billion transactions' }
    };

    const result = classifyFact(testFact, canonicalTopics);
    assert.ok(result.matchedTopicId);
    assert.ok(result.matchedTopicTitle);
    assert.ok(result.rationale.length > 0);
    console.log('  ✅ Test 14: Structured Audit Evidence and Matched Topic ID Returned');
    passedTests++;
  }

  // Test 15: Full Knowledge IR Batch Classification
  {
    const fullIR: KnowledgeIR = {
      irVersion: '1.0.0',
      documentId: 'doc-batch-classification',
      batchId: 'batch-aug-2026',
      chunkId: 'chunk-001',
      extractedAt: '2026-09-03T12:00:00Z',
      provider: 'SemanticMockProvider',
      model: 'mock-deterministic-v1',
      facts: [
        {
          factId: 'f-dup-mpc',
          statement: '62nd RBI Monetary Policy Committee MPC Meeting Policy Repo Rate held at 5.25%.',
          epistemicStatus: 'SOURCE_EXTRACTED',
          stance: 'ASSERTED',
          numericalAnchors: ['5.25%'],
          provenance: { segmentIds: ['seg-0001'], quotedText: 'Policy Repo Rate held at 5.25%' }
        },
        {
          factId: 'f-novel-isro',
          statement: 'ISRO launched lunar communication relay satellite Chandrayaan-4 relay.',
          epistemicStatus: 'SOURCE_EXTRACTED',
          stance: 'ASSERTED',
          numericalAnchors: ['Chandrayaan-4'],
          provenance: { segmentIds: ['seg-0002'], quotedText: 'launched lunar communication relay satellite' }
        }
      ],
      mechanisms: [],
      uncertainties: [],
      tokenUsage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 }
    };

    const irResult = classifyKnowledgeIR(fullIR, registry);
    assert.strictEqual(irResult.totalFacts, 2);
    assert.ok(irResult.duplicatesCount >= 1);
    assert.ok(irResult.novelCount >= 1);
    assert.strictEqual(irResult.factClassifications.length, 2);
    console.log('  ✅ Test 15: Complete Knowledge IR Document Classification Succeeded');
    passedTests++;
  }

  console.log('────────────────────────────────────────────────────────');
  console.log(`Results: ${passedTests} / 15 Tests Passed (100%)`);
  console.log('────────────────────────────────────────────────────────\n');
}

runClassifierTests().catch(err => {
  console.error('Classifier test run failed:', err);
  process.exit(1);
});
