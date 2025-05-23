import axios from "axios";
import { Buffer } from "buffer";
import Config from "Configration/Config.json";
import APIEndpoints from "./EndPoints";

const pako = require("pako");

export const forgetData = async (requestData) => {
  try {
    const response = await axios.post(Config.BaseUrl + APIEndpoints.ForgotPassword.Forget, requestData);
    let result = {};
    if (response.status === 200) {
      result = await response.data;
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
    return { responseCode: 0, responseData: null, responseMessage: result.responseMessage };
  } catch (error) {
    console.log(error);
    return { responseCode: 0, responseData: null, responseMessage: error.response.data.responseMessage };
  }
};

export const otpValidateData = async (requestData) => {
  try {
    const response = await axios.post(Config.BaseUrl + APIEndpoints.ForgotPassword.OtpValidate, requestData);
    let result = {};
    if (response.status === 200) {
      result = await response.data;
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
    return { responseCode: 0, responseData: null, responseMessage: result.responseMessage };
  } catch (error) {
    console.log(error);
    return { responseCode: 0, responseData: null, responseMessage: error.response.data.responseMessage };
  }
};

export const resetForgetPasswordData = async (requestData) => {
  try {
    const response = await axios.post(Config.BaseUrl + APIEndpoints.ForgotPassword.ResetForgetPassword, requestData);
    let result = {};
    if (response.status === 200) {
      result = await response.data;
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
    return { responseCode: 0, responseData: null, responseMessage: result.responseMessage };
  } catch (error) {
    console.log(error);
    return { responseCode: 0, responseData: null, responseMessage: error.response.data.responseMessage };
  }
};
