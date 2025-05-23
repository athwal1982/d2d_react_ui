import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const ResetPassword = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.UserManagement.ResetPassword);
    return result;
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};
