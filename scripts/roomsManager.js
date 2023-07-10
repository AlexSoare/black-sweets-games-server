const OpenRoom = require("./openRoom");
const WebSocket = require("ws");

module.exports = new (class RoomsManager {
  constructor() {
    this.currentRooms = [];
  }

  startWebSocketServer(server) {
    this.wss = new WebSocket.Server({ server });
    this.wss.on("connection", this.onWebSocketConnection);
  }

  onWebSocketConnection = (ws, req) => {
    var terminateConnection = (reason) => {
      var resObj = {
        msgType: "Error",
        msg: reason,
      };

      ws.close(1000, JSON.stringify(resObj));
      ws.terminate();
    };

    if (!req.url.includes("origin")) {
      terminateConnection("Origin not set");
      return;
    }

    if (!req.url.includes("roomCode")) {
      terminateConnection("Room code not sent");
      return;
    }

    var queryParams = req.url.split("?")[1].split("&");

    var connectionOrigin = queryParams[0].split("=")[1];
    var roomCode = queryParams[1].split("=")[1];

    if (connectionOrigin == "client") {
      var roomCode = queryParams[1].split("=")[1];

      var found = false;

      this.currentRooms.forEach((el) => {
        if (el.roomCode == roomCode) {
          el.setClientWebSocket(ws);
          found = true;
        }
      });

      if (!found) {
        var resObj = {
          msgType: "Error",
          msg: "Room not found",
        };

        ws.close(1000, JSON.stringify(resObj));
        ws.terminate();
      }
    } else if (connectionOrigin == "player") {
      if (!req.url.includes("uid")) {
        terminateConnection("Player WS uid not sent!");
        return;
      }
      var uid = queryParams[2].split("=")[1];

      var room = this.currentRooms.find((room) => room.roomCode == roomCode);
      if (room !== undefined) {
        var success = room.setPlayerWebSocket(ws, uid);
        if (!success) terminateConnection("Invalid token!");
      } else {
        terminateConnection("Room not found!");
      }
    } else {
      terminateConnection("Unknown origin!");
      return;
    }
  };

  openNewRoom(roomCode) {
    var alreadyOpened = false;
    this.currentRooms.forEach((el) => {
      if (el.roomCode == roomCode) {
        alreadyOpened = true;
      }
    });
    if (alreadyOpened) {
      return false;
      // ping room, connect to WS
    } else {
      var newRoom = new OpenRoom(roomCode);
      this.currentRooms.push(newRoom);
      return true;
    }
  }

  connectPlayer(roomCode, username, uid) {
    var room = this.currentRooms.find((room) => room.roomCode == roomCode);

    if (room !== undefined) {
      return room.playerConnected(username, uid);
    }

    return { success: false };
  }
})();
