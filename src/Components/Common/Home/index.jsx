import React from "react";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import Home from "./Views/Home";
import InsuranceCompHome from "./Views/InsuranceCompHome";

function HomePage() {
  const user = getSessionStorage("user");
  const ChBRHeadTypeID = user && user.BRHeadTypeID ? user.BRHeadTypeID.toString() : "0";

  return (
    <>
      {/* {ChBRHeadTypeID.toString() === "124001" || ChBRHeadTypeID.toString() === "124002" ? <Home /> : null} */}
      {ChBRHeadTypeID.toString() === "124003" ? <InsuranceCompHome /> : <Home />}
    </>
  );
}

export default HomePage;
