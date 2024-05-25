import { Deta } from 'deta';
import type { TKeyCountPair } from './types';

class CounterDatabase {
  private deta;
  private db;

  constructor(projectKey: string, databaseName: string) {
    this.deta = Deta(projectKey);
    this.db = this.deta.Base(databaseName);
  }

  private validateValue(value: Record<string, unknown>): value is TKeyCountPair {
    return (
      typeof value === 'object' &&
      typeof value.key === 'string' &&
      typeof value.count === 'number'
    );
  }

  async incrementCount(key: string): Promise<TKeyCountPair> {
    const value = await this.getCount(key);
    ++value.count;
    await this.db.put(value);
    return value;
  }

  async getCount(key: string): Promise<TKeyCountPair> {
    const value = (await this.db.get(key)) ?? { key, count: 0 };
    if (!this.validateValue(value)) {
      throw new Error('Corrupted key!');
    }
    return value;
  }
}

export const counterDb = new CounterDatabase(
  process.env.DETA_PROJECT_KEY ?? '',
  'counters-db',
);
