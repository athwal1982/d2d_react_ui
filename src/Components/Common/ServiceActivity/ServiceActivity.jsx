import { React, useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Form, DataGrid } from "Framework/Components/Layout";
import { Loader, Button } from "Framework/Components/Widgets";
import { RiFileList3Line } from "react-icons/ri";
import { MdPersonSearch } from "react-icons/md";
import { GrUserSettings } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { dateToCompanyFormat, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { decryptStringData } from "Configration/Utilities/encodeDecode";
import { setSessionStorage, getSessionStorage } from "../Login/Auth/auth";
import {
  getDTDSMasterDataBindingDataList,
  getApplicantInDbData,
  addApplicantInDbData,
  // A addAppointmentData,
  addComplaintData,
  addAppointmentDetailsData,
} from "../../Modules/D2DService/Service/Method";
import { getDetailReportDataList } from "../../Modules/Reports/Service/Method";
import BizClass from "./ServiceActivity.module.scss";
import ServiceDocumentList from "./ServiceDocumentList";
import MultipleServiceByStatetList from "./MultipleServiceByStatetList";

function ServiceActivity() {
  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");
  const navigate = useNavigate();
  const mobileNoSelect = useRef();
  const [arrServiceToMultipleApplicant, setarrServiceToMultipleApplicant] = useState([]);
  const [isApplicantConrolsDisabled, setisApplicantConrolsDisabled] = useState(false);
  const [isValidationConrolsDisabled, setisValidationConrolsDisabled] = useState(false);
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const encptMN = decryptStringData(params && params.mobileNumber ? params.mobileNumber : "91");
  const [documentRequiredList] = useState([
    { label: "Yes", value: 1 },
    { label: "No", value: 2 },
  ]);

  const [locationTypeList] = useState([
    { Location: "URBAN", LocationID: "01" },
    { Location: "RURAL", LocationID: "02" },
  ]);

  const [formValidationFarmersError, setFormValidationFarmersError] = useState({});
  const [formValuesMN, setFormValuesMN] = useState({
    txtValMobileNumber: encptMN,
    txtMobileNumber: encptMN,
  });

  const validateFarmersField = (name, value) => {
    let errorsMsg = "";
    const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");

    if (name === "txtValMobileNumber") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Caller Contact No is required!";
      } else if (value) {
        if (!regex.test(value)) {
          errorsMsg = "Caller Contact No is not valid!";
        } else if (Number(value.toString().substr(0, 1)) < 5) {
          errorsMsg = "Enter Valid  Caller Contact Number!";
        } else if (value.length < 10) {
          errorsMsg = "Enter Valid 10 digit Caller Contact No!";
        }
      }
    }
    if (name === "txtMobileNumber") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Applicant Contact No is required!";
      } else if (value) {
        if (!regex.test(value)) {
          errorsMsg = "Applicant Contact No is not valid!";
        } else if (Number(value.toString().substr(0, 1)) < 5) {
          errorsMsg = "Enter Valid  Applicant Contact No!";
        } else if (value.length < 10) {
          errorsMsg = "Enter Valid 10 digit Applicant Contact No!";
        }
      }
    }
    return errorsMsg;
  };

  const handleFarmersValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;

      errors["txtValMobileNumber"] = validateFarmersField("txtValMobileNumber", formValuesMN.txtValMobileNumber);
      errors["txtMobileNumber"] = validateFarmersField("txtMobileNumber", formValuesMN.txtMobileNumber);
      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setFormValidationFarmersError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const updateStateMN = (name, value) => {
    setFormValuesMN({ ...formValuesMN, [name]: value });
    if (name === "txtValMobileNumber") {
      setFormValuesMN({
        ...formValuesMN,
        txtValMobileNumber: value,
        txtMobileNumber: value,
      });
    }
    formValidationFarmersError[name] = validateFarmersField(name, value);
  };

  const [lableTalukAnything, setlableTalukAnything] = useState("SubDistrict");
  // A const [lableVillageForByLocation, setlableVillageForByLocation] = useState("Village");

  const [formValidationConsumerError, setFormValidationConsumerError] = useState({});
  const [formValuesForConsumer, setFormValuesForConsumer] = useState({
    txtApplicantID: "",
    txtAppointmentNo: "",
    txtCallerName: "",
    txtApplicantName: "",
    // A txtMobileNumber: "",
    txtAlternateMobileNumber: "",
    txtEmail: "",
    txtServiceTypeID: null,
    txtVistingFee: "",
    txtServiceFee: "",
    txtDocumentRequired: null,
    txtPinCode: "",
    txtAddress: "",
    txtLocationType: null,
    txtStateForByLocation: null,
    txtDistrictForByLocation: null,
    txtSubDistrictForByLocation: null,
    txtVillageForByLocation: null,
    txtLandMark: "",
    txtAppointmentDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    txtAppointmentSlot: null,
    txtComplaintType: null,
    txtComplaintType1: null,
    txtOthersComplaintType1: "",
    txtAppoinitmentNo: null,
    txtComplaints: "",
  });

  const [districtForByLocationDropdownDataList, setDistrictForByLocationDropdownDataList] = useState([]);
  const [isLoadingDistrictForByLocationDropdownDataList, setIsLoadingDistrictForByLocationDropdownDataList] = useState(false);
  const getDistrictByStateForByLocationListData = async (pstatemasterid) => {
    try {
      setIsLoadingDistrictForByLocationDropdownDataList(true);
      const formdata = {
        filterID: pstatemasterid,
        filterID1: 0,
        filterID2: "",
        filterID3: "",
        masterName: "DTDSDSTRCT",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      console.log(result, "District Data");
      setIsLoadingDistrictForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setDistrictForByLocationDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setDistrictForByLocationDropdownDataList([]);
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

  const [subDistrictForByLocationDropdownDataList, setSubDistrictForByLocationDropdownDataList] = useState([]);
  const [isLoadingSubDistrictForByLocationDropdownDataList, setIsLoadingSubDistrictForByLocationDropdownDataList] = useState(false);
  const getSubDistrictByStateANDDistrictListData = async (pdistrictMasterCode) => {
    try {
      setIsLoadingSubDistrictForByLocationDropdownDataList(true);
      const formdata = {
        filterID: pdistrictMasterCode,
        filterID1: 0,
        filterID2: 0,
        filterID3: "",
        masterName: "DTDSSDSTRCT",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      console.log(result, "SubDistrict Data");
      setIsLoadingSubDistrictForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setSubDistrictForByLocationDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setSubDistrictForByLocationDropdownDataList([]);
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

  // A const [villageForByLocationDropdownDataList, setVillageForByLocationDropdownDataList] = useState([]);
  // A const [isLoadingVillageForByLocationDropdownDataList, setIsLoadingVillageForByLocationDropdownDataList] = useState(false);
  // A const getVillageListBYSubDistrictAndDistrictListData = async (pSubDistrictCode) => {
  // A  try {
  // A    setIsLoadingVillageForByLocationDropdownDataList(true);
  // A   const formdata = {
  // A      filterID: pSubDistrictCode,
  // A      filterID1: 0,
  // A      filterID2: "",
  // A      filterID3: "",
  // A      masterName: "VILAGE",
  // A      searchText: "#ALL",
  // A      searchCriteria: "AW",
  // A   };
  // A    const result = await getDTDSMasterDataBindingDataList(formdata);
  // A    console.log(result, "Village Data");
  // A    setIsLoadingVillageForByLocationDropdownDataList(false);
  // A    if (result.response.responseCode === 1) {
  // A      if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
  // A        setVillageForByLocationDropdownDataList(result.response.responseData.masterdatabinding);
  // A      } else {
  // A       setVillageForByLocationDropdownDataList([]);
  // A      }
  // A    } else {
  // A      setAlertMessage({
  // A        type: "error",
  // A        message: result.response.responseMessage,
  // A      });
  // A    }
  // A  } catch (error) {
  // A    console.log(error);
  // A    setAlertMessage({
  // A      type: "error",
  // A      message: "Something went Wrong! Error Code : 442",
  // A    });
  // A  }
  // A };

  // A function useDebounce(value, delay) {
  // A  const [debouncedValue, setDebouncedValue] = useState(value);
  // A  useEffect(() => {
  // A    const handler = setTimeout(() => {
  // A      setDebouncedValue(value);
  // A    }, delay);
  // A    return () => {
  // A      clearTimeout(handler);
  // A    };
  // A  }, [value, delay]);
  // A  return debouncedValue;
  // A }

  // A const [ServiceInputSearch, setServiceInputSearch] = useState();
  // A const [searchItemTerm, setsearchItemTerm] = useState("");
  // A const debouncedsearchServiceTerm = useDebounce(searchItemTerm, 500);

  const [serviceTypeData, setServiceTypeData] = useState("");
  const [serviceTypeDropdownDataList, setServiceTypeDropdownDataList] = useState(false);
  const [isLoadingServiceTypeDropdownDataList, setIsLoadingSeviceTypeDropdownDataList] = useState(false);
  const getSeviceTypeListData = async (pStateCode) => {
    debugger;
    try {
      setIsLoadingSeviceTypeDropdownDataList(true);
      const formdata = {
        filterID: pStateCode,
        filterID1: 0,
        filterID2: "",
        filterID3: "",
        masterName: "SVCTYP",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      setIsLoadingSeviceTypeDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setServiceTypeDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setServiceTypeDropdownDataList([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
        setServiceTypeDropdownDataList([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  // A useEffect(() => {
  // A  if (debouncedsearchServiceTerm) {
  // A    if (debouncedsearchServiceTerm.length >= 3) {
  // A     if (debouncedsearchServiceTerm.toLowerCase() === "#all") {
  // A        setServiceInputSearch("");
  // A      }
  // A      getSeviceTypeListData(
  // A        formValuesForConsumer && formValuesForConsumer.txtStateForByLocation && formValuesForConsumer.txtStateForByLocation.StateCode
  // A          ? formValuesForConsumer.txtStateForByLocation.StateCode
  // A          : 0,
  // A      );
  // A    }
  // A  }
  // A }, [debouncedsearchServiceTerm]);

  // A const SelectTypeState = (searchvalue) => {
  // A  debugger;
  // A  setsearchItemTerm(searchvalue);
  // A  setServiceInputSearch();
  // A };

  const [stateForByLocationDropdownDataList, setStateForByLocationDropdownDataList] = useState([]);
  const [isLoadingStateForByLocationDropdownDataList, setIsLoadingStateForByLocationDropdownDataList] = useState(false);
  const getStateForByLocationListData = async () => {
    debugger;
    try {
      setIsLoadingStateForByLocationDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: userData && userData.LoginID ? userData.LoginID : 0,
        filterID2: "",
        filterID3: "",
        // A masterName: "DTDSSTATE",
        masterName: "GETSTATE",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      console.log(result, "State Data");
      setIsLoadingStateForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateForByLocationDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setStateForByLocationDropdownDataList([]);
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

  const [complaintTypeDropdownDataList, setComplaintTypeDropdownDataList] = useState(false);
  const [isLoadingtComplaintTypeDropdownDataList, setIsLoadingtComplaintTypeDropdownDataList] = useState(false);
  const getComplaintTypeListData = async () => {
    debugger;
    try {
      setIsLoadingtComplaintTypeDropdownDataList(true);
      const formdata = {
        filterID: 130,
        filterID1: 0,
        filterID2: "",
        filterID3: "",
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      setIsLoadingtComplaintTypeDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setComplaintTypeDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setComplaintTypeDropdownDataList([]);
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

  const [complaintType1DropdownDataList, setComplaintType1DropdownDataList] = useState(false);
  const [isLoadingtComplaintType1DropdownDataList, setIsLoadingtComplaintType1DropdownDataList] = useState(false);
  const getComplaintType1ListData = async () => {
    debugger;
    try {
      setIsLoadingtComplaintType1DropdownDataList(true);
      const formdata = {
        filterID: 131,
        filterID1: 0,
        filterID2: "",
        filterID3: "",
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      setIsLoadingtComplaintType1DropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setComplaintType1DropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setComplaintType1DropdownDataList([]);
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

  const [appointmentslotDropdownDataList, setAppointmentSlotDropdownDataList] = useState(false);
  const [isLoadingAppointmentSlotDropdownDataList, setIsLoadingAppointmentSlotDropdownDataList] = useState(false);
  const getAppointmentSlotListData = async (pStateCode) => {
    debugger;
    try {
      setIsLoadingAppointmentSlotDropdownDataList(true);
      const formdata = {
        filterID: pStateCode,
        filterID1: 0,
        filterID2: "",
        filterID3: "",
        // A masterName: "SLOT",
        masterName: "NSLOT",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      console.log(result, "Farmer Type");
      setIsLoadingAppointmentSlotDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          const mappedOptions = result.response.responseData.masterdatabinding.map((data) => {
            return {
              AppointmentSlotFrom: data.AppointmentSlotFrom,
              AppointmentSlotTo: data.AppointmentSlotTo,
              AppointmentSlot: `${data.AppointmentSlotFrom} - ${data.AppointmentSlotTo}`,
              AppointmentSlotID: data.AppointmentSlotID,
              IsExpired: data.AppointmentSlotFrom <= moment().format("HH:mm") && data.AppointmentSlotTo <= moment().format("HH:mm"),
            };
          });
          setAppointmentSlotDropdownDataList(mappedOptions);
          // A setAppointmentSlotDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setAppointmentSlotDropdownDataList([]);
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

  // A const [isLoadingDocumentList, setIsLoadingDocumentList] = useState(false);
  const [documentData, setDocumentData] = useState("");
  const [documentList, setDocumentList] = useState([]);
  const getDocumentDataList = async (pServiceTypeID, pStateCode, pvalue) => {
    try {
      const formdata = {
        filterID: pServiceTypeID,
        filterID1: pStateCode,
        filterID2: "",
        filterID3: "",
        masterName: "SRVDOCTYP",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      // A setIsLoadingDocumentList(true);
      const result = await getDTDSMasterDataBindingDataList(formdata);
      console.log(result);
      // AsetIsLoadingDocumentList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setDocumentList(result.response.responseData.masterdatabinding);
          const documentTypeIDs = result.response.responseData.masterdatabinding
            .map((data) => {
              return data.DocumentTypeID;
            })
            .join(",");

          setDocumentData(documentTypeIDs);
          setFormValuesForConsumer({
            ...formValuesForConsumer,
            txtServiceTypeID: pvalue,
            txtDocumentRequired: null,
            txtServiceFee: result.response.responseData.masterdatabinding[0].VisitingFees ? result.response.responseData.masterdatabinding[0].VisitingFees : "",
          });
        } else {
          setDocumentList([]);
          setDocumentData("");
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const validateFieldConsumer = (name, value) => {
    let errorsMsg = "";

    if (name === "txtApplicantName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Applicant Name is required!";
      }
    }
    if (name === "txtCallerName") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Caller Name is required!";
      }
    }

    const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
    // A if (name === "txtMobileNumber") {
    // A  if (!value || typeof value === "undefined") {
    // A    errorsMsg = "Contact Number is required!";
    // A  } else if (value) {
    // A    if (!regex.test(value)) {
    // A      errorsMsg = "Contact Number is not valid!";
    // A     } else if (value.length < 10) {
    // A      errorsMsg = "Enter Valid 10 digit Contact Number!";
    // A    }
    // A  }
    // A }
    if (name === "txtAlternateMobileNumber") {
      if (value) {
        if (!regex.test(value)) {
          errorsMsg = "Contact Number is not valid!";
        } else if (value.length < 10) {
          errorsMsg = "Enter Valid 10 digit Contact Number!";
        }
      }
    }
    if (name === "txtEmail") {
      const regex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
      if (value) {
        if (!regex.test(value)) {
          errorsMsg = "Email ID is not valid!";
        }
      }
    }
    if (name === "txtStateForByLocation") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "State is required!";
      }
    }
    if (name === "txtDistrictForByLocation") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "District is required!";
      }
    }
    if (name === "txtSubDistrictForByLocation") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Sub District is required!";
      }
    }
    if (name === "txtServiceTypeID") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Service Type is required!";
      }
    }
    if (name === "txtVistingFee") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Visiting Fee is required!";
      }
    }
    if (name === "txtServiceFee") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Department Fee is required!";
      }
    }
    if (name === "txtDocumentRequired") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Document Available is required!";
      }
    }
    if (name === "txtLocationType") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Location Type is required!";
      }
    }
    if (name === "txtVillageForByLocation") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Village is required!";
      }
    }
    if (name === "txtPinCode") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Pincode is required!";
      } else if (value) {
        debugger;
        if (!regex.test(value)) {
          errorsMsg = "Pincode is not valid!";
        } else if (value.length < 6) {
          errorsMsg = "Enter Valid 6 digit Pincode!";
        }
      }
    }
    if (name === "txtAddress") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Address is required!";
      }
    }
    if (name === "txtAppointmentDate") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Appointment Date is required!";
      }
    }
    if (name === "txtAppointmentSlot") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Appointment Slot is required!";
      }
    }
    if (name === "txtComplaintType") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Complaint Type is required!";
      }
    }
    if (name === "txtComplaintType1") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Complaint Type1 is required!";
      }
    }
    if (name === "txtOthersComplaintType1") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Complaint Type1 is required!";
      }
    }
    if (name === "txtAppoinitmentNo") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Appointment Number is required!";
      }
    }
    if (name === "txtComplaints") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Complaint is required!";
      }
    }

    return errorsMsg;
  };

  const [formStateR, setFormStateR] = useState("");
  const [formStateS, setFormStateS] = useState("");
  const [formStateC, setFormStateC] = useState("");
  const handleValidationConsumer = () => {
    try {
      const errors = {};
      let formIsValid = true;

      if (formStateR === "REGTN") {
        errors["txtCallerName"] = validateFieldConsumer("txtCallerName", formValuesForConsumer.txtCallerName);
        errors["txtApplicantName"] = validateFieldConsumer("txtApplicantName", formValuesForConsumer.txtApplicantName);
        // A errors["txtMobileNumber"] = validateFieldConsumer("txtMobileNumber", formValuesForConsumer.txtMobileNumber);
        errors["txtAlternateMobileNumber"] = validateFieldConsumer("txtAlternateMobileNumber", formValuesForConsumer.txtAlternateMobileNumber);
        errors["txtEmail"] = validateFieldConsumer("txtEmail", formValuesForConsumer.txtEmail);
        errors["txtStateForByLocation"] = validateFieldConsumer("txtStateForByLocation", formValuesForConsumer.txtStateForByLocation);
        errors["txtDistrictForByLocation"] = validateFieldConsumer("txtDistrictForByLocation", formValuesForConsumer.txtDistrictForByLocation);
        errors["txtSubDistrictForByLocation"] = validateFieldConsumer("txtSubDistrictForByLocation", formValuesForConsumer.txtSubDistrictForByLocation);
        // A errors["txtServiceTypeID"] = validateFieldConsumer("txtServiceTypeID", formValuesForConsumer.txtServiceTypeID);
        errors["txtVistingFee"] = validateFieldConsumer("txtVistingFee", formValuesForConsumer.txtVistingFee);
        // A errors["txtServiceFee"] = validateFieldConsumer("txtServiceFee", formValuesForConsumer.txtServiceFee);
        errors["txtDocumentRequired"] = validateFieldConsumer("txtDocumentRequired", formValuesForConsumer.txtDocumentRequired);
      }

      if (formStateS === "SERVC") {
        if (formValuesForConsumer && formValuesForConsumer.txtDocumentRequired && formValuesForConsumer.txtDocumentRequired.value === 1) {
          errors["txtServiceFee"] = validateFieldConsumer("txtServiceFee", formValuesForConsumer.txtServiceFee);
          errors["txtLocationType"] = validateFieldConsumer("txtLocationType", formValuesForConsumer.txtLocationType);
          errors["txtVillageForByLocation"] = validateFieldConsumer("txtVillageForByLocation", formValuesForConsumer.txtVillageForByLocation);
          errors["txtPinCode"] = validateFieldConsumer("txtPinCode", formValuesForConsumer.txtPinCode);
          errors["txtAddress"] = validateFieldConsumer("txtAddress", formValuesForConsumer.txtAddress);
          errors["txtAppointmentDate"] = validateFieldConsumer("txtAppointmentDate", formValuesForConsumer.txtAppointmentDate);
          errors["txtAppointmentSlot"] = validateFieldConsumer("txtAppointmentSlot", formValuesForConsumer.txtAppointmentSlot);
        }
      }

      if (formStateC === "CMPLNT") {
        errors["txtComplaintType"] = validateFieldConsumer("txtComplaintType", formValuesForConsumer.txtComplaintType);

        if (formValuesForConsumer && formValuesForConsumer.txtComplaintType && formValuesForConsumer.txtComplaintType.CommonMasterValueID === 130002) {
          errors["txtOthersComplaintType1"] = validateFieldConsumer("txtOthersComplaintType1", formValuesForConsumer.txtOthersComplaintType1);
        } else if (formValuesForConsumer && formValuesForConsumer.txtComplaintType && formValuesForConsumer.txtComplaintType.CommonMasterValueID === 130001) {
          errors["txtComplaintType1"] = validateFieldConsumer("txtComplaintType1", formValuesForConsumer.txtComplaintType1);
        }
        errors["txtAppoinitmentNo"] = validateFieldConsumer("txtAppoinitmentNo", formValuesForConsumer.txtAppoinitmentNo);
        errors["txtComplaints"] = validateFieldConsumer("txtComplaints", formValuesForConsumer.txtComplaints);
      }
      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      console.log("errors", errors);

      setFormValidationConsumerError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const updateStateForConsumer = (name, value) => {
    debugger;
    if (name === "txtStateForByLocation") {
      setFormValuesForConsumer({
        ...formValuesForConsumer,
        txtStateForByLocation: value,
        txtDistrictForByLocation: null,
        txtSubDistrictForByLocation: null,
        // A txtVillageForByLocation: null,
        txtServiceTypeID: null,
        txtVistingFee: value && value.AgentVisitingFees ? value.AgentVisitingFees : 0,
        txtVillageForByLocation: "",
      });
      setDistrictForByLocationDropdownDataList([]);
      setSubDistrictForByLocationDropdownDataList([]);
      // A setVillageForByLocationDropdownDataList([]);
      setlableTalukAnything("SubDistrict");
      // A setlableVillageForByLocation("Village");
      setServiceTypeDropdownDataList([]);
      setServiceTypeData("");
      if (value) {
        setlableTalukAnything(value.Level4Name ? value.Level4Name : "SubDistrict");
        // A setlableVillageForByLocation(`
        // A Village${value.Level6Name ? ` -  ${value.Level6Name}` : ""}${value.Level5Name ? ` -  ${value.Level5Name}` : ""}
        // A `);

        getDistrictByStateForByLocationListData(value.StateCode);
        getAppointmentSlotListData(value.StateCode);
        getSeviceTypeListData(value.StateCode);
      }
    } else if (name === "txtDistrictForByLocation") {
      setFormValuesForConsumer({
        ...formValuesForConsumer,
        txtDistrictForByLocation: value,
        txtSubDistrictForByLocation: null,
        // A txtVillageForByLocation: null,
        txtVillageForByLocation: "",
      });
      setSubDistrictForByLocationDropdownDataList([]);
      // A setVillageForByLocationDropdownDataList([]);
      if (value) {
        getSubDistrictByStateANDDistrictListData(value.DistrictMasterCode);
      }
    } else if (name === "txtSubDistrictForByLocation") {
      setFormValuesForConsumer({
        ...formValuesForConsumer,
        txtSubDistrictForByLocation: value,
        // A txtVillageForByLocation: null,
        txtVillageForByLocation: "",
      });
      // A setVillageForByLocationDropdownDataList([]);
      if (value) {
        // A getVillageListBYSubDistrictAndDistrictListData(value.SubDistrictCode);
      }
    } else if (name === "txtServiceTypeID") {
      setFormValuesForConsumer({
        ...formValuesForConsumer,
        txtServiceTypeID: value,
        txtServiceFee: "",
        txtDocumentRequired: null,
      });
      setServiceTypeDropdownDataList([]);
      if (value) {
        if (formValuesForConsumer.txtApplicantID !== "") {
          if (formValuesForConsumer.txtAppointmentNo !== "") {
            setFormStateS("SERVC");
            setFormStateC("");
          } else {
            setFormStateR("REGTN");
            setFormStateS("");
            setFormStateC("");
          }
        } else {
          setFormStateR("REGTN");
          setFormStateS("");
          setFormStateC("");
        }
        getDocumentDataList(
          value.ServiceTypeID,
          formValuesForConsumer.txtStateForByLocation && formValuesForConsumer.txtStateForByLocation.StateCode
            ? formValuesForConsumer.txtStateForByLocation.StateCode
            : 0,
          value,
        );
      } else {
        setFormValidationConsumerError({});
        if (formValuesForConsumer.txtApplicantID !== "") {
          if (formValuesForConsumer.txtAppointmentNo !== "") {
            setFormStateS("");
            setFormStateC("CMPLNT");
          } else {
            setFormStateR("REGTN");
            setFormStateS("");
            setFormStateC("");
          }
        } else {
          setFormStateR("REGTN");
          setFormStateS("");
          setFormStateC("");
        }
      }
    } else if (name === "txtComplaintType") {
      setFormValuesForConsumer({
        ...formValuesForConsumer,
        txtComplaintType: value,
        txtComplaintType1: null,
        txtOthersComplaintType1: "",
      });
      setComplaintType1DropdownDataList([]);
      if (value && value.CommonMasterValueID === 130001) {
        getComplaintType1ListData();
      }
    } else if (name === "txtAppointmentDate") {
      setFormValuesForConsumer({
        ...formValuesForConsumer,
        txtAppointmentDate: value,
        txtAppointmentSlot: null,
      });
      const dt = dateToSpecificFormat(moment(), "YYYY-MM-DD");
      if (value !== dt) {
        appointmentslotDropdownDataList.forEach((v) => {
          v.IsExpired = false;
        });
        setAppointmentSlotDropdownDataList(appointmentslotDropdownDataList);
      } else {
        appointmentslotDropdownDataList.forEach((v) => {
          v.IsExpired = v.AppointmentSlotFrom <= moment().format("HH:mm") && v.AppointmentSlotTo <= moment().format("HH:mm");
        });
        setAppointmentSlotDropdownDataList(appointmentslotDropdownDataList);
      }
    } else if (name === "txtDocumentRequired") {
      setFormValuesForConsumer({
        ...formValuesForConsumer,
        txtDocumentRequired: value,
      });
      setFormValidationConsumerError({});
      if (value) {
        if (formValuesForConsumer.txtApplicantID !== "" && formValuesForConsumer.txtAppointmentNo !== "") {
          if (value.label === "Yes") {
            setFormStateS("SERVC");
            setFormStateC("");
            setFormStateR("");
          } else {
            setFormStateS("");
            setFormStateC("CMPLNT");
            setFormStateR("");
            setFormValuesForConsumer({
              ...formValuesForConsumer,
              txtDocumentRequired: value,
              txtServiceFee: "",
            });
          }
        }
      }
    } else {
      setFormValuesForConsumer({
        ...formValuesForConsumer,
        [name]: value,
      });
    }

    formValidationConsumerError[name] = validateFieldConsumer(name, value);
  };

  const [appointmentNoDropdownDataList, setAppointmentNoDropdownDataList] = useState(false);
  const [isLoadingAppointmentNoDropdownDataList, setIsLoadingtAppointmentNoDropdownDataList] = useState(false);
  const getAppointmentNoListData = async () => {
    debugger;
    try {
      setIsLoadingtAppointmentNoDropdownDataList(true);
      const formdata = {
        filterID: 0,
        filterID1: 0,
        filterID2: formValuesMN && formValuesMN.txtMobileNumber ? formValuesMN.txtMobileNumber : "",
        filterID3: "",
        masterName: "APTMNT",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      setIsLoadingtAppointmentNoDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setAppointmentNoDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setAppointmentNoDropdownDataList([]);
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

  const [filterApointmentHistoryDataList, setFilterApointmentHistoryDataList] = useState([]);
  const [isLoadingApointmentHistoryList, setIsLoadingApointmentHistoryList] = useState(false);
  const getApointmentHistoryListData = async () => {
    try {
      const formdata = {
        viewMode: "MOBILE",
        requestorMobileNo: formValuesMN.txtMobileNumber ? formValuesMN.txtMobileNumber : "",
        appointmentNo: "",
        statusID: 0,
        fromdate: "",
        toDate: "",
        userID: 0,
        stateID: 0,
      };
      setIsLoadingApointmentHistoryList(true);
      const result = await getDetailReportDataList(formdata);
      setIsLoadingApointmentHistoryList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          setFilterApointmentHistoryDataList(result.response.responseData.records);
        } else {
          setFilterApointmentHistoryDataList([]);
        }
      } else if (result.response.responseCode !== 1) {
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

  const clearFormControlConsumer = () => {
    debugger;
    setFormValuesMN({
      ...formValuesMN,
      txtValMobileNumber: "",
      txtMobileNumber: "",
    });
    setisApplicantConrolsDisabled(false);
    setisValidationConrolsDisabled(false);
    setFormStateR("");
    setFormStateS("");
    setFormStateC("");
    setFormValuesForConsumer({
      ...formValuesForConsumer,
      txtApplicantID: "",
      txtAppointmentNo: "",
      txtCallerName: "",
      txtApplicantName: "",
      txtAlternateMobileNumber: "",
      txtEmail: "",
      txtServiceTypeID: null,
      txtServiceFee: "",
      txtVistingFee: "",
      txtDocumentRequired: null,
      txtPinCode: "",
      txtAddress: "",
      txtLocationType: null,
      txtStateForByLocation: null,
      txtDistrictForByLocation: null,
      txtSubDistrictForByLocation: null,
      txtVillageForByLocation: "",
      txtLandMark: "",
      txtAppointmentDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
      txtAppointmentSlot: null,
      txtComplaintType: null,
      txtComplaintType1: null,
      txtOthersComplaintType1: "",
      txtAppoinitmentNo: null,
      txtComplaints: "",
    });

    setDistrictForByLocationDropdownDataList([]);
    setSubDistrictForByLocationDropdownDataList([]);
    // A setVillageForByLocationDropdownDataList([]);
    setFormValidationFarmersError({});
    setFormValidationConsumerError({});
    setlableTalukAnything("SubDistrict");
    setDocumentData("");
    setFilterApointmentHistoryDataList([]);
    setServiceTypeData("");
    setarrServiceToMultipleApplicant([]);
  };

  const [isApplicantBtndisabled, setisApplicantBtndisabled] = useState(0);
  const [btnLoaderApplicantActive, setBtnLoaderApplicantActive] = useState(false);
  const ApplicantAddOnClick = async () => {
    try {
      if (!handleValidationConsumer()) {
        return;
      }
      if (serviceTypeData === "") {
        setAlertMessage({
          type: "error",
          message: "Please select service.",
        });
        return;
      }
      const formData = {
        addMode: "MOBILE",
        callerName: formValuesForConsumer.txtCallerName ? formValuesForConsumer.txtCallerName : "",
        applicantName: formValuesForConsumer.txtApplicantName ? formValuesForConsumer.txtApplicantName : "",
        callerContactNumber: formValuesMN.txtValMobileNumber ? formValuesMN.txtValMobileNumber : "",
        applicantContactNumber: formValuesMN.txtMobileNumber ? formValuesMN.txtMobileNumber : "",
        alternateContactNumber: formValuesForConsumer.txtAlternateMobileNumber ? formValuesForConsumer.txtAlternateMobileNumber : "",
        emailID: formValuesForConsumer.txtEmail ? formValuesForConsumer.txtEmail : "",
        categoryID: 101,
        serviceTypeID:
          formValuesForConsumer.txtServiceTypeID && formValuesForConsumer.txtServiceTypeID.ServiceTypeID
            ? Number(formValuesForConsumer.txtServiceTypeID.ServiceTypeID)
            : 0,
        districtMasterCode: formValuesForConsumer.txtDistrictForByLocation.DistrictMasterCode
          ? formValuesForConsumer.txtDistrictForByLocation.DistrictMasterCode
          : 0,
        stateCode: formValuesForConsumer.txtStateForByLocation.StateCode ? formValuesForConsumer.txtStateForByLocation.StateCode : "",
        age: 0,
        gender: 1,
        subDistrictMasterCode: formValuesForConsumer.txtSubDistrictForByLocation.SubDistrictMasterCode
          ? formValuesForConsumer.txtSubDistrictForByLocation.SubDistrictMasterCode
          : 0,
      };
      setBtnLoaderApplicantActive(true);
      setisApplicantBtndisabled(1);
      const result = await addApplicantInDbData(formData);
      setBtnLoaderApplicantActive(false);
      setisApplicantBtndisabled(0);
      if (result.response.responseCode.toString() === "1") {
        if (result.response && result.response.responseData) {
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });
          setFormValuesForConsumer({
            ...formValuesForConsumer,
            txtApplicantID: result.response.responseData.ApplicantID,
          });
          if (formValuesForConsumer && formValuesForConsumer.txtDocumentRequired && formValuesForConsumer.txtDocumentRequired.value === 1) {
            setFormStateR("");
            setFormStateS("SERVC");
            setisValidationConrolsDisabled(true);
            // A setisApplicantConrolsDisabled(true);
          } else if (formValuesForConsumer && formValuesForConsumer.txtDocumentRequired && formValuesForConsumer.txtDocumentRequired.value === 2) {
            setFormStateS("");
            clearFormControlConsumer();
          }
        }
      } else {
        setBtnLoaderApplicantActive(false);
        setisApplicantBtndisabled(0);
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setBtnLoaderApplicantActive(false);
      setisApplicantBtndisabled(0);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const [isServiceBtndisabled, setisServiceBtndisabled] = useState(0);
  const [btnLoaderServiceActive, setBtnLoaderServiceActive] = useState(false);
  const ServiceAddOnClick = async () => {
    debugger;
    try {
      if (!handleValidationConsumer()) {
        return;
      }

      if (serviceTypeData === "") {
        setAlertMessage({
          type: "error",
          message: "Please select service.",
        });
        return;
      }
      // A const arrayServiceData = serviceTypeData.split(",");
      // A const jsonServiceData = [];
      // A for (let i = 0; i < arrayServiceData.length; i += 1) {
      // A  jsonServiceData.push({ ServiceTypeIDID: arrayServiceData[i].toString() });
      // A }
      // A if (jsonServiceData.length > 3) {
      // A  setAlertMessage({
      // A    type: "error",
      // A    message: "Maximum 3 services is allowed at a time.",
      // A  });
      // A  return;
      // A}
      const jsonServiceData = [];
      for (let i = 0; i < arrServiceToMultipleApplicant.length; i += 1) {
        jsonServiceData.push({
          relationTermID: arrServiceToMultipleApplicant[i].relationTermID,
          name: arrServiceToMultipleApplicant[i].name,
          serviceTypeID: arrServiceToMultipleApplicant[i].serviceTypeID,
        });
      }
      const formData = {
        applicantID: formValuesForConsumer && formValuesForConsumer.txtApplicantID ? formValuesForConsumer.txtApplicantID : "",
        villageID: 0,
        village: formValuesForConsumer.txtVillageForByLocation ? formValuesForConsumer.txtVillageForByLocation : "",
        address: formValuesForConsumer.txtAddress ? formValuesForConsumer.txtAddress : "",
        landMark: formValuesForConsumer.txtLandMark ? formValuesForConsumer.txtLandMark : "",
        location: formValuesForConsumer.txtLocationType && formValuesForConsumer.txtLocationType.Location ? formValuesForConsumer.txtLocationType.Location : "",
        pinCode: formValuesForConsumer.txtPinCode ? formValuesForConsumer.txtPinCode : "",
        statusID: 132001,
        appointmentSlotID: formValuesForConsumer.txtAppointmentSlot.AppointmentSlotID ? formValuesForConsumer.txtAppointmentSlot.AppointmentSlotID : 0,
        stateCode: formValuesForConsumer.txtStateForByLocation.StateCode ? formValuesForConsumer.txtStateForByLocation.StateCode : "",
        appointmentDate: formValuesForConsumer.txtAppointmentDate ? dateToCompanyFormat(formValuesForConsumer.txtAppointmentDate) : "",
        visitingFees: formValuesForConsumer.txtVistingFee ? formValuesForConsumer.txtVistingFee : "",
        serviceFees: formValuesForConsumer.txtServiceFee ? formValuesForConsumer.txtServiceFee : "0",
        serviceFlag: jsonServiceData && jsonServiceData.length > 0 && jsonServiceData.length === 1 ? "S" : jsonServiceData.length > 1 ? "M" : "",
        vLE: "",
        description: "",
        // A serviceTypeID: serviceTypeData,
        services: jsonServiceData,
      };
      setBtnLoaderServiceActive(true);
      setisServiceBtndisabled(0);
      // A const result = await addAppointmentData(formData);
      const result = await addAppointmentDetailsData(formData);
      setBtnLoaderServiceActive(false);
      setisServiceBtndisabled(0);
      if (result.response.responseCode.toString() === "1") {
        if (result.response && result.response.responseData) {
          // A setAlertMessage({
          // A  type: "success",
          // A  message: result.response.responseMessage,
          // A });
          clearFormControlConsumer();
          setSessionStorage("servicesuccess", "CA");
          navigate("/ServiceSuccess");
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setBtnLoaderApplicantActive(false);
      setisApplicantBtndisabled(0);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const [isComplaintBtndisabled, setisComplaintBtndisabled] = useState(0);
  const [btnLoaderComplaintActive, setBtnLoaderComplaintActive] = useState(false);
  const ComplaintAddOnClick = async () => {
    debugger;
    try {
      if (!handleValidationConsumer()) {
        return;
      }
      const formData = {
        applicantID: formValuesForConsumer && formValuesForConsumer.txtApplicantID ? formValuesForConsumer.txtApplicantID : "",
        appointmentNo:
          formValuesForConsumer && formValuesForConsumer.txtAppoinitmentNo && formValuesForConsumer.txtAppoinitmentNo.AppointmentNo
            ? formValuesForConsumer.txtAppoinitmentNo.AppointmentNo
            : "",
        masterComplainTypeID:
          formValuesForConsumer && formValuesForConsumer.txtComplaintType && formValuesForConsumer.txtComplaintType.CommonMasterValueID
            ? formValuesForConsumer.txtComplaintType.CommonMasterValueID
            : 0,
        complainTypeID:
          formValuesForConsumer && formValuesForConsumer.txtComplaintType1 && formValuesForConsumer.txtComplaintType1.CommonMasterValueID
            ? formValuesForConsumer.txtComplaintType1.CommonMasterValueID
            : 0,
        otherComplaint: formValuesForConsumer && formValuesForConsumer.txtOthersComplaintType1 ? formValuesForConsumer.txtOthersComplaintType1 : "",
        briefComplaint: formValuesForConsumer && formValuesForConsumer.txtComplaints ? formValuesForConsumer.txtComplaints : "",
        complaintReply: "",
        complaintStatusID: 132001,
      };
      setisComplaintBtndisabled(1);
      setBtnLoaderComplaintActive(true);
      const result = await addComplaintData(formData);
      setisComplaintBtndisabled(0);
      setBtnLoaderComplaintActive(false);
      if (result.response.responseCode.toString() === "1") {
        if (result.response && result.response.responseData) {
          // A setAlertMessage({
          // A  type: "success",
          // A  message: result.response.responseMessage,
          // A });
          clearFormControlConsumer();
          setSessionStorage("servicesuccess", "CC");
          navigate("/ServiceSuccess");
        }
      } else {
        setisComplaintBtndisabled(0);
        setBtnLoaderComplaintActive(false);
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }

      debugger;
    } catch (error) {
      console.log(error);
      setisComplaintBtndisabled(0);
      setBtnLoaderComplaintActive(false);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const getStateForByLocationByStateCodeListData = async (presponseData) => {
    debugger;
    try {
      setIsLoadingStateForByLocationDropdownDataList(true);
      const formdata = {
        filterID: presponseData.StateMasterID,
        filterID1: 0,
        filterID2: "",
        filterID3: "",
        masterName: "DTDSSTATE",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      console.log(result, "State Data");
      setIsLoadingStateForByLocationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setFormValuesForConsumer({
            ...formValuesForConsumer,
            txtApplicantID: presponseData.ApplicantID,
            txtApplicantName: presponseData.ApplicantName,
            txtCallerName: presponseData.CallerName,
            txtAlternateMobileNumber: presponseData.AlternateContactNumber,
            txtEmail: presponseData.EmailID,
            txtStateForByLocation: presponseData.StateCode
              ? {
                  StateMasterName: presponseData.StateMasterName,
                  StateCode: presponseData.StateCode,
                  StateMasterID: presponseData.StateMasterID,
                }
              : null,
            txtDistrictForByLocation: presponseData.DistrictMasterCode
              ? {
                  DistrictMasterName: presponseData.DistrictMasterName,
                  DistrictMasterCode: presponseData.DistrictMasterCode,
                }
              : null,
            txtSubDistrictForByLocation: presponseData.SubDistrictMasterCode
              ? {
                  SubDistrictMasterName: presponseData.SubDistrictMasterName,
                  SubDistrictMasterCode: presponseData.SubDistrictMasterCode,
                }
              : null,
            txtServiceTypeID: null,
            txtServiceFee: "",
            txtVistingFee: result.response.responseData.masterdatabinding[0].AgentVisitingFees,
            txtDocumentRequired: null,
            txtAppointmentNo: presponseData.AppointmentNo,
            txtLocationType: presponseData.LocationID
              ? {
                  Location: presponseData.Location,
                  LocationID: presponseData.LocationID,
                }
              : null,
            txtVillageForByLocation: presponseData.Village,
            txtPinCode: presponseData.PinCode,
            txtAddress: presponseData.Address,
            txtLandMark: presponseData.LandMark,
          });
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

  const [btnLoaderActiveConsumer, setBtnLoaderActiveConsumer] = useState(false);
  const validateConsumerByMobileNumber = async () => {
    debugger;
    if (!handleFarmersValidation()) {
      return;
    }
    try {
      const formData = {
        viewMode: "MOBILE",
        mobilenumber: formValuesMN.txtMobileNumber,
      };
      setBtnLoaderActiveConsumer(true);
      const result = await getApplicantInDbData(formData);
      setBtnLoaderActiveConsumer(false);
      // A clearFormControlConsumer();
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          setFormValuesMN({
            ...formValuesMN,
            txtMobileNumber: result.response.responseData[0].ApplicantContactNumber,
          });
          getStateForByLocationByStateCodeListData(result.response.responseData[0]);
          if (result.response.responseData[0].DocumentRequired === "Y") {
            setFormStateS("SERVC");
            setFormStateC("CMPLNT");
          } else {
            setFormStateS("SERVC");
            setFormStateC("");
          }

          setisValidationConrolsDisabled(true);
          setisApplicantConrolsDisabled(true);
          getSeviceTypeListData(result.response.responseData[0].StateCode);
          getAppointmentSlotListData(result.response.responseData[0].StateCode);
          getAppointmentNoListData();
          getApointmentHistoryListData();
        }
      } else {
        setisValidationConrolsDisabled(true);
        setFormStateR("REGTN");
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Some error",
      });
    }
  };

  const validateConsumerOnClick = () => {
    validateConsumerByMobileNumber();
  };

  useEffect(() => {
    validateConsumerByMobileNumber();
    getStateForByLocationListData();
    getComplaintTypeListData();
    // A getSeviceTypeListData();
    // A getAppointmentSlotListData();
  }, []);

  const [openDocumentModal, setOpenDocumentModal] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const selectDocumentClick = (data) => {
    debugger;
    setSelectedData(data);
    setOpenDocumentModal(!openDocumentModal);
  };

  const updateformState = (type) => {
    debugger;
    if (type === "SelectServc") {
      setFormValidationConsumerError({});
      if (formValuesForConsumer.txtApplicantID !== "") {
        if (formValuesForConsumer.txtAppointmentNo !== "") {
          setFormStateS("SERVC");
          setFormStateC("");
        } else {
          setFormStateR("REGTN");
          setFormStateS("");
          setFormStateC("");
        }
      } else {
        setFormStateR("REGTN");
        setFormStateS("");
        setFormStateC("");
      }
    } else if (type === "UnselectServc") {
      setFormValidationConsumerError({});
      if (formValuesForConsumer.txtApplicantID !== "") {
        if (formValuesForConsumer.txtAppointmentNo !== "") {
          setFormStateS("");
          setFormStateC("CMPLNT");
        } else {
          setFormStateR("REGTN");
          setFormStateS("");
          setFormStateC("");
        }
      } else {
        setFormStateR("REGTN");
        setFormStateS("");
        setFormStateC("");
      }
    }
  };
  const [openMultipleServiceByStateModal, setOpenMultipleServiceByStateModal] = useState(false);
  const toggleMultipleServiceByStateClick = () => {
    debugger;
    if (formValuesForConsumer.txtStateForByLocation === null) {
      setAlertMessage({
        type: "warning",
        message: "Please select state for service.",
      });
      return;
    }
    setOpenMultipleServiceByStateModal(!openMultipleServiceByStateModal);
  };
  const appointmentHistoryStatusCellStyle = (params) => {
    return (
      <div>
        {params.data.StatusID && params.data.StatusID === 133003 ? (
          <div className={BizClass.StatusBox}>
            <span className={BizClass.spanStatusBox} style={{ background: "#05b76c", color: "#ffffff" }}>
              {params.data.STATUS}
            </span>
          </div>
        ) : params.data.StatusID && params.data.StatusID === 133002 ? (
          <div className={BizClass.StatusBox}>
            <span className={BizClass.spanStatusBox} style={{ background: "#fb403f", color: "#ffffff" }}>
              {params.data.STATUS}
            </span>
          </div>
        ) : params.data.StatusID && params.data.StatusID === 133001 ? (
          <div className={BizClass.StatusBox}>
            <span className={BizClass.spanStatusBox} style={{ background: "#fbc326", color: "#17202A" }}>
              Registered
            </span>
          </div>
        ) : params.data.StatusID && params.data.StatusID === 133004 ? (
          <div className={BizClass.StatusBox}>
            <span className={BizClass.spanStatusBox} style={{ background: "#0398fc", color: "#ffffff" }}>
              {params.data.STATUS}
            </span>
          </div>
        ) : params.data.StatusID && params.data.StatusID === 133009 ? (
          <div className={BizClass.StatusBox}>
            <span className={BizClass.spanStatusBox} style={{ background: "#eb232a", color: "#ffffff" }}>
              {params.data.STATUS}
            </span>
          </div>
        ) : params.data.StatusID && params.data.StatusID === 133006 ? (
          <div className={BizClass.StatusBox}>
            <span className={BizClass.spanStatusBox} style={{ background: "#eb232a", color: "#ffffff" }}>
              {params.data.STATUS}
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  return (
    <>
      {openDocumentModal && (
        <ServiceDocumentList
          selectedData={selectedData}
          selectDocumentClick={selectDocumentClick}
          setAlertMessage={setAlertMessage}
          documentList={documentList}
          documentData={documentData}
          setDocumentData={setDocumentData}
        />
      )}
      {openMultipleServiceByStateModal && (
        <MultipleServiceByStatetList
          serviceTypeDropdownDataList={serviceTypeDropdownDataList}
          isLoadingServiceTypeDropdownDataList={isLoadingServiceTypeDropdownDataList}
          toggleMultipleServiceByStateClick={toggleMultipleServiceByStateClick}
          selectedState={
            formValuesForConsumer.txtStateForByLocation && formValuesForConsumer.txtStateForByLocation ? formValuesForConsumer.txtStateForByLocation : null
          }
          serviceTypeData={serviceTypeData}
          setServiceTypeData={setServiceTypeData}
          arrServiceToMultipleApplicant={arrServiceToMultipleApplicant}
          setarrServiceToMultipleApplicant={setarrServiceToMultipleApplicant}
          updateformState={updateformState}
          setFormValuesForConsumer={setFormValuesForConsumer}
          formValuesForConsumer={formValuesForConsumer}
          setAlertMessage={setAlertMessage}
        />
      )}
      <div className={BizClass.Box}>
        {btnLoaderActiveConsumer ? <Loader /> : null}
        <div className={BizClass.Div}>
          <div className={BizClass.FormDiv}>
            <div className={BizClass.InfoDiv}>
              <div className={BizClass.FarmerInfoDiv}>
                <div className={BizClass.Title}>
                  <h3>Caller Info</h3>
                </div>
                <div className={BizClass.Content}>
                  <div className={BizClass.Form_One}>
                    <Form.Group controlwidth="60%">
                      <Form.InputGroup label="Caller Contact No" column={1} errorMsg={formValidationFarmersError["txtValMobileNumber"]}>
                        <Form.InputControl
                          control="input"
                          name="txtValMobileNumber"
                          autoComplete="off"
                          value={formValuesMN.txtValMobileNumber}
                          minLength={10}
                          maxLength={10}
                          onChange={(e) => updateStateMN("txtValMobileNumber", e.target.value.replace(/\D/g, ""))}
                          focus="true"
                          ref={mobileNoSelect}
                          disabled={isValidationConrolsDisabled}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Applicant Contact No" req="true" column={1} errorMsg={formValidationFarmersError["txtMobileNumber"]}>
                        <Form.InputControl
                          control="input"
                          name="txtMobileNumber"
                          autoComplete="off"
                          value={formValuesMN.txtMobileNumber}
                          minLength={10}
                          maxLength={10}
                          onChange={(e) => updateStateMN("txtMobileNumber", e.target.value.replace(/\D/g, ""))}
                          disabled={isValidationConrolsDisabled}
                        />
                        {isValidationConrolsDisabled === false ? (
                          <MdPersonSearch
                            style={{ cursor: "pointer", display: "none" }}
                            trigger={btnLoaderActiveConsumer && "true"}
                            onClick={() => validateConsumerOnClick()}
                          />
                        ) : null}
                      </Form.InputGroup>
                    </Form.Group>
                  </div>
                  <div className={BizClass.Title}>
                    <h3>Registration</h3>
                  </div>
                  <div className={BizClass.Form_One_Other}>
                    <Form.Group controlwidth="60%">
                      <Form.InputGroup label="Caller Name" req="true" column={1} errorMsg={formValidationConsumerError["txtCallerName"]}>
                        <Form.InputControl
                          control="input"
                          name="txtCallerName"
                          maxLength={30}
                          value={formValuesForConsumer.txtCallerName}
                          autoComplete="off"
                          onChange={(e) => updateStateForConsumer("txtCallerName", e.target.value)}
                          disabled={isApplicantConrolsDisabled}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Applicant Name" req="true" column={1} errorMsg={formValidationConsumerError["txtApplicantName"]}>
                        <Form.InputControl
                          control="input"
                          name="txtApplicantName"
                          maxLength={30}
                          value={formValuesForConsumer.txtApplicantName}
                          autoComplete="off"
                          onChange={(e) => updateStateForConsumer("txtApplicantName", e.target.value)}
                          disabled={isApplicantConrolsDisabled}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Alternate Conatct No" req="false" column={1} errorMsg={formValidationConsumerError["txtAlternateMobileNumber"]}>
                        <Form.InputControl
                          control="input"
                          name="txtAlternateMobileNumber"
                          value={formValuesForConsumer.txtAlternateMobileNumber}
                          autoComplete="off"
                          minLength={10}
                          maxLength={10}
                          onChange={(e) => updateStateForConsumer("txtAlternateMobileNumber", e.target.value.replace(/\D/g, ""))}
                          disabled={isApplicantConrolsDisabled}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Email ID" req="false" column={1} errorMsg={formValidationConsumerError["txtEmail"]}>
                        <Form.InputControl
                          control="input"
                          name="txtEmail"
                          maxLength={30}
                          value={formValuesForConsumer.txtEmail}
                          autoComplete="off"
                          onChange={(e) => updateStateForConsumer("txtEmail", e.target.value)}
                          disabled={isApplicantConrolsDisabled}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup req="true" label="State" column={1} errorMsg={formValidationConsumerError["txtStateForByLocation"]}>
                        <Form.InputControl
                          control="select"
                          prefix={false}
                          label="Select State"
                          type="text"
                          name="txtStateForByLocation"
                          value={formValuesForConsumer.txtStateForByLocation}
                          options={stateForByLocationDropdownDataList}
                          loader={isLoadingStateForByLocationDropdownDataList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.StateMasterName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForConsumer("txtStateForByLocation", e)}
                          isDisabled={isApplicantConrolsDisabled}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup req="true" label="District" column={1} errorMsg={formValidationConsumerError["txtDistrictForByLocation"]}>
                        <Form.InputControl
                          control="select"
                          type="text"
                          prefix={false}
                          label="Select District"
                          name="txtDistrictForByLocation"
                          value={formValuesForConsumer.txtDistrictForByLocation}
                          options={districtForByLocationDropdownDataList}
                          loader={isLoadingDistrictForByLocationDropdownDataList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.DistrictMasterName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForConsumer("txtDistrictForByLocation", e)}
                          isDisabled={isApplicantConrolsDisabled}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup req="true" label="Sub-District" column={1} errorMsg={formValidationConsumerError["txtSubDistrictForByLocation"]}>
                        <Form.InputControl
                          control="select"
                          type="text"
                          prefix={false}
                          label={lableTalukAnything}
                          name="txtSubDistrictForByLocation"
                          value={formValuesForConsumer.txtSubDistrictForByLocation}
                          options={subDistrictForByLocationDropdownDataList}
                          loader={isLoadingSubDistrictForByLocationDropdownDataList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.SubDistrictMasterName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForConsumer("txtSubDistrictForByLocation", e)}
                          isDisabled={isApplicantConrolsDisabled}
                        />
                      </Form.InputGroup>
                      {/* A this ddl service control not in use */}
                      <Form.InputGroup req="true" label="" column={1} errorMsg={formValidationConsumerError["txtServiceTypeID"]} style={{ display: "none" }}>
                        <Form.InputControl
                          style={{ display: "none" }}
                          control="selectBigOptions"
                          type="text"
                          name="txtServiceTypeID"
                          // A inputValue={ServiceInputSearch}
                          // A onInputChange={(e) => {
                          // A  if (e !== null) {
                          // A    SelectTypeState(e);
                          // A  }
                          // A }}
                          getOptionLabel={(option) => `${option.ServiceName}`}
                          value={formValuesForConsumer.txtServiceTypeID}
                          getOptionValue={(option) => `${option}`}
                          options={serviceTypeDropdownDataList}
                          isLoading={isLoadingServiceTypeDropdownDataList}
                          onChange={(e) => updateStateForConsumer("txtServiceTypeID", e)}
                        />
                        {/* <Form.InputGroup req="true" label="Service" column={1} errorMsg={formValidationConsumerError["txtServiceTypeID"]}>
                        <Form.InputControl
                          control="select"
                          label="Service "
                          name="txtServiceTypeID"
                          value={formValuesForConsumer.txtServiceTypeID}
                          options={serviceTypeDropdownDataList}
                          loader={isLoadingServiceTypeDropdownDataList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.ServiceName}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForConsumer("txtServiceTypeID", e)}
                        /> */}
                        {formValuesForConsumer && formValuesForConsumer.txtServiceTypeID && formValuesForConsumer.txtServiceTypeID !== null ? (
                          <RiFileList3Line
                            onClick={() =>
                              selectDocumentClick(formValuesForConsumer && formValuesForConsumer.txtServiceTypeID ? formValuesForConsumer.txtServiceTypeID : 0)
                            }
                          />
                        ) : null}
                      </Form.InputGroup>
                      {/* A this ddl service control not in use */}
                      <Form.InputGroup label="Visting Fee" req="true" errorMsg={formValidationConsumerError["txtVistingFee"]}>
                        <Form.InputControl
                          control="input"
                          type="text"
                          name="txtVistingFee"
                          autoComplete="off"
                          value={formValuesForConsumer.txtVistingFee}
                          disabled={true}
                          onChange={(e) =>
                            updateStateForConsumer(
                              e.target.name,
                              e.target.value
                                .replace(/(^[\d]{10})[\d]/g, "$1")
                                .replace(/[^\d.]/g, "")
                                .replace(/(\..*)\./g, "$1")
                                .replace(/(\.[\d]{2})./g, "$1"),
                            )
                          }
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Department Fee" req="true" errorMsg={formValidationConsumerError["txtServiceFee"]}>
                        <Form.InputControl
                          control="input"
                          type="text"
                          name="txtServiceFee"
                          autoComplete="off"
                          value={formValuesForConsumer.txtServiceFee}
                          disabled={true}
                          onChange={(e) =>
                            updateStateForConsumer(
                              e.target.name,
                              e.target.value
                                .replace(/(^[\d]{10})[\d]/g, "$1")
                                .replace(/[^\d.]/g, "")
                                .replace(/(\..*)\./g, "$1")
                                .replace(/(\.[\d]{2})./g, "$1"),
                            )
                          }
                        />
                        <GrUserSettings style={{ cursor: "pointer" }} onClick={() => toggleMultipleServiceByStateClick()} />
                      </Form.InputGroup>
                      <Form.InputGroup req="true" label="Document Available" column={1} errorMsg={formValidationConsumerError["txtDocumentRequired"]}>
                        <Form.InputControl
                          control="select"
                          label="Document Available"
                          name="txtDocumentRequired"
                          value={formValuesForConsumer.txtDocumentRequired}
                          options={documentRequiredList}
                          getOptionLabel={(option) => `${option.label}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForConsumer("txtDocumentRequired", e)}
                        />
                      </Form.InputGroup>
                    </Form.Group>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={BizClass.ValidateFormFooterRight}>
            {formStateR === "REGTN" ? (
              <Button
                className={BizClass.FormFooterButton}
                disabled={isApplicantBtndisabled}
                trigger={btnLoaderApplicantActive && "true"}
                onClick={() => ApplicantAddOnClick()}
              >
                Submit
              </Button>
            ) : null}
            <Button style={{ display: "none" }} className={BizClass.FormFooterButton} onClick={() => clearFormControlConsumer()}>
              Clear All
            </Button>
          </div>
        </div>
        <div
          className={
            formValuesForConsumer && formValuesForConsumer.txtDocumentRequired && formValuesForConsumer.txtDocumentRequired.value === 2
              ? classNames(BizClass.Div, BizClass.disableDivService)
              : formValuesForConsumer && formValuesForConsumer.txtDocumentRequired && formValuesForConsumer.txtDocumentRequired.value === 1
              ? BizClass.Div
              : classNames(BizClass.Div, BizClass.disableDivService)
          }
        >
          <div className={BizClass.FormDiv}>
            <div className={BizClass.InfoDiv}>
              <div className={BizClass.FarmerInfoDiv}>
                <div className={BizClass.Title}>
                  <h3>Service</h3>
                </div>
                <div className={BizClass.Content}>
                  <div className={BizClass.Form_One_Other}>
                    <Form.Group controlwidth="65%">
                      <Form.InputGroup req="true" label="Location Type" column={1} errorMsg={formValidationConsumerError["txtLocationType"]}>
                        <Form.InputControl
                          control="select"
                          label="Location Type"
                          name="txtLocationType"
                          value={formValuesForConsumer.txtLocationType}
                          options={locationTypeList}
                          getOptionLabel={(option) => `${option.Location}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForConsumer("txtLocationType", e)}
                        />
                      </Form.InputGroup>
                      {/* <Form.InputGroup req="true" label="Village/Ward" column={1}>
                        <Form.InputControl
                          control="select"
                          type="text"
                          prefix={false}
                          label={lableVillageForByLocation}
                          name="txtVillageForByLocation"
                          value={formValuesForConsumer.txtVillageForByLocation}
                          options={villageForByLocationDropdownDataList}
                          loader={isLoadingVillageForByLocationDropdownDataList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.level_7_name}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForConsumer("txtVillageForByLocation", e)}
                        />
                      </Form.InputGroup> */}
                      <Form.InputGroup req="true" label="Village/Ward" column={1} errorMsg={formValidationConsumerError["txtVillageForByLocation"]}>
                        <Form.InputControl
                          control="input"
                          type="text"
                          name="txtVillageForByLocation"
                          value={formValuesForConsumer.txtVillageForByLocation}
                          autoComplete="off"
                          maxLength={100}
                          onChange={(e) => updateStateForConsumer("txtVillageForByLocation", e.target.value)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup req="true" label="PinCode" column={1} errorMsg={formValidationConsumerError["txtPinCode"]}>
                        <Form.InputControl
                          control="input"
                          type="text"
                          name="txtPinCode"
                          value={formValuesForConsumer.txtPinCode}
                          autoComplete="off"
                          maxLength={6}
                          minLength={6}
                          onChange={(e) => updateStateForConsumer("txtPinCode", e.target.value.replace(/\D/g, ""))}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup column={1} row={3} label="Address" req="true" errorMsg={formValidationConsumerError["txtAddress"]}>
                        <Form.InputControl
                          control="textarea"
                          name="txtAddress"
                          value={formValuesForConsumer.txtAddress}
                          maxLength="70"
                          onChange={(e) => updateStateForConsumer("txtAddress", e.target.value)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Landmark" column={1} req="false" row={3}>
                        <Form.InputControl
                          control="textarea"
                          row="5"
                          maxLength="70"
                          name="txtLandMark"
                          value={formValuesForConsumer.txtLandMark}
                          onChange={(e) => updateStateForConsumer("txtLandMark", e.target.value)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup req="true" label="Appointment Date" column={1} errorMsg={formValidationConsumerError["txtAppointmentDate"]}>
                        <Form.InputControl
                          control="input"
                          type="date"
                          name="txtAppointmentDate"
                          value={formValuesForConsumer.txtAppointmentDate}
                          onChange={(e) => updateStateForConsumer("txtAppointmentDate", e.target.value)}
                          min={moment().subtract(0, "days").format("YYYY-MM-DD")}
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup req="true" label="Appointment Slot" column={1} errorMsg={formValidationConsumerError["txtAppointmentSlot"]}>
                        <Form.InputControl
                          control="select"
                          type="text"
                          prefix={false}
                          label="Appointment Slot"
                          name="txtAppointmentSlot"
                          value={formValuesForConsumer.txtAppointmentSlot}
                          options={appointmentslotDropdownDataList}
                          loader={isLoadingAppointmentSlotDropdownDataList ? <Loader /> : null}
                          getOptionLabel={(option) => `${option.AppointmentSlot}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForConsumer("txtAppointmentSlot", e)}
                          isOptionDisabled={(option) => option.IsExpired === true}
                        />
                      </Form.InputGroup>
                    </Form.Group>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={BizClass.ValidateFormFooterRight}>
            {formStateS === "SERVC" ? (
              <Button
                className={BizClass.FormFooterButton}
                disabled={isServiceBtndisabled}
                trigger={btnLoaderServiceActive && "true"}
                onClick={() => ServiceAddOnClick()}
              >
                Submit
              </Button>
            ) : null}
          </div>
        </div>
        <div className={formStateC === "CMPLNT" ? BizClass.Div : classNames(BizClass.Div, BizClass.disableDivService)}>
          <div className={BizClass.FormDiv}>
            <div className={BizClass.InfoDiv}>
              <div className={BizClass.FarmerInfoDiv}>
                <div className={BizClass.Title}>
                  <h3>Grievance</h3>
                </div>
                <div className={BizClass.Content}>
                  <div className={BizClass.Form_One_Other}>
                    <Form.Group controlwidth="65%">
                      <Form.InputGroup req="true" label="Complaint Type" column={1} errorMsg={formValidationConsumerError["txtComplaintType"]}>
                        <Form.InputControl
                          control="select"
                          label="Complaint Type"
                          name="txtComplaintType"
                          value={formValuesForConsumer.txtComplaintType}
                          loader={isLoadingtComplaintTypeDropdownDataList ? <Loader /> : null}
                          options={complaintTypeDropdownDataList}
                          getOptionLabel={(option) => `${option.CommonMasterValue}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForConsumer("txtComplaintType", e)}
                        />
                      </Form.InputGroup>

                      {formValuesForConsumer &&
                      formValuesForConsumer.txtComplaintType &&
                      formValuesForConsumer.txtComplaintType.CommonMasterValueID &&
                      formValuesForConsumer.txtComplaintType.CommonMasterValueID === 130002 ? (
                        <Form.InputGroup req="true" label="Complaint Type 1" column={1} errorMsg={formValidationConsumerError["txtOthersComplaintType1"]}>
                          <Form.InputControl
                            control="input"
                            label=""
                            name="txtOthersComplaintType1"
                            value={formValuesForConsumer.txtOthersComplaintType1}
                            onChange={(e) => updateStateForConsumer("txtOthersComplaintType1", e.target.value)}
                          />
                        </Form.InputGroup>
                      ) : (formValuesForConsumer &&
                          formValuesForConsumer.txtComplaintType &&
                          formValuesForConsumer.txtComplaintType.CommonMasterValueID &&
                          formValuesForConsumer.txtComplaintType.CommonMasterValueID === 130001) ||
                        formValuesForConsumer.txtComplaintType === null ? (
                        <Form.InputGroup req="true" label="Complaint Type 1" column={1} errorMsg={formValidationConsumerError["txtComplaintType1"]}>
                          <Form.InputControl
                            control="select"
                            label="Complaint Type 1"
                            name="txtComplaintType1"
                            value={formValuesForConsumer.txtComplaintType1}
                            loader={isLoadingtComplaintType1DropdownDataList ? <Loader /> : null}
                            options={complaintType1DropdownDataList}
                            getOptionLabel={(option) => `${option.CommonMasterValue}`}
                            getOptionValue={(option) => `${option}`}
                            onChange={(e) => updateStateForConsumer("txtComplaintType1", e)}
                          />
                        </Form.InputGroup>
                      ) : null}

                      <Form.InputGroup req="true" label="Appoinitment No" column={1} errorMsg={formValidationConsumerError["txtAppoinitmentNo"]}>
                        <Form.InputControl
                          control="select"
                          label="Appoinitment No"
                          name="txtAppoinitmentNo"
                          value={formValuesForConsumer.txtAppoinitmentNo}
                          loader={isLoadingAppointmentNoDropdownDataList ? <Loader /> : null}
                          options={appointmentNoDropdownDataList}
                          getOptionLabel={(option) => `${option.AppointmentNo}`}
                          getOptionValue={(option) => `${option}`}
                          onChange={(e) => updateStateForConsumer("txtAppoinitmentNo", e)}
                        />
                      </Form.InputGroup>
                      <Form.InputGroup label="Complaints" req="true" column={1} row={5} errorMsg={formValidationConsumerError["txtComplaints"]}>
                        <Form.InputControl
                          control="textarea"
                          row="5"
                          maxLength="500"
                          name="txtComplaints"
                          value={formValuesForConsumer.txtComplaints}
                          onChange={(e) => updateStateForConsumer("txtComplaints", e.target.value)}
                        />
                      </Form.InputGroup>
                    </Form.Group>
                  </div>
                </div>
                <div className={BizClass.Title}>
                  <h3>Appointment History</h3>
                </div>
                <div className={BizClass.AppointmentHistoryDataGrid}>
                  <DataGrid
                    rowData={filterApointmentHistoryDataList}
                    loader={isLoadingApointmentHistoryList ? <Loader /> : false}
                    cellRenderer="actionTemplate"
                    frameworkComponents={{
                      // A cellTemplate,
                      appointmentHistoryStatusCellStyle,
                    }}
                  >
                    <DataGrid.Column field="AppointmentNo" headerName="Appointment No." width="160px" />
                    <DataGrid.Column field="#" headerName="Status" width="90px" cellRenderer="appointmentHistoryStatusCellStyle" />
                    <DataGrid.Column
                      field="AppointmentDate"
                      headerName="Appointment Date"
                      width="150px"
                      valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
                    />
                    <DataGrid.Column field="CallerName" headerName="Caller Name" width="160px" />
                    <DataGrid.Column field="ApplicantName" headerName="Applicant Name" width="160px" />
                    <DataGrid.Column field="ApplicantContactNumber" headerName="Contact Number" width="140px" />
                    <DataGrid.Column field="EmailID" headerName="Email ID" width="170px" />
                    <DataGrid.Column field="StateMasterName" headerName="State" width="160px" />
                    <DataGrid.Column field="DistrictMasterName" headerName="District" width="160px" />
                    <DataGrid.Column field="SubDistrictMasterName" headerName="Sub District" width="165px" />
                    <DataGrid.Column field="Location" headerName="Location" width="90px" />
                    <DataGrid.Column field="Village" headerName="Village" width="140px" />
                    <DataGrid.Column field="PinCode" headerName="Pincode" width="90px" />
                    <DataGrid.Column field="Address" headerName="Address" width="220px" />
                  </DataGrid>
                </div>
              </div>
            </div>
          </div>
          <div className={BizClass.ValidateFormFooterRight}>
            {formStateC === "CMPLNT" ? (
              <Button
                className={BizClass.FormFooterButton}
                disabled={isComplaintBtndisabled}
                trigger={btnLoaderComplaintActive && "true"}
                onClick={() => ComplaintAddOnClick()}
              >
                Submit
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default ServiceActivity;
