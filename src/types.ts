import OpenAI from 'openai';

export interface Logger {
    debug: (message: string, context?: { error?: any; data?: any }) => void;
    [key: string]: any;
}

export interface DeepSeekConfig {
    apiKey: string;
    baseURL?: string;
}

export interface DeepSeekContext {
    client: OpenAI;
    logger?: Logger;
}

export type ChatMessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage {
    role: ChatMessageRole;
    content: string;
    name?: string;
}

export interface PriceInfo {
    total: number;
    inputCost: number;
    outputCost: number;
    currency: string;
}

export interface CreateChatCompletionInput {
    model: 'deepseek-chat' | 'deepseek-reasoner' | string;
    messages: ChatMessage[];
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    response_format?: { type: 'text' | 'json_object' };
    stop?: string | string[];
}

export interface CreateChatCompletionOutput {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: ChatMessage;
        finish_reason: string;
    }[];
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        prompt_tokens_details?: {
            cached_tokens: number;
        };
    };
    price?: PriceInfo;
    input?: CreateChatCompletionInput;
}
