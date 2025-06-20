// Utils/redisClient.js
const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://localhost:6379" // Adjust your Redis URL here if needed
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

module.exports = redisClient;
