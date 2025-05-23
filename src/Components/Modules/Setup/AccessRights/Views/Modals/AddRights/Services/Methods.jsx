import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const getmenuMasterDataBinding = async () => {
  debugger;
  try {
    const requestData = {
      main: {
        filterID: "0",
        filterID1: 0,
        masterName: "MENUMAS",
        searchText: "#ALL",
        searchCriteria: "",
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.AccessRights.MasterDataBinding);
    return result;
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};

export const addRightsMaster = async (formData) => {
  debugger;
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.AccessRights.AddRightsMaster);
    return result;
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};
