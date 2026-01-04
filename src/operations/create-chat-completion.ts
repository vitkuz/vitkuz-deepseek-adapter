import { DeepSeekContext, CreateChatCompletionInput, CreateChatCompletionOutput } from '../types';

export const createChatCompletion =
    (ctx: DeepSeekContext) =>
    async (input: CreateChatCompletionInput): Promise<CreateChatCompletionOutput> => {
        const { client, logger } = ctx;

        logger?.debug('deepseek:createChatCompletion:start', { data: input });

        try {
            const response = await client.chat.completions.create(input as any);

            logger?.debug('deepseek:createChatCompletion:success', { data: response });

            return response as CreateChatCompletionOutput;
        } catch (error) {
            logger?.debug('deepseek:createChatCompletion:error', { error });
            throw error;
        }
    };
