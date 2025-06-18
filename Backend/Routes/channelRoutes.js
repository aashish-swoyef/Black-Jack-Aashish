const express = require("express");
const router = express.Router();
const channelController = require("../controller/channelController");

router.post("/create-channel", channelController.createsChannel);

module.exports = router;
