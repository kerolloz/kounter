import { MongoClient } from 'mongodb';
import Papr, { schema, types } from 'papr';
import type { TKeyCountPair } from './types';

const MONGO_URL =
  process.env.DATABASE_URL ??
  (() => {
    throw new Error('No DATABASE_URL found');
  })();

console.log('Connecting to MongoDB:', MONGO_URL);
const connection = await MongoClient.connect(MONGO_URL);
console.log('Connected to MongoDB');

const papr = new Papr();
papr.initialize(connection.db('kounter'));

const CountModel = papr.model(
  'counters',
  schema({
    key: types.string({ required: true }),
    count: types.number({ required: true }),
  }),
);

class CounterDatabase {
  async incrementCount(key: string): Promise<TKeyCountPair> {
    const value = await CountModel.upsert(
      { key },
      {
        $inc: { count: 1 },
        $setOnInsert: { key, count: 1 },
      },
      { returnDocument: 'after' },
    );
    return value;
  }

  async getCount(key: string): Promise<TKeyCountPair> {
    const value = await CountModel.findOne({ key });
    if (!value) {
      return { key, count: 0 };
    }
    return value;
  }
}

export const counterDb = new CounterDatabase();
