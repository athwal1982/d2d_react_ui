import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./Endpoints";

export const addUserProfile = async (formData) => {
  debugger;
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.ProfileManagement.AddUserProfile);
    if (result.responseCode === 1) {
      if (result.responseData && result.responseData.length > 0) {
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
