import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const getRightsListData = async () => {
  try {
    const requestData = {
      main: {
        viewMode: "ALL",
        rightMasterID: "0",
        moduleID: "0",
        menuMasterID: "0",
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.AccessRights.GetRights);
    return result;
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};

export const manageUserRightAssign = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.AccessRights.ManageUserRightAssign);
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
