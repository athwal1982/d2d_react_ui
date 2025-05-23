import React from "react";
import { checkAuthExist, getSessionStorage } from "Components/Common/Login/Auth/auth";
import { Navigate } from "react-router-dom";

function PageAuthenticator() {
  debugger;
  const pathUrl = window.location.href;
  const servicesuccessData = getSessionStorage("servicesuccess");
  if (checkAuthExist()) {
    if (pathUrl.indexOf("userName") !== -1 && pathUrl.indexOf("mobileNumber") !== -1) {
      if (servicesuccessData === "CA" || servicesuccessData === "CC") {
        return <Navigate to="/ServiceSuccess" />;
      }
      return <Navigate to="/login" />;
    }
    return <Navigate to="/home" />;
  }

  return <Navigate to="/login" />;
}

export default PageAuthenticator;
