const { createClient } = require("redis");

const redisClient = createClient();

redisClient.connect()
  .then(() => console.log("✅ Redis connected"))
  .catch(console.error);

module.exports = redisClient;
