import { useEffect, useState } from "react";
// A import { sha256 } from "crypto-hash";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getSessionStorage, validatePassword, encryptStringData } from "Components/Common/Login/Auth/auth";
import { addNewUser } from "../Services/Methods";
import { getDTDSMasterDataBindingDataList } from "../../../../../../D2DService/Service/Method";

function AddUserLogics() {
  const [formValues, setFormValues] = useState({
    txtDisplayName: "",
    txtLoginName: "",
    txtPassword: "",
    txtUserType: null,
    txtMobileNo: "",
    txtEmailID: "",
  });
  const setAlertMessage = AlertMessage();

  const [userType, setUserType] = useState([]);
  const [isLoadingUserType, setIsLoadingUserType] = useState(false);
  const getUserType = async () => {
    debugger;
    try {
      setIsLoadingUserType(true);
      const userData = getSessionStorage("user");
      const formdata = {
        filterID: userData && userData.LoginID ? userData.LoginID : 0,
        filterID1: 0,
        filterID2: "",
        filterID3: "",
        masterName: "ACCTYP",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      setIsLoadingUserType(false);
      if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
        setUserType(result.response.responseData.masterdatabinding);
      } else {
        setUserType([]);
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
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

  const validateField = (name, value) => {
    let errorsMsg = "";
    if (name === "txtDisplayName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Cannot be empty";
      }
    }
    if (name === "txtLoginName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Cannot be empty";
      } else {
        const regex = new RegExp("^[a-zA-Z0-9_]*$");
        if (!regex.test(value)) {
          errorsMsg = "Not valid";
        }
      }
    }
    if (name === "txtPassword") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Cannot be empty";
      } else if (value) {
        const ErrorPwd = validatePassword(value);
        if (ErrorPwd !== "") {
          errorsMsg = ErrorPwd;
        }
      }
    }

    if (name === "txtMobileNo") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Cannot be empty";
      } else {
        const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
        if (!regex.test(value)) {
          errorsMsg = "Not valid";
        }
      }
    }
    if (name === "txtEmailID") {
      const regex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
      if (!regex.test(value)) {
        errorsMsg = "Email ID is not valid";
      }
    }

    return errorsMsg;
  };

  const [formValidationError, setFormValidationError] = useState({});
  const updateState = (name, value) => {
    debugger;
    setFormValues({ ...formValues, [name]: value });
    formValidationError[name] = validateField(name, value);
  };

  const handleValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtDisplayName"] = validateField("txtDisplayName", formValues.txtDisplayName);
      errors["txtLoginName"] = validateField("txtLoginName", formValues.txtLoginName);
      errors["txtPassword"] = validateField("txtPassword", formValues.txtPassword);
      errors["txtUserType"] = validateField("txtUserType", formValues.txtUserType);
      errors["txtMobileNo"] = validateField("txtMobileNo", formValues.txtMobileNo);
      errors["txtEMailID"] = validateField("txtEMailID", formValues.txtEMailID);

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
      txtDisplayName: "",
      txtLoginName: "",
      txtPassword: "",
      txtUserType: null,
      txtMobileNo: "",
      txtEmailID: "",
    });
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async (e, updateUserData) => {
    if (e) e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    debugger;
    try {
      const encryptUserName = encryptStringData(formValues.txtLoginName ? formValues.txtLoginName : "");
      // A const hashPass = await sha256(formValues.txtPassword ? formValues.txtPassword : "");
      const encryptPass = encryptStringData(formValues.txtPassword ? formValues.txtPassword : "");
      const formData = {
        appAccessID: 0,
        userDisplayName: formValues.txtDisplayName ? formValues.txtDisplayName : "",
        appAccessUserName: encryptUserName,
        // A appAccessPWD: hashPass,
        appAccessPWD: encryptPass,
        appAccessTypeID: formValues.txtUserType && formValues.txtUserType.AppAccessTypeID ? formValues.txtUserType.AppAccessTypeID : 0,
        locationTypeID: 1,
        userMobileNumber: formValues.txtMobileNo ? formValues.txtMobileNo : "",
        emailAddress: formValues.txtEmailID ? formValues.txtEmailID : "",
        appAccessLevel: "APP",
        web_App: 0,
        window_App: 0,
        mobile_App: 0,
        web_API: 0,
        activeStatus: "Y",
        userRelationType: "BR",
        brHeadTypeID: "124301",
        userRelationID: "124301",
        ipAllowed: 0,
        imeiAllowed: 0,
        macAddAllowed: 0,
        mobileAllowed: 0,
      };
      setBtnLoaderActive(true);
      const result = await addNewUser(formData);
      const userData = getSessionStorage("user");
      if (result.response.responseCode === 1) {
        debugger;
        if (result.response && result.response.responseData) {
          const newlyAddedUser = [
            {
              AppAccessID: result.response.responseData.AppAccessID,
              UserDisplayName: formData.userDisplayName,
              AppAccessUserName: formValues.txtLoginName ? formValues.txtLoginName : "",
              UserType: formValues.txtUserType && formValues.txtUserType.AppAccessName ? formValues.txtUserType.AppAccessName : "",
              ActiveStatus: "Y",
              BRTypeID: "124001",
              BRHeadTypeID: "124301",
              LocationTypeID: 1,
              AssignmentFlag: 0,
              UserRelationID: "124301",
              EmailAddress: formValues.txtEmailID ? formValues.txtEmailID : "",
              UserMobileNumber: formValues.txtMobileNo ? formValues.txtMobileNo : "",
              InsertUserID: userData ? userData.LoginID : 0,
              IsNewlyAdded: true,
            },
          ];
          updateUserData(newlyAddedUser);
        }
        setBtnLoaderActive(false);
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        clearForm();
      } else {
        setBtnLoaderActive(false);
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
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

  useEffect(() => {
    getUserType();
  }, []);

  return {
    formValues,
    updateState,
    handleSave,
    btnLoaderActive,
    formValidationError,
    userType,
    isLoadingUserType,
  };
}

export default AddUserLogics;
