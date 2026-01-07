import {
    DeepSeekContext,
    CreateChatCompletionInput,
    CreateChatCompletionOutput,
} from '../types';
import { DEEPSEEK_MODELS } from '../models';
import { calculateDeepSeekPrice } from '../pricing';

export const createChatCompletion =
    (ctx: DeepSeekContext) =>
        async (input: CreateChatCompletionInput): Promise<CreateChatCompletionOutput> => {
            const { client, logger } = ctx;

            // Model Validation
            let model = input.model;
            const supportedModels = Object.values(DEEPSEEK_MODELS) as string[];

            if (!supportedModels.includes(model)) {
                logger?.error('deepseek:createChatCompletion:unsupported-model', {
                    provided: model,
                    fallback: DEEPSEEK_MODELS.CHAT,
                });
                model = DEEPSEEK_MODELS.CHAT;
            }

            logger?.debug('deepseek:createChatCompletion:start', { data: input });

            try {
                const response = (await client.chat.completions.create({
                    ...input,
                    model,
                    messages: input.messages as any,
                })) as any;

                const price = calculateDeepSeekPrice(model, response.usage);

                const output: CreateChatCompletionOutput = {
                    ...response,
                    model,
                    price,
                    input,
                };

                logger?.debug('deepseek:createChatCompletion:success', { data: output });

                return output;
            } catch (error) {
                logger?.debug('deepseek:createChatCompletion:error', { error });
                throw error;
            }
        };
