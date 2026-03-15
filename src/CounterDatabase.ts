import { MongoClient } from 'mongodb';
import Papr, { schema, types } from 'papr';
import type { KeyCountPair } from './types.ts';

const baseSchema = schema({
  key: types.string({ required: true }),
  count: types.number({ required: true }),
});

type BaseSchema = (typeof baseSchema)[0];

export class CounterDatabase {
  private papr: Papr;
  public client: MongoClient | null = null;
  private countModel: ReturnType<
    typeof Papr.prototype.model<BaseSchema, (typeof baseSchema)[1]>
  >;

  constructor() {
    this.papr = new Papr();
    this.countModel = this.papr.model('counters', baseSchema);
  }

  async initialize(url: string): Promise<void> {
    if (this.client) return;

    this.client = await MongoClient.connect(url);
    this.papr.initialize(this.client.db());
    await this.papr.updateSchemas();
  }

  async incrementCount(key: string): Promise<KeyCountPair> {
    const doc = await this.countModel.upsert(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { key } },
      { returnDocument: 'after' },
    );
    return { key: doc.key, count: doc.count };
  }

  async getCount(key: string): Promise<KeyCountPair> {
    const result = await this.countModel.findOne({ key });
    if (!result) return { key, count: 0 };
    return { key: result.key, count: result.count };
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }
}

export const counterDb = new CounterDatabase();
