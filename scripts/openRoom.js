const { runInThisContext } = require("vm");

module.exports = class OpenRoom {
  PlayerWebSocket = class {
    constructor(ws, uid, wsCallback) {
      this.ws = ws;
      this.uid = uid;
      this.wsCallback = wsCallback;

      this.ws.on("message", this.onWsMessage.bind(this));
    }

    send = (msg) => {
      this.ws.send(msg);
    };

    onWsMessage = (msg) => {
      this.wsCallback(this.uid, msg);
    };
  };

  Player = class {
    constructor(uid, username) {
      this.uid = uid;
      this.username = username;

      this.gameState = {}; // Decided by each game in client, handled by redux on /TV
      this.webSocket = null; // PlayerWebSocket
    }

    setWebSocket = (ws) => {
      this.webSocket = ws;
    };
  };

  constructor(roomCode) {
    this.roomCode = roomCode;

    this.clientWebSocket = null;
    this.players = [];
    this.currentState = {};
    this.gameStarted = false;
  }

  setClientWebSocket(ws) {
    this.clientWebSocket = ws;
    this.clientWebSocket.on("message", this.onClientMessage.bind(this));
  }

  setPlayerWebSocket(ws, uid) {
    var player = this.players.find((player) => player.uid == uid);
    let reconnected = false;
    if (player !== undefined) {
      reconnected = player.webSocket !== null;

      player.webSocket = new this.PlayerWebSocket(
        ws,
        player.uid,
        this.onPlayerMessage.bind(this)
      );

      this.sendMsgToClient("PlayerConnected", {
        Name: player.username,
        Uid: player.uid,
        Reconnected: reconnected,
      });

      return true;
    }
    return false;
  }

  playerConnected(username, uid) {
    var playerByUid = this.players.find((p) => p.uid == uid);

    if (playerByUid === undefined) {
      if (this.gameStarted)
        return { success: false, gameStarted: true, username };
      this.players.push(new this.Player(uid, username));
    } else {
      username = playerByUid.username;
    }

    return { success: true, username };
  }

  onClientMessage(msg) {
    var msgObj = JSON.parse(msg.toString());

    // type = enum
    // roomState = {}
    // playersState = [{uid,state}]

    if (msgObj.Type == null) return;

    switch (msgObj.Type) {
      case "GameStarted": {
        this.gameStarted = true;
      }
      case "RoomStateUpdate": {
        if (msgObj.RoomState != null) {
          this.currentState = msgObj.RoomState;
        }
        if (msgObj.PlayersState != null) {
          msgObj.PlayersState.forEach((p) => {
            this.sendMsgToPlayer(p.Uid, "RoomStateUpdate", p.State);
          });
        }
      }
    }
  }

  onPlayerMessage(uid, msg) {
    msg = JSON.parse(msg.toString());
    if (msg.Type == null) {
      return;
    }
    if (msg.InputData == null) {
      return;
    }
    switch (msg.Type) {
      case "PlayerInputUpdate": {
        let msgToSendToClient = {
          Uid: uid,
          ...msg.InputData,
        };

        this.sendMsgToClient("PlayerInputUpdate", msgToSendToClient);
      }
      case "PlayerCustomMessage": {
        let msgToSendToClient = {
          Uid: uid,
          Msg: msg.InputData,
        };

        this.sendMsgToClient("PlayerCustomMessage", msgToSendToClient);
      }
    }
  }

  sendMsgToClient(msgType, msg) {
    var wsMsg = {
      msgType,
      msg: JSON.stringify(msg),
    };
    this.clientWebSocket.send(JSON.stringify(wsMsg));
  }

  sendMsgToPlayer(uid, msgType, msg) {
    var player = this.players.find((p) => p.uid == uid);
    if (player !== undefined) {
      var wsMsg = {
        msgType,
        msg,
      };

      player.webSocket.send(JSON.stringify(wsMsg));
    }
  }
};
