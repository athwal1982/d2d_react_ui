import axios from "axios";
import { checkAuthExist, getSessionStorage } from "Components/Common/Login/Auth/auth";
import { Buffer } from "buffer";
import publicIp from "public-ip";
import Config from "Configration/Config.json";
// A import { getTime } from "../../../Components/Common/Login/Services/Methods";

const pako = require("pako");

export const IfnullApiCalling = async (requestApiData, apiPath, header) => {
  try {
    // A const currdateTime = await getTime();
    // A if (!checkAuthExist(currdateTime.responseData.timestamp)) {
    // A  return { responseCode: 401, responseData: null, responseMessage: "Session Expired" };
    // A }
    if (!checkAuthExist()) {
      return {
        responseCode: 401,
        responseData: null,
        responseMessage: "Session Expired",
      };
    }
    const ip = await publicIp.v4();
    const user = getSessionStorage("user");
    const requestData = {
      ...requestApiData.main,
      objCommon: {
        ...requestApiData.objCommon,
        insertedUserID: user && user.LoginID ? user.LoginID.toString() : "1",
        insertedIPAddress: ip,
        dateShort: "yyyy-MM-dd",
        dateLong: "yyyy-MM-dd HH:mm:ss",
      },
    };

    const response = await axios.post(Config.BaseUrl + apiPath, requestData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: user.token.Token,
        ...header,
      },
    });

    if (response && response.status === 200) {
      const result = await response.data;
      if (result.responseCode.toString() === "1") {
        const buff = Buffer.from(result.responseDynamic ? result.responseDynamic : "", "base64");
        if (buff.length !== 0) {
          const Data = JSON.parse(pako.inflate(buff, { to: "string" }));
          return { responseCode: 1, responseData: Data, responseMessage: result.responseMessage };
        }
        return { responseCode: 1, responseData: [], responseMessage: result.responseMessage };
      }
      return { responseCode: result.responseCode, responseData: null, responseMessage: result.responseMessage };
    }
    return { responseCode: 0, responseData: null, responseMessage: "" };
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      return { responseCode: 401, responseData: null, responseMessage: "" };
    }
    return {
      responseCode: 0,
      responseData: null,
      // A responseMessage: error && error.response && error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : "",
      responseMessage: error.message,
    };
  }
};
export const ApiCalling = async (requestApiData, apiPath, header) => {
  try {
    // A const currdateTime = await getTime();
    // A if (!checkAuthExist(currdateTime.responseData.timestamp)) {
    // A  return { responseCode: 401, responseData: null, responseMessage: "Session Expired" };
    // A }
    if (!checkAuthExist()) {
      return {
        responseCode: 401,
        responseData: null,
        responseMessage: "Session Expired",
      };
    }
    const ip = await publicIp.v4();
    const user = getSessionStorage("user");
    const requestData = {
      ...requestApiData.main,
      objCommon: {
        ...requestApiData.objCommon,
        insertedUserID: user && user.LoginID ? user.LoginID.toString() : "1",
        insertedIPAddress: ip,
        dateShort: "yyyy-MM-dd",
        dateLong: "yyyy-MM-dd HH:mm:ss",
      },
    };
    const response = await axios.post(Config.BaseUrl + apiPath, requestData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: user.token.Token,
        ...header,
      },
    });

    if (response && response.status === 200) {
      const result = await response.data;
      if (result.responseCode.toString() === "1") {
        const buff = Buffer.from(result.responseDynamic ? result.responseDynamic : "", "base64");
        if (buff.length !== 0) {
          const Data = JSON.parse(pako.inflate(buff, { to: "string" }));
          return { responseCode: 1, responseData: Data, responseMessage: result.responseMessage };
        }
        return { responseCode: 1, responseData: [], responseMessage: result.responseMessage };
      }

      if (result.responseMessage === "null") {
        const resp = IfnullApiCalling(requestApiData, apiPath, header);
        return resp;
      }
      return { responseCode: result.responseCode, responseData: null, responseMessage: result.responseMessage };
    }
    return { responseCode: 0, responseData: null, responseMessage: "" };
  } catch (error) {
    if (error && error.response && error.response.status === 401) {
      return { responseCode: 401, responseData: null, responseMessage: "" };
    }
    return {
      responseCode: 0,
      responseData: null,
      // A responseMessage: error && error.response && error.response.data && error.response.data.responseMessage ? error.response.data.responseMessage : "",
      responseMessage: error.message,
    };
  }
};

export const ClientApiCalling = async (requestApiData, apiPath, header) => {
  debugger;
  try {
    if (!checkAuthExist()) {
      return {
        responseCode: 401,
        responseData: null,
        responseMessage: "Session Expired",
      };
    }
    const user = getSessionStorage("user");
    const requestData = {
      ...requestApiData.main,
    };

    const response = await axios.post(Config.BaseUrl + apiPath, requestData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: user.token.Token,
        ...header,
      },
    });

    if (response && response.status === 200) {
      const result = await response.data;
      if (result.responseCode.toString() === "1") {
        const buff = Buffer.from(result.responseDynamic ? result.responseDynamic : "", "base64");
        if (buff.length !== 0) {
          const Data = JSON.parse(pako.inflate(buff, { to: "string" }));
          return { responseCode: 1, responseData: Data, responseMessage: result.responseMessage };
        }
        return { responseCode: 1, responseData: [], responseMessage: result.responseMessage };
      }
      return { responseCode: result.responseCode, responseData: null, responseMessage: result.responseMessage };
    }
    return { responseCode: 0, responseData: null, responseMessage: "" };
  } catch (error) {
    return {
      responseCode: 0,
      responseData: null,
      // A responseMessage: error && error.response && error.response.data && error.response.statusText ? error.response.statusText : "Something went wrong",
      responseMessage: error.message,
    };
  }
};
