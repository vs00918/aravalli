import { RawIncomingFeedItem } from './types';

export interface RawSourceInput {
  rawText: string;
  sourceName: 'CGB_MENTORS' | 'SMARTKEEDA' | 'PIB' | 'OFFICIAL_GAZETTE' | 'OTHER';
  batchName: string;
  publishedDate: string;
}

export class PdfExtractor {
  /**
   * Extracts and parses text directly from binary PDF Buffer
   */
  public static async extractFromPdf(
    pdfBuffer: Buffer,
    metadata: { batchName: string; sourceName?: 'CGB_MENTORS' | 'SMARTKEEDA' | 'PIB' | 'OFFICIAL_GAZETTE' | 'OTHER'; publishedDate?: string }
  ): Promise<RawIncomingFeedItem[]> {
    // Support both pdf-parse v1.x (function) and v2.x (class PDFParse)
    // @ts-ignore
    const pdfLib = require('pdf-parse');
    let rawText = '';
    if (typeof pdfLib === 'function') {
      const parsed = await pdfLib(pdfBuffer);
      rawText = parsed.text || '';
    } else if (pdfLib.PDFParse) {
      const parser = new pdfLib.PDFParse({ data: pdfBuffer });
      const res = await parser.getText();
      rawText = res?.text || '';
    }

    const sourceName = metadata.sourceName || (
      metadata.batchName.toLowerCase().includes('cgb') ? 'CGB_MENTORS' :
      metadata.batchName.toLowerCase().includes('smartkeeda') ? 'SMARTKEEDA' :
      metadata.batchName.toLowerCase().includes('pib') ? 'PIB' : 'OTHER'
    );

    const publishedDate = metadata.publishedDate || new Date().toISOString().slice(0, 10);

    return PdfExtractor.extractFromText({
      rawText,
      sourceName,
      batchName: metadata.batchName,
      publishedDate
    });
  }

  /**
   * Normalizes raw extracted text from CGB Mentors, Smartkeeda, or PIB into standard RawIncomingFeedItem[]
   */
  public static extractFromText(input: RawSourceInput): RawIncomingFeedItem[] {
    const { rawText, sourceName, batchName, publishedDate } = input;
    const items: RawIncomingFeedItem[] = [];

    // Split text into section blocks or numbered items
    const lines = rawText.split('\n');
    let currentPriorityHint: 'P1' | 'P2' | 'P3' | 'P4' = 'P2';
    let currentCategoryHint = 'BANKING_REGULATION';

    let currentItem: {
      headline: string;
      bodyLines: string[];
      priorityHint: 'P1' | 'P2' | 'P3' | 'P4';
      categoryHint: string;
    } | null = null;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      // Section header detection
      if (/PART\s*1\s*[:\-—]|P1\s*[:\-—]|CRITICAL|DEEP/i.test(line)) {
        currentPriorityHint = 'P1';
        continue;
      }
      if (/PART\s*2\s*[:\-—]|P2\s*[:\-—]|HIGH/i.test(line)) {
        currentPriorityHint = 'P2';
        continue;
      }
      if (/PART\s*3\s*[:\-—]|P3\s*[:\-—]|MODERATE|ONE-LINERS/i.test(line)) {
        currentPriorityHint = 'P3';
        continue;
      }

      // Check category hints in headers
      if (/PAYMENTS|UPI|CBDT|NPCI/i.test(line)) currentCategoryHint = 'DIGITAL_PAYMENTS';
      else if (/SCHEME|CABINET|PM-|PRADHAN/i.test(line)) currentCategoryHint = 'GOVERNMENT_SCHEMES';
      else if (/SEBI|MUTUAL FUND|STOCK|SHARE/i.test(line)) currentCategoryHint = 'FINANCIAL_MARKETS';
      else if (/RBI|REGULATION|CIRCULAR|MONETARY/i.test(line)) currentCategoryHint = 'BANKING_REGULATION';

      // Detect distinct topic title anchor (e.g. "1. **Headline**:" or "### Headline" or "* **Headline**:")
      const isNumberedHeader = /^\d+\.\s+(\*\*)?[^*:\n]{5,}(\*\*)?(:|$)/.test(line);
      const isBoldBulletHeader = /^(\*|-|•)\s+\*\*[^*]{5,}\*\*(:|$)/.test(line);
      const isMarkdownHeader = /^#{1,4}\s+[A-Za-z0-9]/.test(line);

      const isTopicHeader = isNumberedHeader || isBoldBulletHeader || isMarkdownHeader;

      if (isTopicHeader) {
        if (currentItem && currentItem.headline && currentItem.bodyLines.length > 0) {
          items.push({
            id: `EXTRACT-${items.length + 1}-${Date.now()}`,
            headline: currentItem.headline,
            bodyText: currentItem.bodyLines.join('\n'),
            sourceName,
            batchName,
            publishedDate,
            priorityHint: currentItem.priorityHint,
            categoryHint: currentItem.categoryHint
          });
        }

        const cleanHeadline = line
          .replace(/^(\d+\.|\*|-|•|#{1,4})\s*/, '')
          .replace(/[*#]/g, '')
          .replace(/\s*\(~?\d+\s*min\)$/i, '')
          .replace(/:$/, '')
          .trim();

        currentItem = {
          headline: cleanHeadline,
          bodyLines: [line],
          priorityHint: currentPriorityHint,
          categoryHint: currentCategoryHint
        };
      } else if (currentItem) {
        currentItem.bodyLines.push(line);
      }
    }

    if (currentItem && currentItem.headline && currentItem.bodyLines.length > 0) {
      items.push({
        id: `EXTRACT-${items.length + 1}-${Date.now()}`,
        headline: currentItem.headline,
        bodyText: currentItem.bodyLines.join('\n'),
        sourceName,
        batchName,
        publishedDate,
        priorityHint: currentItem.priorityHint,
        categoryHint: currentItem.categoryHint
      });
    }

    return items;
  }
}
