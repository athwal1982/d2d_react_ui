import React from "react";
import "./Welcome.scss";

function Welcome() {
  return (
    <div className="Welcome_Div">
      Welcome to DOOR STEP DELIVERY
      <img src={`${process.env.PUBLIC_URL}welcome.png`} alt="Welcome" />
    </div>
  );
}
export default Welcome;
