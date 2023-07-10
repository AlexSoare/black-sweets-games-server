import {
  CONNECTED_TO_ROOM,
  SET_ROOM_STATE,
  SHOW_ERROR,
  HIDE_ERROR,
} from "../types";

const initialState = {
  connected: false,
  roomCode: "",
  username: "",
  uid: "",
  gameState: {},
  showError: false,
  errorMessage: "",
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  let newState = { ...state };
  switch (type) {
    case CONNECTED_TO_ROOM:
      newState.connected = true;
      newState.roomCode = payload.roomCode;
      newState.uid = payload.uid;
      newState.username = payload.username;
      return newState;
    case SET_ROOM_STATE:
      newState.gameState = payload.state;
      return newState;
    case SHOW_ERROR:
      newState.showError = true;
      newState.errorMessage = payload.errorMessage;
      return newState;
    case HIDE_ERROR:
      newState.showError = false;
      return newState;
    default:
      return state;
  }
}
