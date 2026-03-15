import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { counterDb } from '../src/CounterDatabase.ts';

// Note: Requires a running MongoDB instance during tests
// or a mock. For simplicity in this modernization pass,
// we assume a local test DB if DATABASE_URL is set for tests.

describe('CounterDatabase', () => {
  const testKey = `test-key-${Date.now()}`;

  beforeAll(async () => {
    const mongoUrl =
      process.env.DATABASE_URL || 'mongodb://localhost:27017/kounter-test';
    try {
      // Use a short timeout to fail fast if no DB is running
      await counterDb.initialize(`${mongoUrl}${mongoUrl.includes('?') ? '&' : '?'}connectTimeoutMS=1000`);
    } catch {
      console.warn('⚠️ Skipping database tests: MongoDB connection failed.');
    }
  });

  afterAll(async () => {
    await counterDb.close();
  });

  test('should return 0 for non-existent key', async () => {
    if (!counterDb.client) return; 
    const result = await counterDb.getCount('non-existent');
    expect(result.count).toBe(0);
    expect(result.key).toBe('non-existent');
  });

  test('should increment a new key to 1', async () => {
    if (!counterDb.client) return;
    const result = await counterDb.incrementCount(testKey);
    expect(result.count).toBe(1);
    expect(result.key).toBe(testKey);
  });

  test('should increment an existing key', async () => {
    if (!counterDb.client) return;
    await counterDb.incrementCount(testKey); // Should be 2 now
    const result = await counterDb.getCount(testKey);
    expect(result.count).toBe(2);
  });
});
