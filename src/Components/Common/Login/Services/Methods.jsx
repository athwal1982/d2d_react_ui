import axios from "axios";
import { Buffer } from "buffer";
import publicIp from "public-ip";
import Config from "Configration/Config.json";
import { setSessionStorage } from "Components/Common/Login/Auth/auth";

const pako = require("pako");

export const authenticate = async (userName, password) => {
  try {
    const ip = await publicIp.v4();
    const requestData = {
      appAccessUID: userName,
      appAccessPWD: password,
      objCommon: {
        insertedIPAddress: ip,
      },
    };

    const response = await axios.post(`${Config.BaseUrl}DTDS/UserLogin`, requestData);
    if (response.status === 200) {
      const result = await response.data;
      if (result.responseCode.toString() === "1") {
        const buff = Buffer.from(result.responseDynamic ? result.responseDynamic : "", "base64");
        if (buff.length !== 0) {
          const Data = JSON.parse(pako.inflate(buff, { to: "string" }));
          return { responseCode: 1, responseData: Data, responseMessage: result.responseMessage };
        }
        return { responseCode: 1, responseData: [], responseMessage: result.responseMessage };
      }
      return { responseCode: 0, responseData: result, responseMessage: result.responseMessage };
    }
    return { responseCode: 0, responseData: null, responseMessage: "Login Error" };
  } catch (error) {
    console.log(error);
    return { responseCode: 0, responseData: null, responseMessage: error.message };
  }
};

export const authenticateUserIDForCallingSolution = async (userName) => {
  try {
    const requestData = {
      appAccessUID: userName,
      objCommon: {
        InsertUserID: "1",
      },
    };

    const response = await axios.post(`${Config.BaseUrl}DTDS/UserIDLogin`, requestData);
    if (response.status === 200) {
      const result = await response.data;
      if (result.responseCode.toString() === "1") {
        const buff = Buffer.from(result.responseDynamic ? result.responseDynamic : "", "base64");
        if (buff.length !== 0) {
          const Data = JSON.parse(pako.inflate(buff, { to: "string" }));
          return { responseCode: 1, responseData: Data, responseMessage: result.responseMessage };
        }
        return { responseCode: 1, responseData: [], responseMessage: result.responseMessage };
      }
      return { responseCode: 0, responseData: result, responseMessage: result.responseMessage };
    }
    return { responseCode: 0, responseData: null, responseMessage: "Login Error" };
  } catch (error) {
    console.log(error);
    return { responseCode: 2, responseData: null, responseMessage: error.message };
  }
};

export const logout = async (AccessUID, SessionID) => {
  try {
    const requestData = {
      appAccessUID: AccessUID,
      sessionID: SessionID,
    };
    const response = await axios.post(`${Config.BaseUrl}DTDS/LogOutUser`, requestData);
    if (response.status === 200) {
      const result = await response.data;
      if (result.responseCode.toString() === "1") {
        const buff = Buffer.from(result.responseDynamic ? result.responseDynamic : "", "base64");
        if (buff.length !== 0) {
          const Data = JSON.parse(pako.inflate(buff, { to: "string" }));
          return { responseCode: 1, responseData: Data, responseMessage: result.responseMessage };
        }
        return { responseCode: 1, responseData: [], responseMessage: result.responseMessage };
      }
      return { responseCode: 0, responseData: result, responseMessage: result.responseMessage };
    }
    return { responseCode: 0, responseData: null, responseMessage: "Some Error" };
  } catch (error) {
    console.log(error);
    return { responseCode: 0, responseData: null, responseMessage: error.message };
  }
};

export const getTime = async () => {
  try {
    const requestData = {};
    const response = await axios.post(`${Config.BaseUrl}DTDS/GetTime`, requestData);
    if (response.status === 200) {
      const result = await response.data;
      if (result.responseCode.toString() === "1") {
        const buff = Buffer.from(result.responseDynamic ? result.responseDynamic : "", "base64");
        if (buff.length !== 0) {
          const Data = JSON.parse(pako.inflate(buff, { to: "string" }));
          setSessionStorage("CurrentDateAndTime", Data.timestamp);
          return { responseCode: 1, responseData: Data, responseMessage: result.responseMessage };
        }
        return { responseCode: 1, responseData: [], responseMessage: result.responseMessage };
      }
      return { responseCode: 0, responseData: result, responseMessage: result.responseMessage };
    }
    return { responseCode: 0, responseData: null, responseMessage: "Some Error" };
  } catch (error) {
    console.log(error);
    return { responseCode: 0, responseData: null, responseMessage: error.message };
  }
};

export const authenticateIntial = async (pAppAccessUID) => {
  try {
    const ip = await publicIp.v4();
    const requestData = {
      appAccessUID: pAppAccessUID,
      objCommon: {
        insertedIPAddress: ip,
      },
    };
    const response = await axios.post(`${Config.BaseUrl}DTDS/Intial`, requestData);
    if (response.status === 200) {
      const result = await response.data;
      if (result.responseCode.toString() === "1") {
        const buff = Buffer.from(result.responseDynamic ? result.responseDynamic : "", "base64");
        if (buff.length !== 0) {
          const Data = JSON.parse(pako.inflate(buff, { to: "string" }));
          return { responseCode: 1, responseData: Data, responseMessage: result.responseMessage };
        }
        return { responseCode: 1, responseData: [], responseMessage: result.responseMessage };
      }
      return { responseCode: 0, responseData: result, responseMessage: result.responseMessage };
    }
    return { responseCode: 0, responseData: null, responseMessage: "Login Error" };
  } catch (error) {
    console.log(error);
    return { responseCode: 0, responseData: null, responseMessage: error.message };
  }
};
