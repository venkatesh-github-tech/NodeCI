const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");
const exec = mongoose.Query.prototype.exec;
const keys = require("../config/keys");

//const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "");
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  //console.log("I m about to execute the mongoDB query");
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );
  //console.log(key);

  //check whether the cache is readily available
  const cached = await client.hget(this.hashKey, key);

  //if cache content available then read from cache
  if (cached) {
    //console.log("Serving from Cache!!!");
    const doc = JSON.parse(cached);

    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);
  client.hset(this.hashKey, key, JSON.stringify(result), "EX", 10);
  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
