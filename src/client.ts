import OpenAI from 'openai';
import { DeepSeekConfig } from './types';

export const createDeepSeekClient = (config: DeepSeekConfig): OpenAI => {
    return new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL || 'https://api.deepseek.com',
    });
};
