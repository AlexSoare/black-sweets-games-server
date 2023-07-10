import axios from "axios";
import {
  CONNECTED_TO_ROOM,
  HIDE_ERROR,
  SHOW_ERROR,
  SET_ROOM_STATE,
} from "../types";

export const setRoomState = (state) => ({
  type: SET_ROOM_STATE,
  payload: { state },
});

export const setConnectedToRoom = (roomCode, uid, username) => ({
  type: CONNECTED_TO_ROOM,
  payload: { roomCode, uid, username },
});

export const showError = (errorMessage) => ({
  type: SHOW_ERROR,
  payload: { errorMessage },
});

export const hideError = () => ({
  type: HIDE_ERROR,
});
