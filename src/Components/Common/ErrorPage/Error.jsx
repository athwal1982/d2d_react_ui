import React from "react";
import "./Error.scss";
import { Link } from "react-router-dom";
import ErrorPage from "Framework/Assets/Images/ErrorPage.png";

function Error() {
  return (
    <div className="ErrorPage__Div">
      <img src={ErrorPage} alt="Error Page Images" />
      <div className="ErrorPage__ContentBox">
        <h2>Oops!</h2>
        <p>Something went wrong here.</p>
        <p>We&lsquo;re working on it and we&lsquo;ll get it fixed as soon as we can.</p>
        <Link className="ErrorPage__ContentBoxBtn" to="/">
          Back To Homepage
        </Link>
      </div>
    </div>
  );
}
export default Error;
