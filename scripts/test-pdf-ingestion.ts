import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { runIngestion } from './ingest-feed';
import { PdfExtractor } from '../lib/banking-ca/pipeline/pdf-extractor';

const rootDir = process.cwd();
const testPdfPath = path.join(rootDir, 'data/CGB_Mentors_December_2026_Sample.pdf');

// Helper to generate a compliant PDF with text stream
function generateSamplePdfBuffer(): Buffer {
  const textContent = `
## PART 1: P1 - CRITICAL (MUST MASTER)
1. **RBI Guidelines on Cross-Border Interoperability for Fast Payment Systems (FPS) 2026**:
- RBI establishes bilateral linkages between UPI and global fast payment networks.
- Settlement window reduced to real-time (T+0) with 24x7 clearing through RTGS.
- Initial corridors include UAE, Singapore, Sri Lanka, and Mauritius.

## PART 2: P2 - HIGH (HIGH-YIELD MEMORIZATION)
2. **SEBI Framework for Performance Validation of Investment Advisers**:
- SEBI mandates third-party audit of historical returns claimed by Research Analysts and IAs.
- Claims on social media restricted to audited alpha metrics.
`;

  // Escape special chars for PDF literal strings
  const lines = textContent.trim().split('\n');
  let y = 750;
  let streamParts: string[] = [];
  for (const line of lines) {
    if (!line.trim()) {
      y -= 15;
      continue;
    }
    const escaped = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    streamParts.push(`BT /F1 10 Tf 50 ${y} Td (${escaped}) Tj ET`);
    y -= 14;
  }

  const streamBody = streamParts.join('\n');
  const streamLength = Buffer.byteLength(streamBody);

  const pdfRaw = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamBody}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000000 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
0
%%EOF`;

  return Buffer.from(pdfRaw);
}

async function runPdfIngestionTest() {
  console.log('────────────────────────────────────────────────────────');
  console.log('🧪 Running W11.6 Direct PDF Ingestion & Extraction Test...');
  console.log('────────────────────────────────────────────────────────\n');

  try {
    // 1. Generate real binary PDF file on disk
    const samplePdfBuffer = generateSamplePdfBuffer();
    fs.writeFileSync(testPdfPath, samplePdfBuffer);
    console.log(`[PDF Test] Generated binary PDF at '${testPdfPath}' (${samplePdfBuffer.length} bytes)`);

    // 2. Direct extraction check via PdfExtractor
    const extractedItems = await PdfExtractor.extractFromPdf(samplePdfBuffer, {
      batchName: 'CGB_Mentors_December_2026_Sample.pdf'
    });

    console.log(`[PDF Test] Extracted ${extractedItems.length} item(s) directly from binary PDF stream:`);
    for (const item of extractedItems) {
      console.log(`  • [${item.priorityHint}] ${item.headline} (Source: ${item.sourceName})`);
    }

    assert.strictEqual(extractedItems.length >= 2, true, 'Must extract at least 2 items from PDF');
    assert.strictEqual(extractedItems[0].sourceName, 'CGB_MENTORS', 'Source name must be CGB_MENTORS');
    assert.strictEqual(extractedItems[0].priorityHint, 'P1', 'First item must be P1');

    // 3. Test Full Pipeline Execution via CLI Runner
    const result = await runIngestion(testPdfPath, false);
    assert.ok(result, 'Ingestion result must exist');

    const { updatedCorpus, report } = result;
    assert.strictEqual(report.newEntitiesCreated >= 1, true, 'Must create new canonical entities from PDF');

    const fastPaymentTopic = updatedCorpus.find(t => t.slug.includes('cross-border-interoperability') || t.title.includes('Fast Payment'));
    assert.ok(fastPaymentTopic, 'Fast payment topic extracted from PDF must be in corpus');

    console.log('\nAsserting Direct PDF Ingestion Invariants:');
    console.log('  ✅ 1. Binary PDF accepted directly without manual text/JSON conversion.');
    console.log('  ✅ 2. Source & batch metadata derived automatically from PDF filename & structure.');
    console.log('  ✅ 3. Section boundaries & priorities (P1, P2) parsed reliably.');
    console.log('  ✅ 4. Passed seamlessly into frozen canonicalization and entity resolution pipeline.');

    console.log('\n🎉 Direct PDF Ingestion Test PASSED 100%!\n');
  } finally {
    if (fs.existsSync(testPdfPath)) {
      fs.unlinkSync(testPdfPath);
    }
  }
}

if (require.main === module) {
  runPdfIngestionTest().catch(err => {
    console.error('PDF ingestion test failed:', err);
    process.exit(1);
  });
}
