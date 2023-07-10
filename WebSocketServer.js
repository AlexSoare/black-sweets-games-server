const WebSocket = require("ws");

// WebSockets with Express-ws https://fjolt.com/article/javascript-websockets

module.exports = class WebSocketServer {
  constructor(server) {
    this.StartWebSocketServer(server);

    this.wss = null;
  }

  StartWebSocketServer = (server) => {
    this.wss = new WebSocket.Server({ server });
    this.wss.on("connection", function connection(ws, req) {
      // req e ce a mai trimis client-ul cand si-a trimis conectiunea
      // ws e conectiunea catre client
      console.log(req.data);
      ws.send(200);
      ws.close();
    });
  };
};
