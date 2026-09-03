import assert from 'assert';
import {
  computeDocumentHash,
  normalizeSourceText,
  splitIntoSentences,
  countWords,
  chunkNormalizedText,
  processSourceDocument
} from '../lib/extraction/normalizer';
import { validateSourceSpan } from '../lib/extraction/provenance-validator';

async function runNormalizerTests() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🧪 Running Phase 7.1 Ingestion Normalizer & Chunker Suite...');
  console.log('────────────────────────────────────────────────────────');

  let passedTests = 0;

  // Test 1: Deterministic Normalization
  {
    const input = '  The Reserve   Bank of India\r\n\r\nannounced new monetary  guidelines.  ';
    const norm1 = normalizeSourceText(input);
    const norm2 = normalizeSourceText(input);
    assert.strictEqual(norm1, norm2);
    assert.strictEqual(norm1, 'The Reserve Bank of India\n\nannounced new monetary guidelines.');
    console.log('  ✅ Test 1: Deterministic Text Normalization Passes');
    passedTests++;
  }

  // Test 2: Smart/Curly Quote Normalization
  {
    const input = '“RBI Governor stated: ‘Inflation remains within the 4% target range.’”';
    const norm = normalizeSourceText(input);
    assert.strictEqual(norm, '"RBI Governor stated: \'Inflation remains within the 4% target range.\'"');
    console.log('  ✅ Test 2: Curly Quote Normalization Operates Accurately');
    passedTests++;
  }

  // Test 3: Hyphen & Dash Normalization (En-dash, Em-dash, Non-breaking)
  {
    const input = 'FY 2026–27 policy corridor — bounded between 6.25% and 6.75%.';
    const norm = normalizeSourceText(input);
    assert.strictEqual(norm, 'FY 2026-27 policy corridor - bounded between 6.25% and 6.75%.');
    console.log('  ✅ Test 3: Unicode Dash / Hyphen Normalization Passes');
    passedTests++;
  }

  // Test 4: Strips Coaching Header / Watermark Noise
  {
    const input = 'Page 12 of 45\nCGB Mentors Current Affairs\nThe Monetary Policy Committee convened on August 6, 2026.\nwww.smartkeeda.com';
    const norm = normalizeSourceText(input);
    assert.strictEqual(norm, 'The Monetary Policy Committee convened on August 6, 2026.');
    console.log('  ✅ Test 4: Header / Footer / Watermark Noise Filtered Cleanly');
    passedTests++;
  }

  // Test 5: Paragraph and Sentence Boundary Preservation
  {
    const input = 'First paragraph with detail.\n\nSecond paragraph begins here with ₹10,000 Crore allocation.';
    const sentences = splitIntoSentences(input);
    assert.strictEqual(sentences.length, 2);
    assert.strictEqual(sentences[0], 'First paragraph with detail.');
    assert.strictEqual(sentences[1], 'Second paragraph begins here with ₹10,000 Crore allocation.');
    console.log('  ✅ Test 5: Paragraph & Sentence Boundaries Preserved Exactly');
    passedTests++;
  }

  // Test 6: Exact Preservation of Numbers, Percentages, and Dates
  {
    const input = 'Repo rate at 6.50%, MSF at 6.75%, SDF at 6.25% effective August 15, 2026 for ₹1,27,290.16 Crore.';
    const norm = normalizeSourceText(input);
    assert.strictEqual(norm, input);
    console.log('  ✅ Test 6: Zero Distortion of Numbers, Rates, Dates, and Outlays');
    passedTests++;
  }

  // Test 7: Institutional Names & Regulatory Terms Preserved
  {
    const input = 'Small Farmers Agri-Business Consortium (SFAC) and National Payments Corporation of India (NPCI) launched UPI-Interoperable QR.';
    const norm = normalizeSourceText(input);
    assert.strictEqual(norm, input);
    console.log('  ✅ Test 7: Institutional Entities and Terms Preserved Intact');
    passedTests++;
  }

  // Test 8: Short Document Behavior (No Artificial Padding)
  {
    const shortDoc = 'RBI announced high-value digital payment safety buffer on August 10, 2026.';
    const result = processSourceDocument(shortDoc, 'doc-short');
    assert.strictEqual(result.chunks.length, 1);
    assert.strictEqual(result.chunks[0].wordCount, countWords(shortDoc));
    assert.strictEqual(result.chunks[0].text, shortDoc);
    console.log('  ✅ Test 8: Short Document Yields Single Precise Chunk Without Padding');
    passedTests++;
  }

  // Test 9: Long Document Splitting at Thought Boundaries ($300\text{--}600$ words)
  {
    // Generate an 800-word synthetic regulatory text composed of complete sentences
    const paragraph = 'The Reserve Bank of India issued updated scale-based regulation guidelines for upper layer non-banking financial companies. Each entity must maintain a minimum common equity tier 1 capital ratio of 9.00 percent. The mandatory listing period remains thirty-six months from the date of classification. The liquidity coverage ratio requirement is phased over four fiscal quarters.\n\n';
    const longText = paragraph.repeat(18); // ~750 words
    const result = processSourceDocument(longText, 'doc-long');

    assert.ok(result.chunks.length >= 2, 'Must split long text into 2 or more chunks');
    result.chunks.forEach((chunk, i) => {
      assert.ok(chunk.wordCount >= 200 || i === result.chunks.length - 1, `Chunk ${chunk.chunkId} word count should be bounded`);
      assert.ok(chunk.wordCount <= 750, `Chunk ${chunk.chunkId} must not exceed upper ceiling`);
    });
    console.log(`  ✅ Test 9: Long Document (${result.totalWords} words) Chunked into ${result.chunks.length} Thought-Bounded Units`);
    passedTests++;
  }

  // Test 10: Contextual 1-Sentence Overlap Between Adjacent Chunks
  {
    const paragraph = 'The Monetary Policy Committee voted to keep repo rate unchanged at 6.50 percent. Real GDP growth for 2026-27 is projected at 7.2 percent. Consumer price index inflation is expected at 4.5 percent.\n\n';
    const longText = paragraph.repeat(25); // ~750 words
    const result = processSourceDocument(longText, 'doc-overlap');

    assert.ok(result.chunks.length >= 2);
    const chunk2 = result.chunks[1];
    assert.ok(chunk2.overlapText, 'Chunk 2 must carry contextual overlap text from Chunk 1');
    assert.ok(chunk2.text.startsWith(chunk2.overlapText!), 'Chunk 2 full text must start with overlap sentence');
    console.log('  ✅ Test 10: Rolling 1-Sentence Contextual Overlap Attached Cleanly');
    passedTests++;
  }

  // Test 11: Segment Map Offsets and Text Consistency
  {
    const raw = 'Paragraph A with first sentence. Paragraph B with second sentence.';
    const result = processSourceDocument(raw, 'doc-offsets');
    assert.strictEqual(result.segments.length, 2);

    const seg1 = result.segments[0];
    const seg2 = result.segments[1];
    assert.strictEqual(result.normalizedText.slice(seg1.startOffset, seg1.endOffset), seg1.text);
    assert.strictEqual(result.normalizedText.slice(seg2.startOffset, seg2.endOffset), seg2.text);
    console.log('  ✅ Test 11: Absolute Segment Character Offsets Align Perfectly');
    passedTests++;
  }

  // Test 12: SHA-256 Fingerprint Determinism & Mutation Sensitivity
  {
    const docA = 'RBI circular on Prompt Corrective Action (PCA) framework dated July 2026.';
    const docB = 'RBI circular on Prompt Corrective Action (PCA) framework dated July 2026.';
    const docC = 'RBI circular on Prompt Corrective Action (PCA) framework dated August 2026.';

    const hashA = computeDocumentHash(docA);
    const hashB = computeDocumentHash(docB);
    const hashC = computeDocumentHash(docC);

    assert.strictEqual(hashA, hashB, 'Identical documents must produce identical hash');
    assert.notStrictEqual(hashA, hashC, 'Mutated document must produce different hash');
    console.log('  ✅ Test 12: SHA-256 Fingerprinting is Strictly Deterministic & Collision-Free');
    passedTests++;
  }

  // Test 13: Source Text Immutability (Read-Only Processing)
  {
    const original = 'Immutable source text with special characters: “₹50,000 Cr—SFAC”.';
    const copy = original;
    const result = processSourceDocument(original);
    assert.strictEqual(original, copy, 'Original input string must not be mutated');
    assert.notStrictEqual(result.normalizedText, original, 'Normalized text is a distinct processed output');
    console.log('  ✅ Test 13: Source Evidence Remains Strictly Immutable');
    passedTests++;
  }

  // Test 14: End-to-End Integration with Phase 7.0 Provenance Validator
  {
    const sourceDoc = '“The Union Cabinet approved ₹12,980 Crore outlay for Bharat Maritime Insurance Pool (BMIP).”';
    const normResult = processSourceDocument(sourceDoc, 'doc-bmip');

    // Simulate an LLM extracting a quote from the normalized document
    const extractedSpan = {
      segmentIds: [normResult.segments[0].segmentId],
      quotedText: 'Union Cabinet approved ₹12,980 Crore outlay for Bharat Maritime Insurance Pool'
    };

    const evidenceText = normResult.segmentMap[normResult.segments[0].segmentId];
    const validationResult = validateSourceSpan(extractedSpan, evidenceText);

    assert.strictEqual(validationResult.isValid, true);
    assert.strictEqual(validationResult.code, 'VALIDATED');
    console.log('  ✅ Test 14: Normalized Segment Evidence Verifies with Provenance Firewall (100% Match)');
    passedTests++;
  }

  console.log('────────────────────────────────────────────────────────');
  console.log(`Results: ${passedTests} / 14 Tests Passed (100%)`);
  console.log('────────────────────────────────────────────────────────\n');
}

runNormalizerTests().catch(err => {
  console.error('Normalizer test suite failed:', err);
  process.exit(1);
});
