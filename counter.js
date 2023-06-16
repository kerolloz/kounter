const { Deta } = require("deta");
const deta = Deta(process.env.DETA_PROJECT_KEY);

const db = deta.Base("counters-db");

async function incrementCounter(key) {
  const counter = await getCounter(key);
  counter.count++;
  return db.put(counter);
}

const getCounter = async (key) => (await db.get(key)) || { key, count: 0 };

module.exports = {
  getCounter,
  incrementCounter,
};
