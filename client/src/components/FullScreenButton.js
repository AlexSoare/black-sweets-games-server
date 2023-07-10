import React, { Fragment, useState } from "react";

const FullScreenButton = () => {
  const test = () => {
    console.log("ASD");
  };
  return (
    <input type="submit" className="btn btn-primary" value="Login" />
    // <div id="fullscreen-button-div">
    //   <button id="fullscreen-button-img" onClick={test} />
    // </div>
  );
};

export default FullScreenButton;
