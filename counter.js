const { Deta } = require("deta");
const deta = Deta();

const db = deta.Base("counters-db");

async function incrementCounter(key) {
  const counter = (await getCounter(key)) || { key, count: 0 };
  counter.count++;
  return db.put(counter);
}

const getCounter = (key) => db.get(key);

module.exports = {
  getCounter,
  incrementCounter,
};
