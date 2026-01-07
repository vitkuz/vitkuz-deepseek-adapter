import { createAdapter, DEEPSEEK_MODELS } from '../src/index';
import { getRequiredVariable } from './common';

const apiKey = getRequiredVariable('DEEPSEEK_API_KEY');

// Custom logger to capture errors
let lastError: { message: string; data: any } | null = null;
const logger = {
    debug: () => { },
    info: () => { },
    warn: () => { },
    error: (message: string, data: any) => {
        console.log(`Captured expected error: ${message}`, data);
        lastError = { message, data };
    },
};

const adapter = createAdapter({ apiKey }, logger);

async function main() {
    console.log('Starting Model Validation Test...');

    try {
        console.log('Testing invalid model fallback...');
        const result = await adapter.createChatCompletion({
            messages: [{ role: 'user', content: 'Test fallback' }],
            model: 'invalid-model' as any,
        });

        if (result.model !== DEEPSEEK_MODELS.CHAT) {
            throw new Error(`Expected fallback to ${DEEPSEEK_MODELS.CHAT}, but got ${result.model}`);
        }

        if (!lastError || lastError.message !== 'deepseek:createChatCompletion:unsupported-model') {
            throw new Error('Expected validation error to be logged, but it was not');
        }

        console.log('Fallback and error logging verified successfully!');
        console.log(`Used model: ${result.model}`);
        console.log(`Original input model: ${result.input?.model}`);
        console.log(`Cost: ${result.price?.total} ${result.price?.currency}`);
    } catch (error) {
        console.error('Model Validation Test Failed:', error);
        process.exit(1);
    }

    console.log('Model Validation Test Completed.');
}

main().catch(console.error);
