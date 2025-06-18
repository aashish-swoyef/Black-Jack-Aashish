const { v4: uuidv4 } = require("uuid");
const redisClient = require("../Utils/redisClient"); // ✅ correct path

exports.createChannel = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "User ID required" });

  const channelId = `channel_${uuidv4()}`;
  const now = new Date().toISOString();

  const channelData = {
    playerCount: 1,
    players: [userId],
    phase: "waiting",
    createdAt: now,
    userId: userId,
  };

  try {
    await redisClient.set(channelId, JSON.stringify(channelData));
    res.status(201).json({ message: "Channel created", channelId, data: channelData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating channel" });
  }
};
