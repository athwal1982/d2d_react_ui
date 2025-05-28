import { React, useState } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat, dateToCompanyFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getUserRightCodeAccess, getSessionStorage } from "Components/Common/Login/Auth/auth";
// A import { FaInfoCircle } from "react-icons/fa";
import { RiFileList3Line } from "react-icons/ri";
import { MdAssignment } from "react-icons/md";
import { ImUserCheck } from "react-icons/im";
import { GrUserSettings, GrSchedules } from "react-icons/gr";
// A import { getApplicantInDbData } from "./Service/Method";
import * as XLSX from "xlsx";
import { getDTDSMasterDataBindingDataList, getVLEData, getVLEAppointmentData, mapAppointmentData, getApplicantDetailsData } from "./Service/Method";
import { getDetailReportDataList } from "../Reports/Service/Method";
import CreateService from "./Modal/CreateService";
import BizClass from "./D2DServcie.module.scss";
import HeaderPortal from "../../Layout/HeaderPortal/HeaderPortal";
import ApplicantDetails from "./Modal/ApplicantDetails";
import AssignedDocumentList from "./Modal/AssignedDocumentList";
import AssignedServiceList from "./Modal/AssignedServiceList";
import VLEMapping from "./Modal/VLEMapping";
import AssignedVLEDetails from "./Modal/AssignedVLEDetails";
import RescheduleAppointment from "./Modal/RescheduleAppointment";

const cellTemplate = (props) => {
  const dt = dateToSpecificFormat(moment(), "YYYY-MM-DD");
  const currentDate = new Date(dt);
  const appointntmentDate = new Date(props.data.AppointmentDate);
  const userData = getSessionStorage("user");
  const ChkAppAccessTypeID = userData && userData.AppAccessTypeID ? userData.AppAccessTypeID.toString() : "0";
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      {props.data.StatusID && props.data.StatusID !== 133001 ? (
        <>
          <RiFileList3Line
            title="Service Documents"
            style={{ fontSize: "16px", color: "#34495E", cursor: "pointer", display: "none" }}
            onClick={() => props.toggleDocumentListClick(props.data)}
          />
          <GrUserSettings
            title="Service List"
            style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
            onClick={() => props.toggleServiceListClick(props.data)}
          />
        </>
      ) : null}
      {props.data.StatusID && props.data.StatusID === 133003 ? (
        <ImUserCheck
          title="Assigned VLE Details"
          style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
          onClick={() => props.toggleVLEAssignedDetailsClick(props.data)}
        />
      ) : null}
      {props.data.StatusID && props.data.StatusID === 133002 && ChkAppAccessTypeID === "503" ? (
        appointntmentDate < currentDate ? null : (
          <MdAssignment
            title={props.data.VLEMapAuto === "YES" ? "VLE Assign Auto" : props.data.VLEMapAuto === "NO" ? "VLE Assign Manual" : ""}
            style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
            onClick={() => props.toggleVLEAssignClick(props.data)}
          />
        )
      ) : null}
      {props.data.StatusID && props.data.StatusID === 133009 && ChkAppAccessTypeID === "503" ? (
        <GrSchedules
          title="Reschedule The Appointment"
          style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
          onClick={() => props.toggleRescheduleAppointmentClick(props.data)}
        />
      ) : null}
    </div>
  );
};

