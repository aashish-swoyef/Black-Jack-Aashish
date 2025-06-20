const redisClient = require("./Utils/redisClient"); // adjust path if needed

module.exports = function registerSocketEvents(io) {
  io.on("connection", (socket) => {
    console.log(`📡 User connected: ${socket.id}`);

    socket.on("join-channel", async ({ channelId, userId }) => {
      try {
        if (!channelId || !userId) {
          socket.emit("error", { message: "❌ Missing channelId or userId." });
          return;
        }

        const channelDataRaw = await redisClient.get(channelId);

        // ❌ Channel doesn't exist
        if (!channelDataRaw) {
          socket.emit("error", { message: `❌ Channel "${channelId}" does not exist.` });
          return;
        }

        const channelData = JSON.parse(channelDataRaw);

        const isAuthorized = channelData.players.some(p => p.id === userId);

        // ❌ User is not in the channel
        if (!isAuthorized) {
          socket.emit("error", { message: "❌ You are not a member of this channel." });
          return;
        }

        // ✅ Join the channel
        socket.join(channelId);
        console.log(`✅ ${userId} joined channel ${channelId}`);

        // Notify other users in the channel
        io.to(channelId).emit("user-joined", {
          userId,
          message: `👤 User ${userId} joined channel.`,
        });

        // Send welcome message
        socket.emit("private-message", {
          to: userId,
          message: `✅ Welcome to Blackjack channel ${channelId}!`,
        });

        // Send full channel data (optional)
        socket.emit("channelInfo", {
          channelId,
          data: channelData
        });

      } catch (err) {
        console.error("join-channel error:", err);
        socket.emit("error", { message: "❌ Internal server error." });
      }
    });

    // Optional: handle private messages
    socket.on("private-message", ({ to, message }) => {
      io.to(to).emit("private-message", { message });
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
