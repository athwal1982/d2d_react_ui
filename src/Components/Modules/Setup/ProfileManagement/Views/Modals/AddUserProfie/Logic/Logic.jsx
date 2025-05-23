import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { addUserProfile } from "../Services/Methods";

function AddUserProfileLogics() {
  const setAlertMessage = AlertMessage();
  const [btnloaderActive, setBtnloaderActive] = useState(false);
  const [formValues, setFormValues] = useState({
    txtProfileName: "",
    txtProfileDescription: "",
    txtActiveStatus: true,
  });

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const clearForm = () => {
    setFormValues({
      txtCompanyMaster: null,
      txtProfileName: "",
      txtProfileDescription: "",
      txtActiveStatus: "Y",
    });
  };

  const [formValidationError, setFormValidationError] = useState({});

  const handleValidation = () => {
    const errors = {};

    let formIsValid = true;
    if (!formValues.txtProfileName || typeof formValues.txtProfileName === "undefined") {
      formIsValid = false;
      errors["txtProfileName"] = "Profile Name is required!";
    }

    setFormValidationError(errors);
    return formIsValid;
  };

  const handleSave = async (e, updateProfileMgmt, showfunc) => {
    debugger;
    try {
      if (e) e.preventDefault();
      if (!handleValidation()) {
        return;
      }
      debugger;

      setBtnloaderActive(true);
      const formData = {
        userProfileID: 0,
        profileName: formValues.txtProfileName.toString(),
        profileDescription: formValues.txtProfileDescription.toString(),
        brHeadTypeID: 124301,
        activeStatus: formValues.txtActiveStatus === true ? "Y" : "N",
      };
      const result = await addUserProfile(formData);
      console.log(result, "AddProfile user response");
      setBtnloaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });

        const addprofile = [
          {
            UserProfileID: result.response.responseData.id ? result.response.responseData.id : 0,
            ProfileName: formValues.txtProfileName.toString(),
            ProfileDescription: formValues.txtProfileDescription.toString(),
            ActiveStatus: formValues.txtActiveStatus,
            IsNewlyAdded: true,
          },
        ];
        updateProfileMgmt(addprofile);
        showfunc();
        clearForm();
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
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
    btnloaderActive,
    setBtnloaderActive,
    handleSave,
    formValidationError,
  };
}

export default AddUserProfileLogics;