const customerStatusCellStyle = (params) => {
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
      ) : params.data.StatusID && params.data.StatusID === 133007 ? (
        <div className={BizClass.StatusBox}>
          <span className={BizClass.spanStatusBox} style={{ background: "#5cb85c", color: "#ffffff" }}>
            {params.data.STATUS}
          </span>
        </div>
      ) : params.data.StatusID && params.data.StatusID === 133008 ? (
        <div className={BizClass.StatusBox}>
          <span className={BizClass.spanStatusBox} style={{ background: "#eb7b9a", color: "#ffffff" }}>
            {params.data.STATUS}
          </span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

function D2DService() {
  debugger;
  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");
  const ChkAppAccessTypeID = userData && userData.AppAccessTypeID ? userData.AppAccessTypeID.toString() : "0";
  // A const activityStatusFilterData = [
  //  A  { Name: "Open", Value: 109301 },
  //  A  { Name: "Resolved", Value: 109303 },
  // A ];
  // A const [searchFormValues, setSearchFormValues] = useState({
  // A  txtEmployeeFilter: null,
  // A  txtActivityStatusFilter: null,
  // A });

  // A const updateSearchFormState = (name, value) => {
  // A  setSearchFormValues({ ...searchFormValues, [name]: value });
  // };

  const [serviceHeaderCounterDataList, setServiceHeaderCounterDataList] = useState([]);
  const [filterServiceDataList, setFilterServiceDataList] = useState([]);
  const [isLoadingServiceList, setIsLoadingServiceList] = useState(false);

  const [showHideColumn, setShowHideColumn] = useState(false);
  const searchByoptionsStatus = [
    { value: "133003", label: "Scheduled" },
    { value: "133002", label: "Pending" },
    { value: "133004", label: "Reschedule" },
    { value: "133001", label: "Registered" },
    { value: "133009", label: "Cancel" },
    { value: "133007", label: "Completed" },
  ];

  const searchByoptionsFilter = [
    { value: "1", label: "Mobile No" },
    { value: "2", label: "Appointment No" },
  ];

  const [filterValues, setFilterValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    SearchByFilter: null,
    txtSearchFilterStatus: { value: "133002", label: "Pending" },
    txtSearchFilter: "",
  });

  const [serviceGridApi, setServiceGridApi] = useState();
  const onServiceGridReady = (params) => {
    setServiceGridApi(params.api);
  };

  // A const [searchServiceText, setsearchServiceText] = useState("");
  const onSearchService = (val) => {
    // A setsearchServiceText(val);
    serviceGridApi.setQuickFilter(val);
    serviceGridApi.refreshCells();
  };

  const updateFilterState = (name, value) => {
    setFilterValues({ ...filterValues, [name]: value });
    if (name === "txtSearchFilter") {
      onSearchService(value);
    }
  };
  const [addFormServcie, setaddFormService] = useState(false);
  const OpenAddFormService = () => {
    debugger;
    setaddFormService(!addFormServcie);
  };

  const [selectedApplicant, setSelectedApplicant] = useState();
  const [applicantDetailsPopup, setApplicantDetailsPopup] = useState(false);
  const toggleApplicantDetailsModal = (data) => {
    debugger;
    setSelectedApplicant(data);
    setApplicantDetailsPopup(!applicantDetailsPopup);
  };

  const [documentList, setDocumentList] = useState([]);
  const [openDocumentModal, setOpenDocumentModal] = useState(false);
  const toggleDocumentListClick = async (data) => {
    debugger;
    if (data) {
      try {
        const formdata = {
          filterID: 0,
          filterID1: 0,
          filterID2: data && data.AppointmentNo ? data.AppointmentNo : "",
          filterID3: "",
          masterName: "APLDCTYP",
          searchText: "#ALL",
          searchCriteria: "AW",
        };
        const result = await getDTDSMasterDataBindingDataList(formdata);

        if (result.response.responseCode === 1) {
          if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
            setDocumentList(result.response.responseData.masterdatabinding);
          } else {
            setDocumentList([]);
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
    }
    setOpenDocumentModal(!openDocumentModal);
  };

  function sortByProperty(property) {
    return function (a, b) {
      if (a[property] > b[property]) return 1;
      if (a[property] < b[property]) return -1;
      return 0;
    };
  }

  const [selectedApplointment, setSelectedApplointment] = useState();
  const updateVLEData = (selectedApointmentData) => {
    debugger;
    setSelectedApplointment(selectedApointmentData);
    if (serviceGridApi) {
      const itemsToUpdate = [];
      serviceGridApi.forEachNode(function (rowNode) {
        if (rowNode.data.AppointmentNo === selectedApointmentData.AppointmentNo) {
          itemsToUpdate.push(selectedApointmentData);
          rowNode.setData(selectedApointmentData);
        }
      });
      serviceGridApi.updateRowData({
        update: itemsToUpdate,
      });
      console.log(itemsToUpdate);
    }
  };
  const syncAppointmentData = async (pdata) => {
    try {
      const formdata = {
        viewMode: "SYNC",
        mobileNumber: selectedApplicant && selectedApplicant.ApplicantContactNumber ? selectedApplicant.ApplicantContactNumber : "",
        appointmentNo: pdata && pdata.AppointmentNo ? pdata.AppointmentNo : "",
      };
      debugger;
      const result = await getApplicantDetailsData(formdata);
      if (result.response.responseCode === 1) {
        setIsLoadingServiceList(false);
        console.log(result.response.responseMessage);
      } else if (result.response.responseCode !== 1) {
        setIsLoadingServiceList(false);
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingServiceList(false);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const handleAssign = async (pdata, ptoAssignVLEData) => {
    debugger;
    try {
      const formdata = {
        vLEMasterID: ptoAssignVLEData[0].cscId ? ptoAssignVLEData[0].cscId : "",
        appointmentNo: pdata.AppointmentNo ? pdata.AppointmentNo : "",
        appointmentSlotID: pdata.AppointmentSlotID ? pdata.AppointmentSlotID : 0,
        appointmentDate: pdata.AppointmentDate ? dateToCompanyFormat(pdata.AppointmentDate) : "",
        vLEName: ptoAssignVLEData[0].vleName ? ptoAssignVLEData[0].vleName : "",
        contactNumber: ptoAssignVLEData[0].mobile ? ptoAssignVLEData[0].mobile : "",
        description: "",
        emailID: ptoAssignVLEData[0].email ? ptoAssignVLEData[0].email : "",
        locationType: ptoAssignVLEData[0].locationType ? ptoAssignVLEData[0].locationType : "",
        statusID: 133003,
        districtMasterCode: ptoAssignVLEData[0].distCode ? ptoAssignVLEData[0].distCode : 0,
        stateCode: ptoAssignVLEData[0].stateCode ? ptoAssignVLEData[0].stateCode : 0,
        pinCode: ptoAssignVLEData[0].pinCode ? ptoAssignVLEData[0].pinCode : "",
        panchayat: ptoAssignVLEData[0].panchayat ? ptoAssignVLEData[0].panchayat : "",
        village: ptoAssignVLEData[0].village ? ptoAssignVLEData[0].village : "",
        nagarPalikaPanchayat: ptoAssignVLEData[0].nagarPalikaPanchayat ? ptoAssignVLEData[0].nagarPalikaPanchayat : "",
        subDistName: ptoAssignVLEData[0].subDistName ? ptoAssignVLEData[0].subDistName : "",
        wardName: ptoAssignVLEData[0].wardName ? ptoAssignVLEData[0].wardName : "",
        vLEAddress: ptoAssignVLEData[0].vleAddress ? ptoAssignVLEData[0].vleAddress : "",
      };
      const result = await mapAppointmentData(formdata);
      if (result.response.responseCode.toString() === "1") {
        pdata.StatusID = 133003;
        pdata.STATUS = "Scheduled";
        updateVLEData(pdata);
        syncAppointmentData(pdata);
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
      } else {
        setIsLoadingServiceList(false);
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      setIsLoadingServiceList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getVLEAppointmentDataList = async (pvLEMasterIDs, pVLEData, pdata) => {
    try {
      const formdata = {
        viewMode: "SELECT",
        vLEMasterID: pvLEMasterIDs,
        appointmentDate: pdata.AppointmentDate ? dateToCompanyFormat(pdata.AppointmentDate) : "",
        appointmentSlotID: pdata.AppointmentSlotID ? pdata.AppointmentSlotID : 0,
      };
      const result = await getVLEAppointmentData(formdata);
      if (result.response.responseCode.toString() === "1") {
        const toAssignVLEData = [];
        pVLEData.forEach((v) => {
          result.response.responseData.forEach((x) => {
            if (v.cscId === x.vle) {
              toAssignVLEData.push({
                AllotedAppointment: x.AllotedAppointment ? x.AllotedAppointment : "",
                cscId: v.cscId && v.cscId !== "null" ? v.cscId : "",
                vleName: v.vleName && v.vleName !== "null" ? v.vleName : "",
                mobile: v.mobile && v.mobile !== "null" ? v.mobile : "",
                email: v.email && v.email !== "null" ? v.email : "",
                locationType: v.locationType && v.locationType !== "null" ? v.locationType : "",
                stateName: v.stateName && v.stateName !== "null" ? v.stateName : "",
                distCode: v.distCode && v.distCode !== "null" ? v.distCode : "",
                distName: v.distName && v.distName !== "null" ? v.distName : "",
                stateCode: v.stateCode && v.stateCode !== "null" ? v.stateCode : "",
                subDistName: v.subDistName && v.subDistName !== "null" ? v.subDistName : "",
                stateCode: v.stateCode && v.stateCode !== "null" ? v.stateCode : "",
                village: v.village && v.village !== "null" ? v.village : "",
                nagar_Palika_OR_Panchayat: v.nagar_Palika_OR_Panchayat && v.nagar_Palika_OR_Panchayat !== "null" ? v.nagar_Palika_OR_Panchayat : "",
                panchayat: v.panchayat && v.panchayat !== "null" ? v.panchayat : "",
                wardName: v.wardName && v.wardName !== "null" ? v.wardName : "",
                vleTxnId: v.vleTxnId && v.vleTxnId !== "null" ? v.vleTxnId : "",
                pinCode: v.pinCode && v.pinCode !== "null" ? v.pinCode : "",
                vleAddress: v.vleAddress && v.vleAddress !== "null" ? v.vleAddress : "",
              });
            }
          });
        });
        toAssignVLEData.sort(sortByProperty("AllotedAppointment"));
        toAssignVLEData.sort(sortByProperty("vleName"));
        handleAssign(pdata, toAssignVLEData);
      } else {
        setIsLoadingServiceList(false);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      setIsLoadingServiceList(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const handleSearchClick = async (data) => {
    debugger;
    try {
      const dt = dateToSpecificFormat(moment(), "YYYY-MM-DD");
      if (dateToCompanyFormat(data.AppointmentDate) === dt) {
        if (data.AppointmentSlotFrom <= moment().format("HH:mm") && data.AppointmentSlotTo <= moment().format("HH:mm")) {
          setAlertMessage({
            type: "error",
            message: "Appointment slot is expired.",
          });
          return;
        }
      }
      setIsLoadingServiceList(true);
      const valtxnId = moment().format("DDMMYYYYHH") + Math.floor(1000 + Math.random() * 9000);
      const valts = moment().format("YYYY-MM-DD'T'HH:mm:ss.SSS");
      const formdata = {
        appName: "d2d",
        pinCode: data.PinCode ? data.PinCode : "",
        stateName: data.StateMasterName ? data.StateMasterName : "",
        distName: data.DistrictMasterName ? data.DistrictMasterName : "",
        loc_type: data && data.Location && data.Location === "URBAN" ? "U" : data.Location === "RURAL" ? "R" : "",
        txnId: valtxnId,
        ts: valts,
      };
      const result = await getVLEData(formdata);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.length > 0) {
          const VLEResponseData = Object.values(JSON.parse(result.response.responseData));
          const VLEData = [];
          VLEResponseData.forEach((v) => {
            if (Array.isArray(v)) {
              VLEData.push(v[0]);
            }
          });
          const VLEMasterIDs = VLEData.map((data) => {
            return data.cscId;
          }).join(",");
          getVLEAppointmentDataList(VLEMasterIDs, VLEData, data);
        }
      } else {
        setIsLoadingServiceList(false);
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setIsLoadingServiceList(false);
      setAlertMessage({
        type: "error",
        message: error.message,
      });
    }
  };

  const [openVLEAssignModal, setOpenVLEAssignModal] = useState(false);
  const toggleVLEAssignClick = (data) => {
    debugger;
    if (data) {
      if (data.VLEMapAuto === "YES") {
        setSelectedApplointment(data);
        handleSearchClick(data);
      } else if (data.VLEMapAuto === "NO") {
        setSelectedApplointment(data);
        setOpenVLEAssignModal(!openVLEAssignModal);
      }
    } else {
      setOpenVLEAssignModal(!openVLEAssignModal);
    }
  };

  const [openRescheduleAppointmentModal, setOpenRescheduleAppointmentModal] = useState(false);
  const toggleRescheduleAppointmentClick = (data) => {
    debugger;
    setSelectedApplointment(data);
    setOpenRescheduleAppointmentModal(!openRescheduleAppointmentModal);
  };

  const [openVLEAssignedDetailsModal, setOpenVLEAssignedDetailsModal] = useState(false);
  const toggleVLEAssignedDetailsClick = (data) => {
    setSelectedApplointment(data);
    setOpenVLEAssignedDetailsModal(!openVLEAssignedDetailsModal);
  };
  const [openServiceModal, setOpenServiceModal] = useState(false);
  const toggleServiceListClick = (data) => {
    debugger;
    setSelectedApplointment(data);
    setOpenServiceModal(!openServiceModal);
  };

  const getServiceListData = async (message) => {
    debugger;
    if (filterValues.txtFromDate > filterValues.txtToDate) {
      setAlertMessage({
        type: "warning",
        message: "From Date must be less than to To Date",
      });
      return;
    }
    if (filterValues.txtSearchFilterStatus === null && filterValues.SearchByFilter === null) {
      setAlertMessage({
        type: "error",
        message: "Please select either status, mobile no. or appointment no.",
      });
      return;
    }
    if (filterValues.txtSearchFilterStatus !== null && filterValues.SearchByFilter !== null) {
      setAlertMessage({
        type: "error",
        message: "Please select either status, mobile no. or appointment no.",
      });
      return;
    }
    let apppointmentNoVal = "";
    let mobileNoVal = "";
    let pviewTYP = "";

    if (filterValues.txtSearchFilterStatus !== null) {
      pviewTYP = "STATUS";
      setFilterValues({
        ...filterValues,
        txtSearchFilter: "",
      });
      onSearchService("");
    }

    if (filterValues.SearchByFilter) {
      if (filterValues.SearchByFilter.value === "1") {
        const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
        if (filterValues.txtSearchFilter.length === 0) {
          setAlertMessage({
            type: "error",
            message: "Please enter mobile No.",
          });
          return;
        }

        if (!regex.test(filterValues.txtSearchFilter)) {
          setAlertMessage({
            type: "error",
            message: "Please enter Valid mobile no.",
          });
          return;
        }
        if (filterValues.txtSearchFilter.length < 10 || filterValues.txtSearchFilter.length > 10) {
          setAlertMessage({
            type: "error",
            message: "Please enter Valid 10 digit mobile no.",
          });
          return;
        }

        mobileNoVal = filterValues.txtSearchFilter;
        pviewTYP = "MOBILE";
      } else if (filterValues.SearchByFilter.value === "2") {
        if (filterValues.txtSearchFilter.length === 0) {
          setAlertMessage({
            type: "error",
            message: "Please enter appointment no.",
          });
          return;
        }
        apppointmentNoVal = filterValues.txtSearchFilter;
        pviewTYP = "APPNTMNT";
      }
    }
    try {
      const formdata = {
        viewMode: pviewTYP,
        requestorMobileNo: mobileNoVal,
        appointmentNo: apppointmentNoVal,
        statusID: filterValues.txtSearchFilterStatus && filterValues.txtSearchFilterStatus.value ? filterValues.txtSearchFilterStatus.value : 0,
        fromdate: filterValues.txtFromDate ? dateToCompanyFormat(filterValues.txtFromDate) : "",
        toDate: filterValues.txtToDate ? dateToCompanyFormat(filterValues.txtToDate) : "",
        userID: userData && userData.LoginID ? userData.LoginID : 0,
        stateID: 0,
      };
      debugger;
      setIsLoadingServiceList(true);
      const result = await getDetailReportDataList(formdata);
      setIsLoadingServiceList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          setServiceHeaderCounterDataList(result.response.responseData.dashbard);
          setFilterServiceDataList(result.response.responseData.records);
          if (
            filterValues &&
            filterValues.txtSearchFilterStatus &&
            filterValues.txtSearchFilterStatus.value &&
            filterValues.txtSearchFilterStatus.value !== "133001"
          ) {
            setShowHideColumn(false);
          } else {
            setShowHideColumn(true);
          }
        } else {
          setServiceHeaderCounterDataList([]);
          setFilterServiceDataList([]);
        }
      } else if (result.response.responseCode !== 1) {
        if (message) {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };
  // A const getServiceListData = async (message) => {
  // A  try {
  // A    const formdata = {
  // A      viewMode: "LIST",
  // A      mobilenumber: "",
  // A    };
  // A    debugger;
  // A    setIsLoadingServiceList(true);
  // A    const result = await getApplicantInDbData(formdata);
  // A    setIsLoadingServiceList(false);
  // A    if (result.response.responseCode === 1) {
  // A      if (result.response.responseData) {
  // A        if (result.response.responseData && result.response.responseData.length > 0) {
  // A          setServiceDataList(result.response.responseData);
  // A          const filterData = result.response.responseData.filter((data) => {
  // A            return data && data.AppointmentNo && data.AppointmentNo !== null;
  // A         });
  // A          setFilterServiceDataList(filterData);
  // A          console.log(serviceDataList);
  // A        } else {
  // A          setServiceDataList([]);
  // A          setFilterServiceDataList([]);
  // A       }
  // A      } else {
  // A        setAlertMessage({
  // A          type: "error",
  // A          message: result.response.responseMessage,
  // A        });
  // A      }
  // A    } else if (result.response.responseCode !== 1) {
  // A      if (message) {
  // A        setAlertMessage({
  // A          type: "error",
  // A          message: result.response.responseMessage,
  // A        });
  // A      }
  // A    }
  // A  } catch (error) {
  // A    console.log(error);
  // A    setAlertMessage({
  // A      type: "error",
  // A      message: "Something went Wrong! Error Code : 442",
  // A    });
  // A  }
  // A };
  // A const viewEnquiryRight = getUserRightCodeAccess("ke74");
  // A const addEnqiryRight = getUserRightCodeAccess("bo1h");
  const viewServiceRight = getUserRightCodeAccess("d2ds");
  const getRowStyle = (params) => {
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.data.IsSelected) {
      return { background: "#ffc176" };
    }
    return { background: "" };
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = [
      { width: 25 },
      { width: 25 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 35 },
      { width: 50 },
    ];
    XLSX.writeFile(workbook, "D2D_Service.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const exportClick = () => {
    if (filterServiceDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      AppointmentNo: "Appointment No",
      AppointmentDate: "Appointment Date",
      AppointmentSlot: "Appointment Slot",
      ServiceFees: "Department Fee",
      VisitingFees: "Visiting Fee",
      STATUS: "Status",
      CallerName: "Caller Name",
      ApplicantName: "Applicant Name",
      CallerContactNumber: "Contact Number",
      EmailID: "Email ID",
      StateMasterName: "State",
      DistrictMasterName: "District",
      SubDistrictMasterName: "Sub District",
      Location: "Location",
      Village: "Village",
      PinCode: "Pincode",
      Address: "Address",
    };
    const mappedData = filterServiceDataList.map((value) => {
      return {
        AppointmentNo: value.AppointmentNo,
        AppointmentDate: value.AppointmentDate ? dateToSpecificFormat(value.AppointmentDate, "DD-MM-YYYY") : "",
        AppointmentSlot: value.AppointmentSlotFrom && value.AppointmentSlotTo ? `${value.AppointmentSlotFrom} - ${value.AppointmentSlotTo}` : "",
        ServiceFees: value.ServiceFees,
        VisitingFees: value.VisitingFees,
        STATUS: value.STATUS,
        CallerName: value.CallerName,
        ApplicantName: value.ApplicantName,
        CallerContactNumber: value.CallerContactNumber,
        EmailID: value.EmailID,
        StateMasterName: value.StateMasterName,
        DistrictMasterName: value.DistrictMasterName,
        SubDistrictMasterName: value.SubDistrictMasterName,
        Location: value.Location,
        Village: value.Village,
        PinCode: value.PinCode,
        Address: value.Address,
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  return (
    <>
      {openDocumentModal && <AssignedDocumentList toggleDocumentListClick={toggleDocumentListClick} documentList={documentList} />}
      {openServiceModal && (
        <AssignedServiceList selectedApplointment={selectedApplointment} toggleServiceListClick={toggleServiceListClick} setAlertMessage={setAlertMessage} />
      )}
      {openVLEAssignModal && (
        <VLEMapping
          toggleVLEAssignClick={toggleVLEAssignClick}
          selectedApplicant={selectedApplicant}
          selectedApplointment={selectedApplointment}
          updateVLEData={updateVLEData}
          setAlertMessage={setAlertMessage}
        />
      )}
      {openRescheduleAppointmentModal && (
        <RescheduleAppointment
          toggleRescheduleAppointmentClick={toggleRescheduleAppointmentClick}
          selectedApplicant={selectedApplicant}
          selectedApplointment={selectedApplointment}
          updateVLEData={updateVLEData}
          setAlertMessage={setAlertMessage}
        />
      )}
      {openVLEAssignedDetailsModal && (
        <AssignedVLEDetails
          toggleVLEAssignedDetailsClick={toggleVLEAssignedDetailsClick}
          selectedApplointment={selectedApplointment}
          setAlertMessage={setAlertMessage}
        />
      )}
      {applicantDetailsPopup ? (
        <ApplicantDetails toggleApplicantDetailsModal={toggleApplicantDetailsModal} selectedApplicant={selectedApplicant} setAlertMessage={setAlertMessage} />
      ) : (
        ""
      )}
      {addFormServcie ? <CreateService OpenAddFormService={OpenAddFormService} setAlertMessage={setAlertMessage} /> : ""}
      <div className={BizClass.BizPageStart}>
        <HeaderPortal>
          <PageBar.Input
            ControlTxt="From Date"
            control="input"
            type="date"
            name="txtFromDate"
            value={filterValues.txtFromDate}
            onChange={(e) => updateFilterState("txtFromDate", e.target.value)}
          />
          <PageBar.Input
            ControlTxt="To Date"
            control="input"
            type="date"
            name="txtToDate"
            value={filterValues.txtToDate}
            onChange={(e) => updateFilterState("txtToDate", e.target.value)}
          />
          <PageBar.Select
            ControlTxt="Search By"
            name="txtSearchFilterStatus"
            getOptionLabel={(option) => `${option.label}`}
            getOptionValue={(option) => `${option}`}
            options={searchByoptionsStatus}
            value={filterValues.txtSearchFilterStatus}
            onChange={(e) => updateFilterState("txtSearchFilterStatus", e)}
          />
          <PageBar.Select
            ControlTxt="Search By"
            name="SearchByFilter"
            getOptionLabel={(option) => `${option.label}`}
            getOptionValue={(option) => `${option}`}
            options={searchByoptionsFilter}
            value={filterValues.SearchByFilter}
            onChange={(e) => updateFilterState("SearchByFilter", e)}
          />
          {viewServiceRight ? (
            <>
              {" "}
              {/* <PageBar.Search onClick={() => getServiceListData(true)} value={searchServiceText} onChange={(e) => onSearchService(e.target.value)} />{" "} */}
              <PageBar.Search
                placeholder="Search "
                name="txtSearchFilter"
                value={filterValues.txtSearchFilter}
                onChange={(e) => updateFilterState(e.target.name, e.target.value)}
                onClick={() => getServiceListData()}
                style={{ width: "158px" }}
              />
            </>
          ) : null}
          {ChkAppAccessTypeID !== "503" ? (
            <PageBar.ExcelButton onClick={() => exportClick()} disabled={filterServiceDataList.length === 0}>
              Export
            </PageBar.ExcelButton>
          ) : null}
          {/* {addEnqiryRight ? (
            <>
              <PageBar.Button onClick={() => OpenAddFormService()} style={{ display: "none" }}>
                Create
              </PageBar.Button>{" "}
            </>
          ) : null} */}
        </HeaderPortal>

        {viewServiceRight ? (
          <>
            <div className={BizClass.PageBar}>
              <div className={BizClass.ticketCounterBar}>
                {serviceHeaderCounterDataList && serviceHeaderCounterDataList.length > 0 ? (
                  serviceHeaderCounterDataList.map((x) => {
                    return (
                      <>
                        <span>{x.CommonMasterValue} :</span>
                        <p>{x.Total}</p>
                      </>
                    );
                  })
                ) : (
                  <>
                    <span>Scheduled :</span>
                    <p>0</p>
                    <span>Pending :</span>
                    <p>0</p>
                    <span>Rescheduled :</span>
                    <p>0</p>
                    <span>Total Appointment :</span>
                    <p>0</p>
                  </>
                )}
              </div>
            </div>
            <div className={BizClass.DataGrid}>
              <DataGrid
                rowData={filterServiceDataList}
                loader={isLoadingServiceList ? <Loader /> : false}
                getRowStyle={getRowStyle}
                onGridReady={onServiceGridReady}
                cellRenderer="actionTemplate"
                frameworkComponents={{
                  cellTemplate,
                  customerStatusCellStyle,
                }}
              >
                <DataGrid.Column
                  headerName="Action"
                  lockPosition="1"
                  pinned="left"
                  width={80}
                  cellRenderer="cellTemplate"
                  cellRendererParams={{
                    toggleApplicantDetailsModal,
                    toggleDocumentListClick,
                    toggleServiceListClick,
                    toggleVLEAssignClick,
                    toggleVLEAssignedDetailsClick,
                    toggleRescheduleAppointmentClick,
                  }}
                  hide={showHideColumn}
                />
                <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
                {/* <DataGrid.Column field="Category" headerName="Call Category" width="140px" /> */}
                <DataGrid.Column field="AppointmentNo" headerName="Appointment No." width="155px" hide={showHideColumn} />
                <DataGrid.Column
                  field="AppointmentDate"
                  headerName="Appointment Date"
                  hide={showHideColumn}
                  width="150px"
                  valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
                />
                <DataGrid.Column
                  field="#"
                  headerName="Appointment Slot"
                  hide={showHideColumn}
                  width="150px"
                  valueGetter={(node) => {
                    return node.data.AppointmentSlotFrom && node.data.AppointmentSlotTo
                      ? `${node.data.AppointmentSlotFrom} - ${node.data.AppointmentSlotTo}`
                      : "";
                  }}
                />
                <DataGrid.Column field="ServiceFees" headerName="Department Fee" width="140px" hide={showHideColumn} type="rightAligned" />
                <DataGrid.Column field="VisitingFees" headerName="Visiting Fee" width="110px" hide={showHideColumn} type="rightAligned" />
                <DataGrid.Column field="#" headerName="Status" width="90px" cellRenderer="customerStatusCellStyle" />
                <DataGrid.Column field="CallerName" headerName="Caller Name" width="160px" />
                <DataGrid.Column field="ApplicantName" headerName="Applicant Name" width="160px" />
                <DataGrid.Column field="ApplicantContactNumber" headerName="Contact Number" width="140px" />
                <DataGrid.Column field="EmailID" headerName="Email ID" width="170px" />
                <DataGrid.Column field="StateMasterName" headerName="State" width="160px" />
                <DataGrid.Column field="DistrictMasterName" headerName="District" width="160px" />
                <DataGrid.Column field="SubDistrictMasterName" headerName="Sub District" width="165px" />
                <DataGrid.Column field="Location" headerName="Location" width="90px" hide={showHideColumn} />
                <DataGrid.Column field="Village" headerName="Village" width="140px" hide={showHideColumn} />
                <DataGrid.Column field="PinCode" headerName="Pincode" width="90px" hide={showHideColumn} />
                <DataGrid.Column field="Address" headerName="Address" width="220px" hide={showHideColumn} />
              </DataGrid>
            </div>{" "}
          </>
        ) : (
          <div style={{ "text-align": "center" }}>You are not authorized to view appointment list</div>
        )}
      </div>
    </>
  );
}

export default D2DService;
