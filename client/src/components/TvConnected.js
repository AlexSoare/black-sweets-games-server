import React, {
  Fragment,
  useState,
  useRef,
  createRef,
  useCallback,
  useEffect,
} from "react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ReactSketchCanvas } from "react-sketch-canvas";

import "../DrawfullStyle.css";

const styles = {
  border: "0.0625rem solid #9c9c9c",
  borderRadius: "0.25rem",
};

const TvConnected = ({ sendToWebSocket }) => {
  const roomState = useSelector((state) => state.roomState);
  const navigate = useNavigate();
  const onSendDrawing = useCallback(() => {
    sketchCanvas.current
      .exportImage("png")
      .then((data) => {
        var drawingBase64 = data.split(",")[1];
        sendToWebSocket("PlayerInputUpdate", { DrawingBase64: drawingBase64 });
      })
      .catch((e) => {
        console.log(e);
      });
  });

  const onSendTitle = useCallback(() => {
    if (titleInput.current.value !== "")
      sendToWebSocket("PlayerInputUpdate", { Title: titleInput.current.value });
  });
  const onSendChosenTitle = useCallback((title) => {
    sendToWebSocket("PlayerInputUpdate", { ChosenTitleUid: title.Uid });
  });
  const onStartButton = useCallback(async () => {
    sendToWebSocket("PlayerCustomMessage", "Start");
  });

  const sketchCanvas = createRef();
  const titleInput = createRef();

  useEffect(() => {
    const handleTitleInput = (event) => {
      titleInput.current.value = event.target.value.toUpperCase();
    };

    if (titleInput.current != null)
      titleInput.current.addEventListener("input", handleTitleInput);

    return () => {
      if (titleInput.current != null)
        titleInput.current.removeEventListener("input", handleTitleInput);
    };
  }, []);

  useEffect(() => {
    if (!roomState.connected) {
      navigate("/tv");
    }
  }, [roomState]);

  switch (roomState.gameState.State) {
    case "Lobby": {
      if (!roomState.gameState.Ready) {
        return (
          <div className="drawfull-sketchContainer">
            <p className="drawfull-text">Deseneaza-ti avatarul</p>
            <p className="drawfull-text">{roomState.gameState.toDraw}</p>
            <ReactSketchCanvas
              ref={sketchCanvas}
              className="sketch-content"
              style={styles}
              width="330px"
              height="450px"
              strokeWidth={4}
              strokeColor="red"
            />
            <div className="spacer"></div>
            <div className="spacer"></div>
            <button className="drawfull-sendBtn" onClick={onSendDrawing}>
              Trimite
            </button>
          </div>
        );
      } else
        return (
          <div className="drawfull-textContainer">
            <p className="drawfull-text">Asteptam pornirea jocului</p>
            <p></p>
            <button className="enterRoom-sendBtn" onClick={onStartButton}>
              Start
            </button>
          </div>
        );
    }
    case "WaitingForDrawings": {
      if (!roomState.gameState.Ready) {
        return (
          <div className="drawfull-sketchContainer">
            <p className="drawfull-text">Trebuie sa desenezi</p>
            <p className="drawfull-text">
              {roomState.gameState.TitleToDraw.TitleText}
            </p>
            <ReactSketchCanvas
              ref={sketchCanvas}
              className="sketch-content"
              style={styles}
              width="330px"
              height="450px"
              strokeWidth={4}
              strokeColor="red"
            />
            <div className="spacer"></div>
            <div className="spacer"></div>
            <button className="drawfull-sendBtn" onClick={onSendDrawing}>
              Trimite
            </button>
          </div>
        );
      } else {
        return (
          <div className="drawfull-textContainer">
            <p className="drawfull-text">Asteptam ceilalti jucatori...</p>
          </div>
        );
      }
    }
    case "ShowingDrawings": {
      if (roomState.gameState.OwnDrawingShown) {
        return (
          <div className="drawfull-textContainer">
            <p className="drawfull-text">Desenul tau...</p>
          </div>
        );
      }

      if (!roomState.gameState.Ready) {
        return (
          <div className="drawfull-textContainer">
            <p className="drawfull-text">Ce reprezinta acest desen?</p>
            <input className="enterRoom-input" ref={titleInput}></input>
            <button className="drawfull-sendBtn" onClick={onSendTitle}>
              Trimite
            </button>
          </div>
        );
      } else {
        return (
          <div className="drawfull-textContainer">
            <p className="drawfull-text">Asteptam ceilalti jucatori...</p>
          </div>
        );
      }
    }
    case "ShowingTitles": {
      if (roomState.gameState.OwnDrawingShown) {
        return (
          <div className="drawfull-textContainer">
            <p className="drawfull-text">Desenul tau...</p>
          </div>
        );
      } else {
        if (roomState.gameState.Ready) {
          return (
            <div className="drawfull-textContainer">
              <p className="drawfull-text">Asteptam ceilalti jucatori...</p>
            </div>
          );
        } else {
          return (
            <div className="drawfull-textContainer">
              {roomState.gameState.TitlesToChooseFrom.map((t) => (
                <>
                  <button
                    className="drawfull-sendBtn"
                    onClick={() => {
                      onSendChosenTitle(t);
                    }}
                  >
                    {t.TitleText}
                  </button>
                  <div className="spacer"></div>
                </>
              ))}
            </div>
          );
        }
      }
    }
    case "ShowingRoundScore": {
      return (
        <div className="drawfull-textContainer">
          <p className="drawfull-text">Afisare score</p>
        </div>
      );
    }
    default:
      return (
        <div className="drawfull-textContainer">
          <p className="drawfull-text">{roomState.gameState.State}</p>
        </div>
      );
  }
};

export default TvConnected;
