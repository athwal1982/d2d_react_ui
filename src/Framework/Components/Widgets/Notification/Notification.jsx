import React, { useEffect, useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";
import BizClass from "./Notification.module.scss";

function Notification({ id, type, title, message, dispatch }) {
  const [exit, setExit] = useState(false);
  const [width, setWidth] = useState(0);
  const [intervalID, setIntervalID] = useState(null);

  const handleStartTimer = () => {
    const intervalid = setInterval(() => {
      setWidth((prev) => {
        if (prev < 100) {
          return prev + 0.5;
        }
        clearInterval(id);
        return prev;
      });
    }, 20);

    setIntervalID(intervalid);
  };

  const handlePauseTimer = () => {
    clearInterval(intervalID);
  };

  const handleCloseNotification = () => {
    handlePauseTimer();
    setExit(true);
    setTimeout(() => {
      dispatch({
        type: "remove-notification",
        id,
      });
    }, 600);
  };

  useEffect(() => {
    if (width >= 100) {
      handleCloseNotification();
    }
  }, [width]);

  useEffect(() => {
    handleStartTimer();
  }, []);

  let ToastclassName = "";
  let Toastitle = "";
  switch (type) {
    case "error":
      ToastclassName = "Error";
      Toastitle = title || "";
      break;
    case "success":
      ToastclassName = "Success";
      Toastitle = title || "";
      break;
    case "warning":
      ToastclassName = "Warning";
      Toastitle = title || "";
      break;
    default:
      ToastclassName = "Primary";
      Toastitle = title || "";
      break;
  }

  return (
    <div
      onMouseEnter={() => handlePauseTimer()}
      onMouseLeave={() => handleStartTimer()}
      className={classNames(BizClass.Toast, BizClass[ToastclassName], exit && BizClass.exit)}
    >
      <div className={BizClass.ToastBox}>
        <div className={BizClass.ToastTitle}>
          <p>
            {message} {Toastitle}
          </p>
        </div>
        <button type="button" onClick={() => handleCloseNotification()}>
          <IoClose />
        </button>
      </div>
      <div className={BizClass.ToastBar} style={{ width: `${width}%` }} />
    </div>
  );
}

export default Notification;

Notification.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};
