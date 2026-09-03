import crypto from 'crypto';

export interface NormalizedSegment {
  segmentId: string;
  documentId: string;
  text: string;
  startOffset: number;
  endOffset: number;
  wordCount: number;
}

export interface SemanticChunk {
  chunkId: string;
  documentId: string;
  segmentIds: string[];
  text: string;
  ownedText: string;
  overlapText?: string;
  startOffset: number;
  endOffset: number;
  wordCount: number;
}

export interface NormalizationResult {
  documentId: string;
  normalizedText: string;
  segments: NormalizedSegment[];
  segmentMap: Record<string, string>;
  chunks: SemanticChunk[];
  totalWords: number;
}

/**
 * Deterministic SHA-256 Document Identification
 */
export function computeDocumentHash(text: string): string {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * Normalizes source text deterministically:
 * - Normalizes Unicode quotation marks to ASCII
 * - Normalizes Unicode dashes/hyphens to ASCII
 * - Strips common non-semantic artifacts (watermarks, repetitive page headers)
 * - Normalizes multi-whitespace without breaking sentence structure or altering numbers/dates
 */
export function normalizeSourceText(rawText: string): string {
  if (!rawText) return '';

  let text = rawText;

  // 1. Normalize line endings
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. Normalize smart/curly quotes and apostrophes
  text = text.replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"');
  text = text.replace(/[\u2018\u2019\u201A\u201B`]/g, "'");

  // 3. Normalize dashes and hyphens (en-dash, em-dash, non-breaking hyphen)
  text = text.replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, '-');

  // 4. Strip obvious coaching header/footer noise patterns if present on isolated lines
  text = text.replace(/^[ \t]*(?:Page\s+\d+\s+of\s+\d+|www\.[a-z0-9\.-]+\.[a-z]{2,}|CGB\s+Mentors\s+Current\s+Affairs|Smartkeeda\s+Monthly\s+PDF)[ \t]*$/gim, '');

  // 5. Normalize multiple spaces and tabs within lines while preserving paragraph breaks
  text = text.split('\n')
    .map(line => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n');

  // 6. Normalize multiple blank lines to double newline (paragraph boundary)
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return text;
}

/**
 * Splits normalized text into discrete sentence units using sentence-boundary heuristics.
 * Preserves decimal points in numbers (e.g., 6.50%, ₹1.25 Lakh Cr) and abbreviations.
 */
export function splitIntoSentences(text: string): string[] {
  if (!text || text.trim().length === 0) return [];

  const sentences: string[] = [];
  
  // Split on paragraph boundaries first
  const paragraphs = text.split(/\n\n+/);
  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) continue;

    // Split sentences within paragraph: (?<=[.!?])\s+(?=[A-Z0-9"“'‘₹])
    const raw = trimmedPara.split(/(?<=[.!?])\s+(?=[A-Z0-9"“'‘₹])/);
    for (const s of raw) {
      const sTrim = s.trim();
      if (sTrim) {
        sentences.push(sTrim);
      }
    }
  }

  return sentences.length > 0 ? sentences : [text.trim()];
}

/**
 * Counts words accurately by splitting on whitespace.
 */
export function countWords(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  return text.trim().split(/\s+/).length;
}

/**
 * Generates Segment Map and Thought-Boundary Chunks ($300\text{--}600$ words)
 * with a rolling 1-sentence contextual overlap ($20\text{--}40$ words).
 */
export function chunkNormalizedText(
  normalizedText: string,
  documentId: string,
  minWords = 300,
  maxWords = 600
): { segments: NormalizedSegment[]; segmentMap: Record<string, string>; chunks: SemanticChunk[] } {
  const sentences = splitIntoSentences(normalizedText);
  const segments: NormalizedSegment[] = [];
  const segmentMap: Record<string, string> = {};

  let currentOffset = 0;
  sentences.forEach((sentence, idx) => {
    const segmentId = `seg-${String(idx + 1).padStart(4, '0')}`;
    const startOffset = normalizedText.indexOf(sentence, currentOffset);
    const endOffset = startOffset >= 0 ? startOffset + sentence.length : currentOffset + sentence.length;
    currentOffset = endOffset;

    const seg: NormalizedSegment = {
      segmentId,
      documentId,
      text: sentence,
      startOffset: startOffset >= 0 ? startOffset : 0,
      endOffset,
      wordCount: countWords(sentence)
    };

    segments.push(seg);
    segmentMap[segmentId] = sentence;
  });

  const chunks: SemanticChunk[] = [];
  let chunkIdx = 1;
  let currentChunkSentences: NormalizedSegment[] = [];
  let currentChunkWordCount = 0;
  let previousOverlapSentence: NormalizedSegment | null = null;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    currentChunkSentences.push(seg);
    currentChunkWordCount += seg.wordCount;

    const isLastSegment = i === segments.length - 1;
    const reachedTargetSize = currentChunkWordCount >= minWords;
    const exceededMaxSize = currentChunkWordCount >= maxWords;

    if ((reachedTargetSize && (seg.text.endsWith('.') || seg.text.endsWith('\n\n'))) || exceededMaxSize || isLastSegment) {
      const chunkId = `chunk-${String(chunkIdx).padStart(3, '0')}`;
      const segmentIds = currentChunkSentences.map(s => s.segmentId);
      const ownedText = currentChunkSentences.map(s => s.text).join(' ');
      
      const overlapText = previousOverlapSentence ? previousOverlapSentence.text : undefined;
      const fullText = overlapText ? `${overlapText} ${ownedText}` : ownedText;
      
      const startOffset = currentChunkSentences[0].startOffset;
      const endOffset = currentChunkSentences[currentChunkSentences.length - 1].endOffset;

      chunks.push({
        chunkId,
        documentId,
        segmentIds,
        text: fullText,
        ownedText,
        overlapText,
        startOffset,
        endOffset,
        wordCount: countWords(fullText)
      });

      // Prepare 1-sentence overlap for the next chunk
      previousOverlapSentence = currentChunkSentences[currentChunkSentences.length - 1];
      currentChunkSentences = [];
      currentChunkWordCount = 0;
      chunkIdx++;
    }
  }

  // Handle case where document is smaller than minWords
  if (chunks.length === 0 && segments.length > 0) {
    const chunkId = `chunk-001`;
    const segmentIds = segments.map(s => s.segmentId);
    const ownedText = segments.map(s => s.text).join(' ');
    chunks.push({
      chunkId,
      documentId,
      segmentIds,
      text: ownedText,
      ownedText,
      startOffset: segments[0].startOffset,
      endOffset: segments[segments.length - 1].endOffset,
      wordCount: countWords(ownedText)
    });
  }

  return { segments, segmentMap, chunks };
}

/**
 * End-to-End Processing of a Source Document
 */
export function processSourceDocument(
  rawText: string,
  docIdPrefix = 'doc'
): NormalizationResult {
  const hash = computeDocumentHash(rawText);
  const documentId = `${docIdPrefix}-${hash.slice(0, 16)}`;
  const normalizedText = normalizeSourceText(rawText);
  const { segments, segmentMap, chunks } = chunkNormalizedText(normalizedText, documentId);

  return {
    documentId,
    normalizedText,
    segments,
    segmentMap,
    chunks,
    totalWords: countWords(normalizedText)
  };
}
