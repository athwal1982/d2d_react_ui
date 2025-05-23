import React, { useEffect, useState, useRef } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { useNavigate } from "react-router-dom";
import Header from "Components/Layout/Header/Header";
import Sidebar from "Components/Layout/Sidebar/Sidebar";
import PropTypes from "prop-types";
import { SearchModal } from "Components/Layout/SearchModal";
import * as Sentry from "@sentry/react";
import Error from "Components/Common/ErrorPage/Error";
import { logout } from "Components/Common/Login/Services/Methods";
import BizClass from "./Page.module.scss";

function Page(props) {
  const { title, component } = props;
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const navigate = useNavigate();
  const userData = getSessionStorage("user");
  const setAlertMessage = AlertMessage();

  const keyDownHander = (e) => {
    if (e.ctrlKey && e.code === "KeyI") {
      e.preventDefault();
      setOpenSearchModal(true);
    }

    if (e.keyCode === 27) {
      e.preventDefault();
      setOpenSearchModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyDownHander, false);
  }, []);

  useEffect(() => {
    document.title = title ? `${title} | Door Step Delivery` : "Door Step Delivery";
  }, [title]);

  const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    const signout = async () => {
      // Perform logout actions (e.g., clear session, redirect to login page)
      console.log("User logged out due to inactivity");
      // Redirect to login page
      try {
        await logout(userData.LoginID ? userData.LoginID : 0, userData.SessionID ? userData.SessionID : 0);
        sessionStorage.clear();
        navigate("/");
      } catch (error) {
        console.log(error);
        setAlertMessage({
          type: "error",
          message: error,
        });
      }
    };

    const resetLogoutTimer = () => {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = setTimeout(signout, INACTIVITY_TIMEOUT);
    };

    const handleActivity = () => {
      resetLogoutTimer();
    };

    // A Event listeners for user activity
    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keypress", handleActivity);

    // A Start the logout timer when the component mounts
    resetLogoutTimer();

    // A Clean up event listeners and timers on component unmount
    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keypress", handleActivity);
      clearTimeout(logoutTimerRef.current);
    };
  }, []);

  return (
    <Sentry.ErrorBoundary fallback={<Error />}>
      {openSearchModal && <SearchModal setOpenSearchModal={setOpenSearchModal} />}
      <Header pagetitle={title} />
      <div className={BizClass.Dash}>
        <Sidebar />
        <div className={BizClass.Box}>{component}</div>
      </div>
    </Sentry.ErrorBoundary>
  );
}

export default Page;

Page.propTypes = {
  title: PropTypes.string.isRequired,
  component: PropTypes.node.isRequired,
};
