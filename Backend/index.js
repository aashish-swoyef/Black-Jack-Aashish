const express = require("express");
const cors = require("cors");
const path = require("path");
const channelRoutes = require("./Routes/channelRoutes");

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors());
app.use(express.json());


// Serve static files from Frontend folder
app.use(express.static(path.join(__dirname, "../Frontend")));

// Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

// API routes
app.use("/api", channelRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
