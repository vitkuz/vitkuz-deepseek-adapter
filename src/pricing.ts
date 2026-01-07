import { PriceInfo } from './types';

export interface ModelPricing {
    input: number; // cost per 1M tokens
    output: number; // cost per 1M tokens
    cachedInput?: number; // cost per 1M tokens
}

/**
 * DeepSeek Pricing (V3 / R1)
 * Prices in USD per 1M tokens
 * Based on official docs: https://api-docs.deepseek.com/
 */
export const DEEPSEEK_PRICING: Record<string, ModelPricing> = {
    'deepseek-chat': {
        input: 0.27,
        cachedInput: 0.07,
        output: 1.1,
    },
    'deepseek-reasoner': {
        input: 0.55,
        cachedInput: 0.14,
        output: 2.19,
    },
};

export const calculateDeepSeekPrice = (
    model: string,
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        prompt_tokens_details?: { cached_tokens?: number };
    },
): PriceInfo | undefined => {
    if (!usage) return undefined;

    const pricing = DEEPSEEK_PRICING[model];
    if (!pricing) return undefined;

    const inputTokens = usage.prompt_tokens ?? 0;
    const outputTokens = usage.completion_tokens ?? 0;
    const cachedTokens = usage.prompt_tokens_details?.cached_tokens ?? 0;

    const regularInputTokens = inputTokens - cachedTokens;

    const inputCost =
        (regularInputTokens / 1_000_000) * pricing.input +
        (cachedTokens / 1_000_000) * (pricing.cachedInput ?? pricing.input);

    const outputCost = (outputTokens / 1_000_000) * pricing.output;

    return {
        total: Number((inputCost + outputCost).toFixed(6)),
        inputCost: Number(inputCost.toFixed(6)),
        outputCost: Number(outputCost.toFixed(6)),
        currency: 'USD',
    };
};
