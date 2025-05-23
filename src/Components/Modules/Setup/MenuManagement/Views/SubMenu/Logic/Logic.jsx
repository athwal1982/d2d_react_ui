import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect, useState } from "react";
import { addMenuOrSubMenu } from "../Services/Methods";

function SubMenuPopUpLogics() {
  const setAlertMessage = AlertMessage();
  const [modalData, setModalData] = useState({});
  const [btnloaderActive, setBtnloaderActive] = useState(false);
  const [formValues, setFormValues] = useState({
    txtMenuName: "",
    txtWebUrl: "",
    txtWinUrl: "",
    txtAppUrl: "",
    txtApiUrl: "",
    txtWpfUrl: "",
    txtReactUrl: "",
    radioHasChild: false,
    radioMenuType: "1",
  });

  const clearForm = () => {
    setFormValues({
      txtMenuName: "",
      txtWebUrl: "",
      txtWinUrl: "",
      txtAppUrl: "",
      txtApiUrl: "",
      txtWpfUrl: "",
      txtReactUrl: "",
      radioHasChild: false,
      radioMenuType: "1",
    });
  };

  const updateState = (name, value) => {
    debugger;
    if (name === "radioHasChild") {
      if (value === true) {
        formValues.txtWebUrl = "";
        formValues.txtWinUrl = "";
        formValues.txtAppUrl = "";
        formValues.txtApiUrl = "";
        formValues.txtWpfUrl = "";
        formValues.txtReactUrl = "";
      }
    }
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    debugger;
    if (modalData.isEditMode === true) {
      if (modalData.menuData.HasChild === "1") {
        modalData.menuData.HasChild = true;
      } else if (modalData.menuData.HasChild === "0") {
        modalData.menuData.HasChild = false;
      }
      setFormValues({
        txtMenuName: modalData.menuData.MenuName,
        txtWebUrl: modalData.menuData.WebURL,
        txtWinUrl: modalData.menuData.WinURL,
        txtAppUrl: modalData.menuData.AppURL,
        txtApiUrl: modalData.menuData.APIURL,
        txtWpfUrl: modalData.menuData.WPFURL,
        txtReactUrl: modalData.menuData.ReactURL,
        radioHasChild: modalData.menuData.HasChild,
        radioMenuType: modalData.menuData.MenuType.toString(),
      });
    }
  }, [modalData]);

  const [formValidationError, setFormValidationError] = useState({});

  const handleValidation = () => {
    const errors = {};
    let formIsValid = true;

    if (!formValues.txtMenuName) {
      formIsValid = false;
      errors["txtMenuName"] = "Menu Name is required!";
    }

    if (typeof formValues.txtMenuName === "undefined") {
      formIsValid = false;
      errors["txtMenuName"] = "Menu Name is required!";
    }

    if (typeof formValues["txtWpfUrl"] !== "undefined" && formValues["txtWpfUrl"]) {
      const count = (formValues["txtWpfUrl"].match(/\./g) || []).length;
      if (!(count >= 2)) {
        formIsValid = false;
        errors["txtWpfUrl"] = "Please enter a valid Url. Ex:- MIS.Finance.AccountStatementPage";
      }
    }

    setFormValidationError(errors);
    return formIsValid;
  };

  const handleSave = async (e, updateMenuList, showfunc) => {
    try {
      if (e) e.preventDefault();
      if (!handleValidation()) {
        return;
      }

      debugger;

      setBtnloaderActive(true);
      const formData = {
        MenuMasterID: modalData.isEditMode ? modalData.menuData.MenuMasterID.toString() : "0",
        MenuName: formValues.txtMenuName,
        ModuleMasterID: "0",
        UnderMenuID: modalData.isEditMode ? modalData.menuData.UnderMenuID.toString() : modalData.menuData.MenuMasterID.toString(),
        MenuType: formValues.radioMenuType,
        MenuSequence: modalData.isEditMode ? modalData.menuData.MenuSequence.toString() : "1",
        WebURL: formValues.txtWebUrl,
        WinURL: formValues.txtWinUrl,
        AppURL: formValues.txtAppUrl,
        APIURL: formValues.txtApiUrl,
        WPFURL: formValues.txtWpfUrl,
        ReactURL: formValues.txtReactUrl,
        HasChild: formValues.radioHasChild && (formValues.radioHasChild === true || formValues.radioHasChild === 1) ? 1 : 0,
      };
      const result = await addMenuOrSubMenu(formData);
      setBtnloaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });

        if (result.response.responseData && result.response.responseData.length > 0) {
          const subMenu = {
            MenuMasterID: Number(result.response.responseData[0].MenuMasterID),
            MenuName: formValues.txtMenuName,
            MenuSequence: modalData.isEditMode ? modalData.menuData.MenuSequence : 1,
            MenuType: Number(formValues.radioMenuType),
            UnderMenuID: modalData.isEditMode ? modalData.menuData.UnderMenuID : Number(modalData.menuData.MenuMasterID),
            APIURL: formValues.txtApiUrl,
            AppURL: formValues.txtAppUrl,
            ReactURL: formValues.txtReactUrl,
            WebURL: formValues.txtWebUrl,
            WPFURL: formValues.txtWpfUrl,
            WinURL: formValues.txtWinUrl,
            IsNewlyAdded: true,
            HasChild: formValues.radioHasChild && (formValues.radioHasChild === true || formValues.radioHasChild === 1) ? "1" : "0",
          };
          updateMenuList(subMenu, modalData.isEditMode);
          if (modalData.isEditMode) {
            showfunc();
          } else {
            clearForm();
          }
        }
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
    btnloaderActive,
    setBtnloaderActive,
    updateState,
    handleSave,
    setModalData,
    formValidationError,
  };
}

export default SubMenuPopUpLogics;
