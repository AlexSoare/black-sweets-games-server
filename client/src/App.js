import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { setRoomState } from "./redux/actions/roomStateActions";

import Tv from "./components/Tv";
import Game from "./components/Game";
import TVConnected from "./components/TvConnected";
import PlayerName from "./components/PlayerName";

import "./App.css";

import { useDispatch } from "react-redux";

const App = () => {
  var webSocket = null;
  const dispatch = useDispatch();

  const startWebSocket = (roomCode, uid) => {
    let socketURL = "wss://" + window.location.hostname;

    if (
      window.location.hostname.includes("localhost") ||
      window.location.hostname.includes("192")
    ) {
      socketURL = "ws://" + window.location.hostname + ":5000";
    }

    socketURL += `?origin=player&roomCode=${roomCode}&uid=${uid}`;

    webSocket = new W3CWebSocket(socketURL);
    webSocket.onopen = () => {
      console.log("WS Opened");
    };
    webSocket.onmessage = (msg) => {
      console.log("WS Msg:", msg.data);

      var msgObj = JSON.parse(msg.data);

      if (msgObj.msgType === "RoomStateUpdate") {
        dispatch(setRoomState(msgObj.msg));
      }
    };
    webSocket.onclose = (msg) => {
      console.log("WS Close:", msg.reason);
    };
    //webSocket.close();
  };
  const sendToWebSocket = (type, msg) => {
    var toSend = {
      Type: type,
      InputData: msg,
    };
    webSocket.send(JSON.stringify(toSend));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route
          path="/tv"
          element={
            <div className="empty-absolute">
              <Tv startWebSocket={startWebSocket} />
            </div>
          }
        />
        <Route
          path="/tvConnected"
          element={
            <div className="empty-absolute">
              <TVConnected sendToWebSocket={sendToWebSocket} />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
