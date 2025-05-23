import { useState, useEffect } from "react";
// A import { sha256 } from "crypto-hash";
// A import bcrypt from "bcryptjs";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useNavigate } from "react-router-dom";
import { setSessionStorage } from "../Auth/auth";
import { encryptStringData, decryptStringData } from "../../../../Configration/Utilities/encodeDecode";
import { authenticate, authenticateUserIDForCallingSolution, authenticateIntial } from "../Services/Methods";

function AddLoginLogics() {
  const setAlertMessage = AlertMessage();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    txtLoginId: "",
    txtPassword: "",
    txtCaptchaVal: "",
  });

  const [captchaCode, setCaptchaCode] = useState("");
  const createCaptcha = () => {
    debugger;
    // A clear the contents of captcha div first
    document.getElementById("captcha").innerHTML = "";
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
    canv.id = "captcha";
    canv.width = 200;
    canv.height = 38;
    const ctx = canv.getContext("2d");
    ctx.font = "20px Georgia";
    ctx.strokeText(captcha.join(""), 0, 30);
    // A storing captcha so that can validate you can save it somewhere else according to your specific requirements
    const code = captcha.join("");
    setCaptchaCode(code);
    document.getElementById("captcha").appendChild(canv); // A adds the canvas to the body element
  };

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const pathUrl = window.location.href;
  const [showHideLogin, setShowHideLogin] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const callServiceActivityPage = async () => {
    debugger;
    try {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      const encptUN = decryptStringData(params && params.userName ? params.userName : "uN");
      setIsLoadingPage(true);
      const result = await authenticateUserIDForCallingSolution(encptUN);
      setIsLoadingPage(false);
      console.log(result, "result");
      if (result.responseCode === 1) {
        if (!(result.responseData.token && result.responseData.token.Token && result.responseData.token.expirationTime)) {
          setAlertMessage({
            type: "error",
            message: "Token is missing in the response",
          });
          return;
        }
        const user = {
          ...result.responseData,
        };
        setSessionStorage("user", user);
        navigate("/ServiceActivity");
      } else if (result.responseCode === 0) {
        setAlertMessage({
          type: "error",
          message: "User Name does not exist.",
        });
        setIsLoadingPage(false);
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
        setIsLoadingPage(false);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
      setIsLoadingPage(false);
    }
  };

  useEffect(() => {
    debugger;
    if (pathUrl.indexOf("userName") !== -1 && pathUrl.indexOf("mobileNumber") !== -1) {
      setShowHideLogin(false);
      callServiceActivityPage();
    } else {
      setShowHideLogin(true);
      setTimeout(() => {
        createCaptcha();
      }, 500);
    }
  }, []);

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleLogin = async (captchaCode) => {
    debugger;
    try {
      if (formValues.txtLoginId === "") {
        setAlertMessage({
          type: "error",
          message: "User Name is required!",
        });
        return;
      }
      if (formValues.txtPassword === "") {
        setAlertMessage({
          type: "error",
          message: "Password is required!",
        });
        return;
      }
      if (formValues.txtCaptchaVal !== captchaCode) {
        setAlertMessage({
          type: "error",
          message: "Captcha did not match...",
        });
        return;
      }
      const encryptUserName = encryptStringData(formValues.txtLoginId ? formValues.txtLoginId : "");
      // A const hashPass = await sha256(formValues.txtPassword ? formValues.txtPassword : "");
      const encryptPass = encryptStringData(formValues.txtPassword ? formValues.txtPassword : "");
      setBtnLoaderActive(true);
      const resultSaltVal = await authenticateIntial(encryptUserName);
      if (resultSaltVal.responseCode === 1) {
        const salValue = resultSaltVal.responseData;
        // A const conctSaltAndHashPass = `${hashPass}_${salValue}`;
        const conctSaltAndEncryptPass = `${encryptPass}_${salValue}`;
        // A const salt = await bcrypt.genSalt(10);
        // A const bcryptSaltSaltAndHashPass = await bcrypt.hash(conctSaltAndHashPass, salt);
        // A const result = await authenticate(encryptUserName, bcryptSaltSaltAndHashPass);
        const result = await authenticate(encryptUserName, conctSaltAndEncryptPass);
        setBtnLoaderActive(false);
        if (result.responseCode === 1) {
          if (!(result.responseData.token && result.responseData.token.Token && result.responseData.token.expirationTime)) {
            createCaptcha();
            setAlertMessage({
              type: "error",
              message: "Token is missing in the response",
            });
            return;
          }
          const user = {
            ...result.responseData,
          };
          setSessionStorage("user", user);
          navigate("/welcome");
        } else {
          setBtnLoaderActive(false);
          createCaptcha();
          setAlertMessage({
            type: "error",
            message: result.responseMessage,
          });
        }
      } else {
        setBtnLoaderActive(false);
        createCaptcha();
        setAlertMessage({
          type: "error",
          message: resultSaltVal.responseMessage,
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

  const SearchByHandleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState({});
  const toggleForgotPasswordModal = () => {
    setForgotPasswordModal(!forgotPasswordModal);
    setSelectedUserData();
  };
  return {
    formValues,
    setFormValues,
    updateState,
    handleLogin,
    SearchByHandleKeyDown,
    showHideLogin,
    isLoadingPage,
    captchaCode,
    createCaptcha,
    forgotPasswordModal,
    selectedUserData,
    toggleForgotPasswordModal,
    btnLoaderActive,
  };
}

export default AddLoginLogics;
