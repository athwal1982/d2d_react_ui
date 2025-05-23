import { useState, useEffect } from "react";
// A import { sha256 } from "crypto-hash";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { validatePassword, encryptStringData } from "../../Auth/auth";
import { forgetData, otpValidateData, resetForgetPasswordData } from "../Servcie/Methods";

function ForgotPasswordLogics() {
  const setAlertMessage = AlertMessage();

  const [inputState, setInputState] = useState("UN");
  const [getappAccessID, setgetappAccessID] = useState(0);
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const [isLoadingPage, setisLoadingPage] = useState(false);
  const [formValues, setFormValues] = useState({
    txtUsername: "",
    txtCaptchaValForgotPass: "",
    txtOTP: "",
    txtNewPassword: "",
    txtConfirmPassword: "",
  });

  const [captchaCodeforgot, setCaptchaCodeforgot] = useState("");
  const createCaptchaforgot = () => {
    debugger;
    // A clear the contents of captcha div first
    document.getElementById("captchaforgot").innerHTML = "";
    const charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    const lengthOtp = 6;
    const captcha = [];
    for (let i = 0; i < lengthOtp; i += 1) {
      // A below code will not allow Repetition of Characters
      const index = Math.floor(Math.random() * charsArray.length + 1); // A get the next character from the array
      if (captcha.indexOf(charsArray[index]) === -1) captcha.push(charsArray[index]);
      else i -= 1;
    }
    const canv = document.createElement("canvas");
    canv.id = "captchaforgot";
    canv.width = 200;
    canv.height = 38;
    const ctx = canv.getContext("2d");
    ctx.font = "20px Georgia";
    ctx.strokeText(captcha.join(""), 0, 30);
    // A storing captcha so that can validate you can save it somewhere else according to your specific requirements
    const code = captcha.join("");
    setCaptchaCodeforgot(code);
    document.getElementById("captchaforgot").appendChild(canv); // A adds the canvas to the body element
  };

  const [validationFormError, setValidationFormError] = useState({});

  const validateField = (name, value) => {
    let errorsMsg = "";
    if (name === "txtUsername") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "User Name is required!";
      }
    } else if (name === "txtCaptchaValForgotPass") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Captcha is required!";
      } else if (value) {
        if (captchaCodeforgot !== value) {
          errorsMsg = "Captcha did not match!";
        }
      }
    }
    if (name === "txtOTP") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "OTP is required!";
      } else if (value) {
        if (Number(value.length) < 6) {
          errorsMsg = "OTP should be 6 digit!";
        }
      }
    }
    if (name === "txtNewPassword") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "New Password is required!";
      } else if (value) {
        const ErrorPwd = validatePassword(value);
        if (ErrorPwd !== "") {
          errorsMsg = ErrorPwd;
        } else if (formValues.txtConfirmPassword) {
          if (value !== formValues.txtConfirmPassword) {
            errorsMsg = "Confirm Password and New Password should be same";
          }
        }
      }
    }
    if (name === "txtConfirmPassword") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Confirm Password is required!";
      } else if (value) {
        const ErrorPwd = validatePassword(value);
        if (ErrorPwd !== "") {
          errorsMsg = ErrorPwd;
        } else if (value !== formValues.txtNewPassword) {
          errorsMsg = "Confirm Password and New Password should be same";
        }
      }
    }
    return errorsMsg;
  };

  const handleValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      if (inputState === "UN") {
        errors["txtUsername"] = validateField("txtUsername", formValues.txtUsername);
        errors["txtCaptchaValForgotPass"] = validateField("txtCaptchaValForgotPass", formValues.txtCaptchaValForgotPass);
      } else if (inputState === "VR") {
        errors["txtOTP"] = validateField("txtOTP", formValues.txtOTP);
      } else if (inputState === "RP") {
        errors["txtNewPassword"] = validateField("txtNewPassword", formValues.txtNewPassword);
        errors["txtConfirmPassword"] = validateField("txtConfirmPassword", formValues.txtConfirmPassword);
      }
      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setValidationFormError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        open: true,
        type: "error",
        message: "Something went wrong!",
      });
      return false;
    }
  };
  const updateState = (name, value) => {
    validationFormError[name] = validateField(name, value);
    setFormValues((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const checkUserNameForForGotPassword = async () => {
    try {
      const encryptUserName = encryptStringData(formValues.txtUsername ? formValues.txtUsername : "");
      const formData = {
        appAccessUserName: encryptUserName,
      };
      setBtnLoaderActive(true);
      const result = await forgetData(formData);
      setBtnLoaderActive(false);
      if (result.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: "6 digit OTP sent on your registered mobile number.",
        });
        setInputState("VR");
      } else {
        createCaptchaforgot();
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setBtnLoaderActive(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const verifyOTPForForGotPassword = async () => {
    try {
      const encryptUserName = encryptStringData(formValues.txtUsername ? formValues.txtUsername : "");
      const formData = {
        appAccessUserName: encryptUserName,
        otp: formValues && formValues.txtOTP ? Number(formValues.txtOTP) : 0,
      };
      setBtnLoaderActive(true);
      const result = await otpValidateData(formData);
      setBtnLoaderActive(false);
      if (result.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: "UserName verified.",
        });
        setInputState("RP");
        setgetappAccessID(result.responseData.appAccessID);
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setBtnLoaderActive(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const createNewPasswordForGotPassword = async () => {
    try {
      // A const hashPass = await sha256(formValues.txtNewPassword ? formValues.txtNewPassword : "");
      const encryptPass = encryptStringData(formValues.txtNewPassword ? formValues.txtNewPassword : "");
      const formData = {
        appAccessID: getappAccessID,
        // A newPassword: hashPass,
        newPassword: encryptPass,
      };
      setBtnLoaderActive(true);
      const result = await resetForgetPasswordData(formData);
      console.log(result);
      setBtnLoaderActive(false);
      if (result.responseCode === 1) {
        // A setAlertMessage({
        // A  type: "success",
        // A  message: result.responseMessage,
        // A });
        setInputState("RPS");
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const resendOTPForGotPassword = async () => {
    try {
      const encryptUserName = encryptStringData(formValues.txtUsername ? formValues.txtUsername : "");
      const formData = {
        appAccessUserName: encryptUserName,
      };
      setisLoadingPage(true);
      const result = await forgetData(formData);
      setisLoadingPage(false);
      if (result.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: "6 digit OTP sent on your registered mobile number.",
        });
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  const handleSubmit = async () => {
    debugger;
    try {
      if (!handleValidation()) {
        return;
      }
      if (inputState === "UN") {
        checkUserNameForForGotPassword();
      } else if (inputState === "VR") {
        verifyOTPForForGotPassword();
      } else if (inputState === "RP") {
        createNewPasswordForGotPassword();
      }
    } catch (error) {
      console.log(error);
      setBtnLoaderActive(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  useEffect(() => {
    createCaptchaforgot();
  }, []);

  return {
    formValues,
    updateState,
    validationFormError,
    inputState,
    btnLoaderActive,
    handleSubmit,
    resendOTPForGotPassword,
    captchaCodeforgot,
    createCaptchaforgot,
    isLoadingPage,
  };
}

export default ForgotPasswordLogics;
