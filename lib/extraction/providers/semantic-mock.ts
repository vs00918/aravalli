import { LLMProvider, LLMResponse, TokenUsage } from '../llm-provider';
import { KnowledgeIR } from '../schema';

/**
 * Standard Golden Fixture for Hermetic Testing
 */
export const DEFAULT_MOCK_KNOWLEDGE_IR: KnowledgeIR = {
  irVersion: '1.0.0',
  documentId: 'doc-rbi-monetary-policy-aug2026',
  batchId: 'batch-2026-08-cgb',
  chunkId: 'chunk-001',
  extractedAt: '2026-09-03T12:00:00.000Z',
  provider: 'SemanticMockProvider',
  model: 'mock-deterministic-v1',
  facts: [
    {
      factId: 'fact-001',
      statement: 'The Reserve Bank of India Monetary Policy Committee maintained the policy Repo Rate at 6.50% by unanimous decision.',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: ['6.50%'],
      temporalAnchor: 'August 2026',
      institutionalEntity: 'Reserve Bank of India',
      provenance: {
        startOffset: 0,
        endOffset: 120,
        segmentIds: ['seg-0001'],
        quotedText: 'The Reserve Bank of India Monetary Policy Committee maintained the policy Repo Rate at 6.50% by unanimous decision.'
      }
    },
    {
      factId: 'fact-002',
      statement: 'Standing Deposit Facility (SDF) rate remains at 6.25% and Marginal Standing Facility (MSF) rate remains at 6.75%.',
      epistemicStatus: 'SOURCE_EXTRACTED',
      stance: 'ASSERTED',
      numericalAnchors: ['6.25%', '6.75%'],
      temporalAnchor: 'August 2026',
      institutionalEntity: 'Reserve Bank of India',
      provenance: {
        startOffset: 121,
        endOffset: 240,
        segmentIds: ['seg-0001', 'seg-0002'],
        quotedText: 'Standing Deposit Facility rate remains at 6.25% and Marginal Standing Facility rate remains at 6.75%.'
      }
    }
  ],
  mechanisms: [
    {
      mechanismId: 'mech-001',
      name: 'Liquidity Adjustment Corridor Transmission',
      trigger: 'MPC decides to maintain benchmark repo rate',
      steps: [
        {
          stepNumber: 1,
          action: 'Repo rate anchored at 6.50%',
          result: 'Sets center of policy corridor',
          provenance: {
            segmentIds: ['seg-0001'],
            quotedText: 'maintained the policy Repo Rate at 6.50%'
          }
        },
        {
          stepNumber: 2,
          action: 'SDF placed at 25 bps below repo',
          result: 'Absorbs surplus liquidity at 6.25%',
          provenance: {
            segmentIds: ['seg-0002'],
            quotedText: 'Standing Deposit Facility rate remains at 6.25%'
          }
        }
      ],
      outcome: 'Corridor width stabilized at 50 bps (+/- 25 bps around repo)'
    }
  ],
  uncertainties: [],
  tokenUsage: {
    promptTokens: 450,
    completionTokens: 280,
    totalTokens: 730
  }
};

export class SemanticMockProvider implements LLMProvider {
  public readonly providerName = 'SemanticMockProvider';
  public readonly modelName = 'mock-deterministic-v1';

  private customFixtures: Map<string, any> = new Map();

  constructor(fixtures?: Record<string, any>) {
    if (fixtures) {
      for (const [key, value] of Object.entries(fixtures)) {
        this.customFixtures.set(key, value);
      }
    }
  }

  public setFixture(key: string, data: any): void {
    this.customFixtures.set(key, data);
  }

  public async generateStructured<T>(
    prompt: string,
    schema: Record<string, any>,
    systemPrompt?: string
  ): Promise<LLMResponse<T>> {
    // Check if prompt matches a registered custom fixture key
    for (const [key, fixture] of this.customFixtures.entries()) {
      if (prompt.includes(key)) {
        return {
          data: fixture as T,
          rawText: JSON.stringify(fixture),
          usage: {
            promptTokens: 100,
            completionTokens: 50,
            totalTokens: 150
          },
          latencyMs: 5,
          model: this.modelName,
          provider: this.providerName
        };
      }
    }

    // Default to golden mock Knowledge IR
    const responseData = DEFAULT_MOCK_KNOWLEDGE_IR as unknown as T;
    return {
      data: responseData,
      rawText: JSON.stringify(responseData),
      usage: DEFAULT_MOCK_KNOWLEDGE_IR.tokenUsage,
      latencyMs: 12,
      model: this.modelName,
      provider: this.providerName
    };
  }
}
