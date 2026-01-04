import OpenAI from 'openai';
import { DeepSeekConfig, DeepSeekContext, Logger } from './types';
import { createDeepSeekClient } from './client';
import { createChatCompletion } from './operations/create-chat-completion';

export interface DeepSeekAdapter {
    createChatCompletion: ReturnType<typeof createChatCompletion>;
}

export const createAdapter = (config: DeepSeekConfig, logger?: Logger): DeepSeekAdapter => {
    const client = createDeepSeekClient(config);
    const context: DeepSeekContext = { client, logger };

    return {
        createChatCompletion: createChatCompletion(context),
    };
};
