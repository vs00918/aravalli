import assert from 'assert';
import {
  EpistemicStatusSchema,
  ClaimStanceSchema,
  KnowledgeIRSchema,
  KnowledgeIR,
  ExtractedFact
} from '../lib/extraction/schema';
import {
  validateSourceSpan,
  validateKnowledgeIRProvenance,
  normalizeEvidenceWhitespace
} from '../lib/extraction/provenance-validator';
import {
  SemanticMockProvider,
  DEFAULT_MOCK_KNOWLEDGE_IR
} from '../lib/extraction/providers/semantic-mock';

async function runTests() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🧪 Running Phase 7.0/7.1 Semantic Extraction & Provenance Suite...');
  console.log('────────────────────────────────────────────────────────');

  let passedTests = 0;

  // Test 1: Valid Exact Provenance Passes
  {
    const evidence = 'The Reserve Bank of India Monetary Policy Committee maintained the policy Repo Rate at 6.50% by unanimous decision.';
    const span = {
      segmentIds: ['seg-001'],
      quotedText: 'maintained the policy Repo Rate at 6.50% by unanimous decision'
    };
    const result = validateSourceSpan(span, evidence);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.code, 'VALIDATED');
    console.log('  ✅ Test 1: Valid Exact Substring Provenance Passes');
    passedTests++;
  }

  // Test 2: Modified / Inaccurate Quote Fails Closed
  {
    const evidence = 'The Reserve Bank of India Monetary Policy Committee maintained the policy Repo Rate at 6.50% by unanimous decision.';
    const span = {
      segmentIds: ['seg-001'],
      quotedText: 'maintained the policy Repo Rate at 6.25% by majority vote' // Hallucinated numbers & words
    };
    const result = validateSourceSpan(span, evidence);
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.code, 'INVALID_PROVENANCE_QUOTE_MISMATCH');
    console.log('  ✅ Test 2: Inaccurate / Hallucinated Quote Fails Closed');
    passedTests++;
  }

  // Test 3: Missing or Empty Provenance Fails Closed
  {
    const evidence = 'The Reserve Bank of India announced new norms.';
    const span = {
      segmentIds: ['seg-001'],
      quotedText: '   ' // Empty quote
    };
    const result = validateSourceSpan(span, evidence);
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.code, 'MISSING_PROVENANCE');
    console.log('  ✅ Test 3: Missing / Empty Provenance Fails Closed');
    passedTests++;
  }

  // Test 4: Cross-Segment Evidence Reconstruction & Substring Matching
  {
    const segmentMap: Record<string, string> = {
      'seg-001': 'Standing Deposit Facility rate remains at 6.25%',
      'seg-002': 'and Marginal Standing Facility rate remains at 6.75%.'
    };
    const span = {
      segmentIds: ['seg-001', 'seg-002'],
      quotedText: 'Standing Deposit Facility rate remains at 6.25% and Marginal Standing Facility rate remains at 6.75%.'
    };
    const reconstructed = `${segmentMap['seg-001']} ${segmentMap['seg-002']}`;
    const result = validateSourceSpan(span, reconstructed);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.code, 'VALIDATED');
    console.log('  ✅ Test 4: Cross-Segment Evidence Reconstruction Matches');
    passedTests++;
  }

  // Test 5: Harmless Whitespace Normalization (Newlines, Multi-Spaces, Tabs)
  {
    const rawEvidence = 'RBI Governor announced:\n\n\t  "Core inflation has   moderated to 3.1%."';
    const span = {
      segmentIds: ['seg-005'],
      quotedText: 'Core inflation has moderated to 3.1%.'
    };
    const result = validateSourceSpan(span, rawEvidence);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.code, 'VALIDATED');
    console.log('  ✅ Test 5: Harmless Whitespace Normalization Operates Reliably');
    passedTests++;
  }

  // Test 6: Epistemic Status & Stance Schema Validation
  {
    // Valid enums
    assert.strictEqual(EpistemicStatusSchema.parse('SOURCE_EXTRACTED'), 'SOURCE_EXTRACTED');
    assert.strictEqual(EpistemicStatusSchema.parse('SOURCE_DERIVED'), 'SOURCE_DERIVED');
    assert.strictEqual(EpistemicStatusSchema.parse('MODEL_INTERPRETATION'), 'MODEL_INTERPRETATION');

    assert.strictEqual(ClaimStanceSchema.parse('ASSERTED'), 'ASSERTED');
    assert.strictEqual(ClaimStanceSchema.parse('HYPOTHETICAL'), 'HYPOTHETICAL');
    assert.strictEqual(ClaimStanceSchema.parse('REFUTED'), 'REFUTED');
    assert.strictEqual(ClaimStanceSchema.parse('POSSIBLE'), 'POSSIBLE');

    // Invalid enum throws
    assert.throws(() => EpistemicStatusSchema.parse('UNVERIFIED_GUESS'));
    assert.throws(() => ClaimStanceSchema.parse('ABSOLUTE_TRUTH'));
    console.log('  ✅ Test 6: Epistemic Status & Claim Stance Enums Validated');
    passedTests++;
  }

  // Test 7: Mechanism Steps Preserve Independent Provenance
  {
    const mockIR = DEFAULT_MOCK_KNOWLEDGE_IR;
    const parsed = KnowledgeIRSchema.parse(mockIR);
    assert.ok(parsed.mechanisms.length > 0);
    assert.strictEqual(parsed.mechanisms[0].steps.length, 2);
    assert.ok(parsed.mechanisms[0].steps[0].provenance.quotedText.length > 0);
    console.log('  ✅ Test 7: Mechanism Steps Preserve Independent Provenance');
    passedTests++;
  }

  // Test 8: Hermetic Mock Provider Contract & Determinism
  {
    const provider = new SemanticMockProvider();
    const response = await provider.generateStructured<KnowledgeIR>(
      'Extract RBI MPC Policy Decision',
      KnowledgeIRSchema.shape
    );
    assert.strictEqual(response.provider, 'SemanticMockProvider');
    assert.strictEqual(response.model, 'mock-deterministic-v1');
    assert.strictEqual(response.data.facts.length, 2);
    assert.strictEqual(response.data.facts[0].numericalAnchors[0], '6.50%');
    console.log('  ✅ Test 8: Hermetic Mock Provider Delivers Deterministic Knowledge IR');
    passedTests++;
  }

  // Test 9: Complete Knowledge IR Provenance Validation & Anti-Hallucination Firewall
  {
    const segmentMap: Record<string, string> = {
      'seg-001': 'The Reserve Bank of India Monetary Policy Committee maintained the policy Repo Rate at 6.50% by unanimous decision.',
      'seg-002': 'Standing Deposit Facility rate remains at 6.25% and Marginal Standing Facility rate remains at 6.75%.'
    };

    const validation = validateKnowledgeIRProvenance(DEFAULT_MOCK_KNOWLEDGE_IR, segmentMap);
    assert.strictEqual(validation.isFullyValid, true);
    assert.strictEqual(validation.validFacts.length, 2);
    assert.strictEqual(validation.quarantinedFacts.length, 0);
    assert.strictEqual(validation.validMechanisms.length, 1);
    assert.strictEqual(validation.quarantinedMechanisms.length, 0);

    // Now inject a hallucinated fact
    const corruptedIR: KnowledgeIR = JSON.parse(JSON.stringify(DEFAULT_MOCK_KNOWLEDGE_IR));
    corruptedIR.facts.push({
      factId: 'fact-hallucinated',
      statement: 'Cash Reserve Ratio was reduced to 3.50%.',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: ['3.50%'],
      provenance: {
        segmentIds: ['seg-001'],
        quotedText: 'Cash Reserve Ratio was reduced to 3.50%' // Not in segment 001!
      }
    });

    const corruptedValidation = validateKnowledgeIRProvenance(corruptedIR, segmentMap);
    assert.strictEqual(corruptedValidation.isFullyValid, false);
    assert.strictEqual(corruptedValidation.validFacts.length, 2);
    assert.strictEqual(corruptedValidation.quarantinedFacts.length, 1);
    assert.strictEqual(corruptedValidation.quarantinedFacts[0].code, 'INVALID_PROVENANCE_QUOTE_MISMATCH');
    console.log('  ✅ Test 9: Fail-Closed Anti-Hallucination Firewall Quarantines Unbacked Claims');
    passedTests++;
  }

  console.log('────────────────────────────────────────────────────────');
  console.log(`Results: ${passedTests} / 9 Tests Passed (100%)`);
  console.log('────────────────────────────────────────────────────────\n');
}

runTests().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
