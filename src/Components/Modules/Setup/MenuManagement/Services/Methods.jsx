import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./Endpoints";

export const getMenuListData = async () => {
  try {
    const requestData = {
      main: {
        menuMasterID: "0",
        viewMode: "MENUMASTER",
        moduleCode: "0",
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.MenuManagement.GetMenuList);
    return result;
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};

export const getUserRightData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.MenuManagement.GetUserRight);
    if (result.responseCode === 1) {
      if (result.responseData) {
        return { response: result };
      }
      return { response: result };
    }
    return { response: result };
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
