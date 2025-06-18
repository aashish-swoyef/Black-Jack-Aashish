const { v4: uuidv4 } = require("uuid");
const redisClient = require("../Utils/redisClient");

// Create a new channel
function createChannel() {
  const channelId = uuidv4();
  const channelData = {
    id: channelId,
    players: [],
    gameState: null,
  };
  redisClient.set(channelId, JSON.stringify(channelData));
  console.log("Channel created with ID:", channelId);
  return channelId;
}

// Get the number of players in a channel
async function getPlayerCount(channelId) {
  const data = await redisClient.get(channelId);
  if (!data) return 0;

  const parsed = JSON.parse(data);
  return parsed.players.length;
}

// Check if a player exists in the channel
async function playerExists(channelId, playerId) {
  const data = await redisClient.get(channelId);
  if (!data) return false;

  const parsed = JSON.parse(data);
  return parsed.players.some(p => p.id === playerId);
}

// Add a player to a channel
async function addPlayerToChannel(channelId, playerId) {
  const data = await redisClient.get(channelId);
  if (!data) return false;

  const parsed = JSON.parse(data);
  const exists = await playerExists(channelId, playerId);
  if (exists) return false;

  parsed.players.push({ id: playerId });
  await redisClient.set(channelId, JSON.stringify(parsed));
  console.log(`Player ${playerId} added to channel ${channelId}`);
  return true;
}

// Find the channel the player is already in
async function findUserChannel(userId) {
  const keys = await redisClient.keys("*");

  for (let key of keys) {
    const data = await redisClient.get(key);
    const parsed = JSON.parse(data);
    if (parsed.players.some(p => p.id === userId)) {
      return key;
    }
  }

  return null;
}

// Find a channel with available space
async function findAvailableChannel() {
  const keys = await redisClient.keys("*");

  for (let key of keys) {
    const data = await redisClient.get(key);
    const parsed = JSON.parse(data);
    if (parsed.players.length < 4) {
      return key;
    }
  }

  return null;
}

// Matchmaking handler
async function handleMatchmaking(userId) {
  const existingChannelId = await findUserChannel(userId);
  if (existingChannelId) return existingChannelId;

  const openChannelId = await findAvailableChannel();
  if (openChannelId) {
    await addPlayerToChannel(openChannelId, userId);
    return openChannelId;
  }

  const newChannelId = createChannel();
  await addPlayerToChannel(newChannelId, userId);
  return newChannelId;
}

// API controller function
async function createsChannel(req, res) {
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const channelId = await handleMatchmaking(userId);
    const data = await redisClient.get(channelId);

    res.json({
      channelId: channelId,
      data: JSON.parse(data),
    });
  } catch (err) {
    console.error("Error in matchmaking:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { createsChannel };
