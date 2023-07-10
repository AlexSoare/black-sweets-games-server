import React, { Fragment, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import FullScreenButton from "./FullScreenButton";

const Game = () => {
  const { unityProvider } = useUnityContext({
    loaderUrl: "UnityBuild/Build/UnityBuild.loader.js",
    dataUrl: "UnityBuild/Build/UnityBuild.data.unityweb",
    frameworkUrl: "UnityBuild/Build/UnityBuild.framework.js.unityweb",
    codeUrl: "UnityBuild/Build/UnityBuild.wasm.unityweb",
  });

  return (
    <div className="game-container">
      <Unity unityProvider={unityProvider} className="game-content" />
      {/* <FullScreenButton /> */}
    </div>
  );
};

export default Game;
