import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const getMenuListData = async (userName) => {
  try {
    const requestData = {
      main: {
        accessID: userName ? userName.AppAccessID : 0,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.MenuToUser.GetMenuList);
    return result;
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};

export const assignUnAssignMenuList = async (data, status, userName) => {
  try {
    const requestData = {
      main: {
        userMenuAssignID: status === "ASSIGN" ? 0 : data.UserMenuAssignID ? data.UserMenuAssignID : 0,
        menuMasterID: data.MenuMasterID ? data.MenuMasterID : 0,
        accessID: userName ? userName.AppAccessID : 0,
        action: status,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.MenuToUser.AssignUnAssignMenu);
    return result;
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};
