import React, {
  Fragment,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { setConnectedToRoom } from "../redux/actions/roomStateActions";
import { showError } from "../redux/actions/roomStateActions";
import { hideError } from "../redux/actions/roomStateActions";

import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

const Tv = ({ startWebSocket }) => {
  const connectedToRoom = useSelector((state) => state.roomState.connected);
  const errorToShow = useSelector((state) => state.roomState.showError);
  const errorMessage = useSelector((state) => state.roomState.errorMessage);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roomCodeInput = useRef(null);
  const playerNameInput = useRef(null);

  useEffect(() => {
    const handleNameInput = (event) => {
      playerNameInput.current.value = event.target.value.toUpperCase();
    };
    const handleRoomCodeInput = (event) => {
      roomCodeInput.current.value = event.target.value.toUpperCase();
    };

    playerNameInput.current.addEventListener("input", handleNameInput);
    roomCodeInput.current.addEventListener("input", handleRoomCodeInput);

    return () => {
      if(playerNameInput.current !== null && roomCodeInput.current !== null)
      {
        playerNameInput.current.removeEventListener("input", handleNameInput);
        roomCodeInput.current.removeEventListener("input", handleRoomCodeInput);
      }
    };
  }, []);

  useEffect(() => {
    if (connectedToRoom) {
      navigate("/tvConnected");
    }
  }, [connectedToRoom]);

  var username = localStorage.getItem("username");
  username = username == null ? "" : username;

  var roomCode = localStorage.getItem("roomCode");
  roomCode = roomCode == null ? "" : roomCode;

  var uid = localStorage.getItem("uid");
  uid = uid == null ? "" : uid;

  useEffect(() => {
    if (playerNameInput.current !== null && roomCodeInput.current !== null) {
      playerNameInput.current.value = username;
      roomCodeInput.current.value = roomCode;
    }
  });

  var autoEnter = false;

  const onPlayButton = async () => {
    if (!autoEnter) {
      if (
        roomCodeInput.current.value === "" ||
        playerNameInput.current.value === ""
      )
        return;

      username = playerNameInput.current.value;
      roomCode = roomCodeInput.current.value;
    }

    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    var body = JSON.stringify({
      roomCode,
      username,
      uid,
    });

    var res = await axios.post("/enterRoom", body, config);

    if (res.data.success) {
      localStorage.setItem("uid", res.data.uid);
      localStorage.setItem("roomCode", roomCode);
      localStorage.setItem("username", res.data.username);

      startWebSocket(roomCode, res.data.uid);

      dispatch(setConnectedToRoom(roomCode, res.data.uid, res.data.username));
    } else if (!autoEnter) {
      if (res.data.gameStarted) {
        dispatch(showError("Jocul a inceput deja!"));
      } else {
        dispatch(showError("Camera nu exista!"));
      }
    }

    autoEnter = false;
  };

  useEffect(() => {
    if (errorToShow) {
      setTimeout(() => {
        dispatch(hideError());
      }, 1500);
    }
  }, [errorToShow]);

  if (username !== "" && roomCode !== "" && uid !== "") {
    autoEnter = true;
    onPlayButton();
  }

  if (errorToShow) {
    return (
      <div className="enterRoom-container">
        <p className="enterRoom-text">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="enterRoom-container">
      <p className="enterRoom-text">COD CAMERA</p>
      <input className="enterRoom-input" ref={roomCodeInput}></input>
      <div className="spacer"></div>
      <div className="spacer"></div>
      <p className="enterRoom-text">NUME</p>
      <input className="enterRoom-input" ref={playerNameInput}></input>
      <div className="spacer"></div>
      <div className="spacer"></div>
      <div className="spacer"></div>
      <div className="spacer"></div>
      <button className="enterRoom-sendBtn" onClick={() => onPlayButton()}>
        INTRA
      </button>
    </div>
  );
};

export default Tv;
