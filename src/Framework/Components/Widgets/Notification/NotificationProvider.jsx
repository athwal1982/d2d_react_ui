import React, { createContext, useContext, useReducer } from "react";
import { v4 } from "uuid";
import PropTypes from "prop-types";
import Notification from "./Notification";
import BizClass from "./Notification.module.scss";

const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const [dataState, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "add-notification":
        return [...state, { ...action.payload }];
      case "remove-notification":
        return state.filter((el) => el.id !== action.id);
      default:
        return state;
    }
  }, []);

  return (
    <NotificationContext.Provider value={dispatch}>
      <div className={BizClass.wrapper}>
        {dataState.map((note) => {
          return <Notification dispatch={dispatch} key={note.id} {...note} />;
        })}
      </div>
      {children}
    </NotificationContext.Provider>
  );
}

NotificationProvider.propTypes = {
  children: PropTypes.node,
};

export default NotificationProvider;

export const AlertMessage = () => {
  const dispatch = useContext(NotificationContext);

  return (props) => {
    dispatch({
      type: "add-notification",
      payload: {
        id: v4(),
        ...props,
      },
    });
  };
};
