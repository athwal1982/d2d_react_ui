import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "../../../../Services/Endpoints";

export const getBrHeadTypeData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.UserManagement.BrHeadType);
    if (result.responseCode === 1) {
      if (result.responseData && result.responseData.masterdatabinding) {
        return { response: result.responseData.masterdatabinding };
      }
      return { response: [] };
    }
    return { response: [] };
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};

export const addNewUser = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.UserManagement.AddNewUser);
    console.log(result);
    return { response: result };
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};

export const getReferenceTypeData = async (formData) => {
  debugger;
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.UserManagement.BrHeadType);
    return result;
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};

export const getMasterDataBinding = async (formData) => {
  debugger;
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.UserManagement.GetMasterDataBindingList);
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
export const GetUserInsCompAssignManage = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.UserManagement.GetUserInsuranceAssignManage);
    return result;
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};
