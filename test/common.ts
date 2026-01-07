import * as dotenv from 'dotenv';
import { join } from 'node:path';

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, '../.env') });

/**
 * Get a required environment variable or throw an error.
 * @param key The environment variable key
 * @returns The environment variable value
 */
export function getRequiredVariable(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required for tests`);
    }
    return value;
}
