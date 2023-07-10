const express = require("express");
const router = express.Router();
const RoomsManager = require("../scripts/roomsManager");

class EnterRoomResponse {
  constructor(success, username, uid, gameStarted) {
    this.success = success;
    this.username = username;
    this.uid = uid;
    this.gameStarted = gameStarted;
  }
}

class EnterRoomRequest {
  constructor(obj) {
    this.roomCode = obj.roomCode;
    this.uid = obj.uid != null ? obj.uid : "";
    this.username = obj.username;
  }
}

router.post("/", async (req, res) => {
  var reqObj = new EnterRoomRequest(req.body);

  if (reqObj.uid === "")
    reqObj.uid =
      Date.now().toString(36) + Math.random().toString(36).substring(2);

  var connected = RoomsManager.connectPlayer(
    reqObj.roomCode,
    reqObj.username,
    reqObj.uid
  );

  var resObj = new EnterRoomResponse(
    connected.success,
    connected.username,
    reqObj.uid,
    connected.gameStarted
  );

  res.json(resObj);
});

module.exports = router;
