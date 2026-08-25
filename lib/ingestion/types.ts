export interface KnowledgeProposal {
  targetChapterSlug?: string;
  targetChapterTitle?: string;
  matchedConceptSlugs: string[];
  matchedConceptTitles: string[];
  extractedSummary: string;
  candidateInsights: string[];
  candidateConnections: Array<{
    sourceConceptSlug: string;
    targetConceptSlug: string;
    relationshipType: string;
    explanation: string;
  }>;
  candidateQuestions: Array<{
    question: string;
    description: string;
  }>;
  processorName: string;
  processedAt: string;
}

export interface ExtractionProvider {
  name: string;
  process(text: string, title?: string, url?: string): Promise<KnowledgeProposal>;
}
