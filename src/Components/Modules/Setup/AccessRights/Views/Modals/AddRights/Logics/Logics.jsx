import { useEffect, useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getmenuMasterDataBinding, addRightsMaster } from "../Services/Methods";

function AddRightsLogics() {
  const [formValues, setFormValues] = useState({
    txtRightApiUrl: "",
    txtRightName: "",
    txtMenuMaterID: null,
    txtRightCode: "",
    txtSpName: "",
    txtApplyToAdmin: false,
  });

  const [menuMasterType, setMenuMasterType] = useState([]);
  const [isLoadingMenuType, setIsLoadingMenuType] = useState(false);
  const setAlertMessage = AlertMessage();
  const getMenuMaster = async () => {
    debugger;
    try {
      setIsLoadingMenuType(true);
      const result = await getmenuMasterDataBinding();
      setIsLoadingMenuType(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.masterdatabinding) {
          setMenuMasterType(result.responseData.masterdatabinding);
        } else {
          setMenuMasterType([]);
        }
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
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  useEffect(() => {
    getMenuMaster();
  }, []);

  const validateField = (name, value) => {
    let errorsMsg = "";
    if (name === "txtRightApiUrl") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Cannot be empty";
      }
    }
    if (name === "txtRightName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Cannot be empty";
      }
    }
    if (name === "txtMenuMaterID") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Cannot be empty";
      }
    }
    if (name === "txtRightCode") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Cannot be empty";
      }
    }
    return errorsMsg;
  };

  const [formValidationError, setFormValidationError] = useState({});
  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    formValidationError[name] = validateField(name, value);
  };

  const handleValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtRightApiUrl"] = validateField("txtRightApiUrl", formValues.txtRightApiUrl);
      errors["txtRightName"] = validateField("txtRightName", formValues.txtRightName);
      errors["txtMenuMaterID"] = validateField("txtMenuMaterID", formValues.txtMenuMaterID);
      errors["txtRightCode"] = validateField("txtRightCode", formValues.txtRightCode);
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

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async (e, updateRightsData) => {
    if (e) e.preventDefault();
    if (!handleValidation()) {
      return;
    }
    try {
      const formData = {
        RightMasterID: "0",
        RightAPIURL: formValues.txtRightApiUrl ? formValues.txtRightApiUrl : "",
        RightCode: formValues.txtRightCode ? formValues.txtRightCode : "",
        RightName: formValues.txtRightName ? formValues.txtRightName : "",
        MenuMasterID: formValues.txtMenuMaterID ? formValues.txtMenuMaterID.MenuMasterID.toString() : "0",
        ApplyToAdmin: formValues.txtApplyToAdmin === true ? "Y" : "N",
        SPName: formValues.txtSpName === "" ? "Not Updated" : formValues.txtSpName.toString(),
      };
      setBtnLoaderActive(true);
      const result = await addRightsMaster(formData);
      setBtnLoaderActive(false);
      if (result.responseCode === 1) {
        if (result.responseData) {
          const newlyAddedRight = [
            {
              AppAccessID: result.responseData.RightMasterID,
              RightName: formData.RightName,
              RightCode: formData.RightCode,
              RightAPIURL: formData.RightAPIURL,
              MenuName: formValues.txtMenuMaterID ? formValues.txtMenuMaterID.MenuName : "",
              ApplyToAdmin: formData.ApplyToAdmin,
              IsNewlyAdded: true,
            },
          ];
          updateRightsData(newlyAddedRight);
          setAlertMessage({
            type: "success",
            message: result.responseMessage,
          });
        }
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
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };
  return {
    formValues,
    setFormValues,
    updateState,
    handleSave,
    isLoadingMenuType,
    menuMasterType,
    formValidationError,
    btnLoaderActive,
  };
}

export default AddRightsLogics;
