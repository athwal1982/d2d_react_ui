import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const GetUserStateAssignManage = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.UserManagement.GetUserStateAssignManage);
    return result;
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};
