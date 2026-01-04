import * as dotenv from 'dotenv';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createAdapter } from '../src/index';

dotenv.config({ path: join(__dirname, '../.env') });

const apiKey = process.env.DEEPSEEK_API_KEY;

if (!apiKey) {
    console.error('DEEPSEEK_API_KEY environment variable is required');
    process.exit(1);
}

const adapter = createAdapter(
    { apiKey },
    {
        debug: (msg, ctx) => console.log(`[DEBUG] ${msg}`, ctx),
    },
);

async function main() {
    try {
        console.log('Testing createChatCompletion with DeepSeek...');
        const result = await adapter.createChatCompletion({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Hello! How are you?' },
            ],
        });

        console.log('Result:', JSON.stringify(result, null, 2));

        const resultPath = join(__dirname, 'create-chat-completion.result.json');
        await writeFile(resultPath, JSON.stringify(result, null, 2));
        console.log(`Saved result to ${resultPath}`);

        console.log('SUCCESS');
    } catch (error) {
        console.error('FAILED:', error);
        process.exit(1);
    }
}

main();
