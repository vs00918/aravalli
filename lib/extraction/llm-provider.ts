/**
 * LLM Provider Abstraction & Contract
 */

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface LLMResponse<T> {
  data: T;
  rawText: string;
  usage: TokenUsage;
  latencyMs: number;
  model: string;
  provider: string;
}

export interface LLMProvider {
  providerName: string;
  modelName: string;
  generateStructured<T>(
    prompt: string,
    schema: Record<string, any>,
    systemPrompt?: string
  ): Promise<LLMResponse<T>>;
}
