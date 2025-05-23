import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoint";

export const getConsolidateReportDataList = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Report.GetConsolidateReport);
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

export const getDetailReportDataList = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Report.GetDetailReport);
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

export const getAppointmentHistoryDataList = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Report.GetAppointmentHistory);
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

export const getAdditionalReportDataList = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Report.GetAdditionalReport);
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

export const getAgeingDashBoardReportData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Report.GetAgeingDashBoardReport);
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

export const getComplaintMasterData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Report.GetComplaintMaster);
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

export const getCitizenAppointmentReportData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Report.GetCitizenAppointmentReport);
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

export const getSubDistrictServiceData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Report.GetSubDistrictService);
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
