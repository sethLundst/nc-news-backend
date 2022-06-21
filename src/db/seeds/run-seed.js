const devData = require("../data/development-data/index.js");
const db = require("../connection.js");
const seed = require("./seed.js");

const runSeed = async () => {
  await seed(devData);
  return db.end();
};

runSeed();
