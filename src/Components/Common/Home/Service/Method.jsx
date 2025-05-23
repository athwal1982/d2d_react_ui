import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const getDashBoardData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Dashboard.GetDashBoard);
    if (result.responseCode === 1) {
      if (result.responseData) {
        return { response: result };
      }
      return { response: result };
    }
    return { response: result };
  } catch (error) {
    console.log(error);
    return {
      response: {
        responseCode: 0,
        responseData: null,
        responseMessage: error && error.response && error.response.data && error.response.data.message ? error.response.data.message : "Something went wrong",
      },
    };
  }
};

export const getDashBoardInsuranceCompData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Dashboard.GetDashBoardInsuranceComp);
    if (result.responseCode === 1) {
      if (result.responseData) {
        return { response: result };
      }
      return { response: result };
    }
    return { response: result };
  } catch (error) {
    console.log(error);
    return {
      response: {
        responseCode: 0,
        responseData: null,
        responseMessage: error && error.response && error.response.data && error.response.data.message ? error.response.data.message : "Something went wrong",
      },
    };
  }
};

export const getDashBoardReportData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Dashboard.GetDashBoardReport);
    if (result.responseCode === 1) {
      if (result.responseData) {
        return { response: result };
      }
      return { response: result };
    }
    return { response: result };
  } catch (error) {
    console.log(error);
    return {
      response: {
        responseCode: 0,
        responseData: null,
        responseMessage: error && error.response && error.response.data && error.response.data.message ? error.response.data.message : "Something went wrong",
      },
    };
  }
};
