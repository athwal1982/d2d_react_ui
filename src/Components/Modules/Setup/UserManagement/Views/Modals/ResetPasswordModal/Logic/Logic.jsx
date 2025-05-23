import { useState } from "react";
// A import { sha256 } from "crypto-hash";
import { useNavigate } from "react-router-dom";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getSessionStorage, validatePassword, encryptStringData } from "Components/Common/Login/Auth/auth";
import { ResetPassword } from "../Service/Methods";
import { logout } from "../../../../../../../Common/Login/Services/Methods";

function ResetPasswordLogics() {
  const [formValues, setFormValues] = useState({
    txtOldPassword: "",
    txtNewPassword: "",
    txtConfirmPassword: "",
  });
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const [formValidationError, setFormValidationError] = useState({});
  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let errorsMsg = "";
    if (name === "txtOldPassword") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Old Password is required!";
      } else if (value) {
        const ErrorPwd = validatePassword(value);
        if (ErrorPwd !== "") {
          errorsMsg = ErrorPwd;
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

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    formValidationError[name] = validateField(name, value);
  };

  const handleValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtOldPassword"] = validateField("txtOldPassword", formValues.txtOldPassword);
      errors["txtNewPassword"] = validateField("txtNewPassword", formValues.txtNewPassword);
      errors["txtConfirmPassword"] = validateField("txtConfirmPassword", formValues.txtConfirmPassword);

      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const clearForm = () => {
    setFormValues({
      txtNewPassword: "",
      txtConfirmPassword: "",
    });
  };

  const handleSave = async (e, showfunc, selectedUserData) => {
    if (e) e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    try {
      // A const hashPass = await sha256(formValues.txtNewPassword ? formValues.txtNewPassword : "");
      // A const hashOldPass = await sha256(formValues.txtOldPassword ? formValues.txtOldPassword : "");
      const encryptOldPass = encryptStringData(formValues.txtOldPassword ? formValues.txtOldPassword : "");
      const encryptPass = encryptStringData(formValues.txtNewPassword ? formValues.txtNewPassword : "");
      const formData = {
        appAccessID: selectedUserData && selectedUserData.AppAccessID ? selectedUserData.AppAccessID : 0,
        oldPassword: encryptOldPass,
        newPassword: encryptPass,
        // A oldPassword: hashOldPass,
        // A newPassword: hashPass,
        resetPasswordBy: 1,
      };
      setBtnLoaderActive(true);
      const result = await ResetPassword(formData);
      console.log(result);
      setBtnLoaderActive(false);
      if (result.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.responseMessage,
        });
        clearForm();
        showfunc();
        await logout(userData.LoginID ? userData.LoginID : 0, userData.SessionID ? userData.SessionID : 0);
        sessionStorage.clear();
        navigate("/");
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
  return {
    formValues,
    setFormValues,
    btnLoaderActive,
    formValidationError,
    updateState,
    handleSave,
  };
}

export default ResetPasswordLogics;
