const { v4: uuidv4 } = require("uuid");
const redisClient = require("../Utils/redisClient"); // ✅ correct path
const { createSentinel } = require("redis");


//working function to create a channel

 function createChannel(){
  const channelId = uuidv4();
  console.log("Channel created with ID:", channelId);
  // sample json object with no data in it
  const channelData = {
    id: channelId,
    players: [],
    gameState: null,
  };

  redisClient.set(channelId, JSON.stringify(channelData));
  return channelId;
}


// check player count in channel
async function getPlayerCount(channelId) {
  const channelData =  await redisClient.get(channelId);

  console.log("Channel data:", channelData);

  // gt players
  console.log("Player data", JSON.parse(channelData).players);

  const parsedData = JSON.parse(channelData);

  console.log("Player count:", parsedData.players.length);

  // count players in channel
  return parsedData.players.length || 0; // return 0 if no players
}

// check if player exists in channel
async function playerExists(channelId, playerId) {
  const channelData = await redisClient.get(channelId);

  const parsedChannelData = JSON.parse(channelData);
  console.log("Parsed channel data:", parsedChannelData);

  // check the player array if that player exists
  const playerArray = parsedChannelData.players || [];
  console.log("Player array:", playerArray);

  // check in that array looping. if found instantly break the loop the playerid is of tyype string

  for (let i = 0; i < playerArray.length; i++) {
    console.log("Checking player:", playerArray[i].id);
    if (playerArray[i] === playerId) {
      console.log("Player exists in channel:", playerId);
      return true; // player exists
    }
  }

  console.log("Player does not exist in channel:", playerId);
  return false; // player does not exist
}

// put user in channel
function addPlayerToChannel(channelId, playerId) {
  // get channel data from redis
  const channelData = redisClient.get(channelId);
  // parse the channel data
  const parsedChannelData = JSON.parse(channelData);



  // check if player already exists
  if (playerExists(channelData, playerId)) {
    console.log("Player already exists in channel:", playerId);
    return false; // player already exists
  }

  // add player to channel
  parsedChannelData.playerArray.push(playerId);
  redisClient.set(channelId, JSON.stringify(parsedChannelData));
  console.log("Player added to channel:", playerId);
  return true; // player added successfully
}

// request response for matchmaking with handled already exists, max player of 4 and creating channel if not channel found for the user to fit in
async function handleMatchmaking(userId) {
  // Check if user is already in a channel
  const existingChannelId = await findUserChannel(userId);
  if (existingChannelId) {
    console.log("User is already in channel:", existingChannelId);
    return existingChannelId;
  }

  // Find a channel with available slots
  const availableChannelId = await findAvailableChannel();
  if (availableChannelId) {
    console.log("Found available channel:", availableChannelId);
    addPlayerToChannel(availableChannelId, userId);
    return availableChannelId;
  }

  // Create a new channel if none found
  const newChannelId = createChannel();
  addPlayerToChannel(newChannelId, userId);
  return newChannelId;
}
    

function createsChannel(req, res){
    //access request
    const userId = req.body.userId;

    console.log("userid ", userId);

    // check if already in channel
    function  channelId =checkIfAlreadyinChannel(userId);
    
    // const channelId = createChannel();
    const respObject = {
      "channelId": channelId
    };
    res.send(JSON.stringify(respObject));
} 

module.exports = {createsChannel};