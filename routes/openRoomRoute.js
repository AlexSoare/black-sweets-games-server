const express = require("express");
const router = express.Router();
const RoomsManager = require("../scripts/roomsManager");

class OpenRoomResponse {
  constructor(success) {
    this.success = success;
  }
}

class OpenRoomRequest {
  constructor(obj) {
    this.roomCode = obj.roomCode;
  }
}

router.post("/", async (req, res) => {
  var reqObj = new OpenRoomRequest(req.body);

  var success = RoomsManager.openNewRoom(reqObj.roomCode);

  var resObj = new OpenRoomResponse(success);

  res.json(resObj);
});

module.exports = router;
