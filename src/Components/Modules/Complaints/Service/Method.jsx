import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoint";

export const getComplaintData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Complaint.GetComplaint);
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
