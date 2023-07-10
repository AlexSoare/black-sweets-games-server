const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const http = require("http");
const connectDB = require("./DB/connection");
const RoomCode = require("./DB/Models/RoomCode");
const RoomsManager = require("./scripts/roomsManager");

// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
// https://www.mongodb.com/developer/products/atlas/use-atlas-on-heroku/

// starting WebSocket Server : updateOnlineProfiles.StartWebSocketServer (in server)
// connectiong from client to WSS : profileWebSocket (in client)

// React + Unity WebGL : https://www.npmjs.com/package/react-native-unity-webgl

// Draw plugins : https://ourcodeworld.com/articles/read/117/top-5-best-sketchpads-and-manually-drawing-on-canvas-javascript-and-jquery-plugins

// See actual git files : heroku run bash + ls (list files)

//connectDB(onDBConnected);

var app = express();

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

RoomsManager.startWebSocketServer(httpServer);

app.use(express.json());
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/openRoom", require("./routes/openRoomRoute"));
app.use("/enterRoom", require("./routes/enterRoomRoute"));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

function onDBConnected(connected) {
  if (!connected) return;
}

var roomCode = null;
async function getRoomCode(code) {
  let roomCode = await RoomCode.findOne({ code: code });
  console.log(roomCode.createdAt);
}
function createRoomCode(code) {
  RoomCode.create({ code: "FIRST_ROOM_CODE" }, (err, roomCodeInstance) => {
    if (err) {
      console.log("Save to DB failed:", err);
      return;
    }
    roomCode = roomCodeInstance;
  });
}
