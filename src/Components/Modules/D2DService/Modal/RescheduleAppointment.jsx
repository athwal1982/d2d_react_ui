import React, { useState, useEffect } from "react";
import { Form, DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader, Button } from "Framework/Components/Widgets";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { dateToCompanyFormat, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { PropTypes } from "prop-types";
import { getDTDSMasterDataBindingDataList, mapAppointmentData, getVLEData, getVLEAppointmentData, getApplicantDetailsData } from "../Service/Method";
import BizClass from "../D2DServcie.module.scss";

function RescheduleAppointment({ toggleRescheduleAppointmentClick, selectedApplicant, selectedApplointment, updateVLEData, setAlertMessage }) {
  console.log(selectedApplicant);
  const [formValidationError, setFormValidationError] = useState({});
  const [formValueSearch, setFormValuesSearch] = useState({
    txtState: selectedApplointment && selectedApplointment.StateMasterName ? selectedApplointment.StateMasterName : "",
    txtDistrict: selectedApplointment && selectedApplointment.DistrictMasterName ? selectedApplointment.DistrictMasterName : "",
    txtPinCode: selectedApplointment && selectedApplointment.PinCode ? selectedApplointment.PinCode : "",
    txtAppointmentDate:
      selectedApplointment && selectedApplointment.AppointmentDate ? dateToSpecificFormat(selectedApplointment.AppointmentDate, "DD-MM-YYYY") : "",
    txtAppointmentSlot:
      selectedApplointment && selectedApplointment.AppointmentSlotFrom && selectedApplointment.AppointmentSlotTo && selectedApplointment.AppointmentSlotID
        ? `${selectedApplointment.AppointmentSlotFrom} - ${selectedApplointment.AppointmentSlotTo}`
        : null,
    txtReAppointmentDate: dateToSpecificFormat(moment(), "YYYY-MM-DD"),
    txtReAppointmentSlot: null,
  });

  const validateField = (name, value) => {
    let errorsMsg = "";

    if (name === "txtState") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "State is required!";
      }
    }
    if (name === "txtDistrict") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "District is required!";
      }
    }
    if (name === "txtReAppointmentDate") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Re-Appointment Date is required!";
      }
    }
    if (name === "txtReAppointmentSlot") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Re-Appointment Slot is required!";
      }
    }
    if (name === "txtPinCode") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Pincode is required!";
      } else if (value) {
        if (value.length < 6) {
          errorsMsg = "Enter Valid 6 digit Pincode!";
        }
      }
    }
    return errorsMsg;
  };
  const handleValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;

      errors["txtState"] = validateField("txtState", formValueSearch.txtState);
      errors["txtDistrict"] = validateField("txtDistrict", formValueSearch.txtDistrict);
      errors["txtPinCode"] = validateField("txtPinCode", formValueSearch.txtPinCode);
      errors["txtReAppointmentDate"] = validateField("txtReAppointmentDate", formValueSearch.txtReAppointmentDate);
      errors["txtReAppointmentSlot"] = validateField("txtReAppointmentSlot", formValueSearch.txtReAppointmentSlot);
      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      console.log("errors", errors);

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

  const [appointmentslotDropdownDataList, setAppointmentSlotDropdownDataList] = useState(false);
  const [isLoadingAppointmentSlotDropdownDataList, setIsLoadingAppointmentSlotDropdownDataList] = useState(false);
  const getAppointmentSlotListData = async () => {
    debugger;
    try {
      setIsLoadingAppointmentSlotDropdownDataList(true);
      const formdata = {
        filterID: selectedApplointment && selectedApplointment.StateCode ? selectedApplointment.StateCode : "",
        filterID1: 0,
        filterID2: "",
        filterID3: "",
        // A masterName: "SLOT",
        masterName: "NSLOT",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
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

  const [vLEList, setVLEList] = useState([]);
  const getVLEAppointmentDataList = async (pvLEMasterIDs, pVLEData) => {
    try {
      const formdata = {
        viewMode: "SELECT",
        vLEMasterID: pvLEMasterIDs,
        appointmentDate: formValueSearch.txtAppointmentDate ? dateToCompanyFormat(formValueSearch.txtAppointmentDate) : "",
        appointmentSlotID: formValueSearch.txtAppointmentSlot.AppointmentSlotID ? formValueSearch.txtAppointmentSlot.AppointmentSlotID : 0,
      };
      const result = await getVLEAppointmentData(formdata);
      if (result.response.responseCode.toString() === "1") {
        const toAssignVLEData = [];
        pVLEData.forEach((v) => {
          result.response.responseData.forEach((x) => {
            if (v.cscId === x.vle) {
              toAssignVLEData.push({
                AllotedAppointment: x.AllotedAppointment,
                cscId: v.cscId,
                vleName: v.vleName,
                mobile: v.mobile,
                email: v.email,
                locationType: v.locationType,
                stateName: v.stateName,
                distCode: v.distCode,
                distName: v.distName,
                stateCode: v.stateCode,
                pinCode: v.pinCode,
                vleAddress: v.vleAddress,
              });
            }
          });
        });
        setVLEList(toAssignVLEData);
      } else {
        setVLEList([]);
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [isLoadingVLEList, setIsLoadingVLEList] = useState(false);
  const handleSearchClick = async (e) => {
    debugger;
    try {
      if (e) e.preventDefault();
      if (!handleValidation()) {
        return;
      }
      const dt = dateToSpecificFormat(moment(), "YYYY-MM-DD");
      const currentDate = new Date(dt);
      const appointntmentDate = new Date(formValueSearch.txtReAppointmentDate);
      if (appointntmentDate < currentDate) {
        setVLEList([]);
        setAlertMessage({
          type: "error",
          message: "Re-Appointment date must be greater than current date or equal to current date.",
        });
        return;
      }
      if (formValueSearch.txtReAppointmentDate === dt) {
        if (
          formValueSearch.txtReAppointmentSlot.AppointmentSlotFrom <= moment().format("HH:mm") &&
          formValueSearch.txtReAppointmentSlot.AppointmentSlotTo <= moment().format("HH:mm")
        ) {
          setVLEList([]);
          setAlertMessage({
            type: "error",
            message: "Re-Appointment slot is expired.",
          });
          return;
        }
      }
      setIsLoadingVLEList(true);
      const valtxnId = moment().format("DDMMYYYYHH") + Math.floor(1000 + Math.random() * 9000);
      const valts = moment().format("YYYY-MM-DD'T'HH:mm:ss.SSS");
      const formdata = {
        appName: "d2d",
        pinCode: formValueSearch.txtPinCode ? formValueSearch.txtPinCode : "",
        stateName: formValueSearch.txtState ? formValueSearch.txtState : "",
        distName: formValueSearch.txtDistrict ? formValueSearch.txtDistrict : "",
        // A appointDate: formValueSearch.txtAppointmentDate ? dateToSpecificFormat(formValueSearch.txtAppointmentDate, "DDMMYY") : "",
        // A appointSlot:
        //  A  formValueSearch.txtAppointmentSlot && formValueSearch.txtAppointmentSlot.AppointmentSlotFrom
        // A    ? formValueSearch.txtAppointmentSlot.AppointmentSlotFrom
        //  A   : "",
        txnId: valtxnId,
        ts: valts,
      };
      const result = await getVLEData(formdata);
      setIsLoadingVLEList(false);
      setVLEList([]);
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
          getVLEAppointmentDataList(VLEMasterIDs, VLEData);
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
        message: error.message,
      });
    }
  };

  const updateStateSearch = (name, value) => {
    debugger;
    setFormValuesSearch({
      ...formValueSearch,
      [name]: value,
    });
    if (name === "txtReAppointmentDate") {
      setFormValuesSearch({
        ...formValueSearch,
        txtReAppointmentDate: value,
        txtReAppointmentSlot: null,
      });
      setVLEList([]);
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
    }
    formValidationError[name] = validateField(name, value);
  };

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const [searchTextVLE, setSearchTextVLE] = useState("");
  const onSearchVLE = (val) => {
    debugger;
    setSearchTextVLE(val);
    gridApi.setQuickFilter(val);
  };

  // A useEffect(() => {
  // A   debugger;
  // A   getStateListData();
  // A }, []);

  useEffect(() => {
    getAppointmentSlotListData();
  }, []);

  const syncAppointmentData = async () => {
    try {
      const formdata = {
        viewMode: "SYNC",
        mobileNumber: selectedApplicant && selectedApplicant.ApplicantContactNumber ? selectedApplicant.ApplicantContactNumber : "",
        appointmentNo: selectedApplointment && selectedApplointment.AppointmentNo ? selectedApplointment.AppointmentNo : "",
      };
      debugger;
      const result = await getApplicantDetailsData(formdata);
      if (result.response.responseCode === 1) {
        console.log(result.response.responseMessage);
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

  const getSelectedRowData = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleAssign = async () => {
    debugger;
    try {
      const checkedItem = getSelectedRowData();
      if (checkedItem.length === 0) {
        setAlertMessage({
          type: "warning",
          message: "Please select atleast one VLE.",
        });
        return;
      }
      setBtnLoaderActive(true);
      const formdata = {
        vLEMasterID: checkedItem[0].cscId ? checkedItem[0].cscId : "",
        appointmentNo: selectedApplointment && selectedApplointment.AppointmentNo ? selectedApplointment.AppointmentNo : "",
        appointmentSlotID: formValueSearch.txtReAppointmentSlot.AppointmentSlotID ? formValueSearch.txtReAppointmentSlot.AppointmentSlotID : 0,
        appointmentDate: formValueSearch.txtReAppointmentDate ? dateToCompanyFormat(formValueSearch.txtReAppointmentDate) : "",
        vLEName: checkedItem[0].vleName ? checkedItem[0].vleName : "",
        contactNumber: checkedItem[0].mobile ? checkedItem[0].mobile : "",
        description: "",
        emailID: checkedItem[0].email ? checkedItem[0].email : "",
        locationType: checkedItem[0].locationType ? checkedItem[0].locationType : "",
        statusID: 133004,
        districtMasterCode: checkedItem[0].distCode ? checkedItem[0].distCode : 0,
        stateCode: checkedItem[0].stateCode ? checkedItem[0].stateCode : 0,
        pinCode: checkedItem[0].pinCode ? checkedItem[0].pinCode : "",
        vLEAddress: checkedItem[0].vleAddress ? checkedItem[0].vleAddress : "",
      };
      const result = await mapAppointmentData(formdata);
      setBtnLoaderActive(false);
      if (result.response.responseCode.toString() === "1") {
        selectedApplointment.StatusID = 133004;
        selectedApplointment.STATUS = "Re-Scheduled";
        updateVLEData(selectedApplointment);
        syncAppointmentData();
        setAlertMessage({
          type: "success",
          message: result.responseMessage,
        });
        toggleRescheduleAppointmentClick();
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
      setBtnLoaderActive(false);
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getRowStyle = (params) => {
    if (Number(params.data.ScheduleLimit) === Number(params.data.Scheduled)) {
      return { background: "#cc081b", color: "#ffffff" };
    }
    if (Number(params.data.ScheduleLimit) - Number(params.data.Scheduled) === 1) {
      return { background: "#d5a10e", color: "#ffffff" };
    }
    if (params.data.IsSelected) {
      return { background: "#ffc176" };
    }
    return { background: "" };
  };

  return (
    <Modal
      style={{ zIndex: "999999999" }}
      varient="center"
      title={`Reschedule Appointment : Appointment No(${selectedApplointment.AppointmentNo ? selectedApplointment.AppointmentNo : ""})`}
      right={0}
      width="62vw"
      height="100vh"
      show={toggleRescheduleAppointmentClick}
    >
      <Modal.Body>
        <div className={BizClass.VLESearch}>
          <div className={BizClass.VLESearchTitle}>
            <h3>Search VLE</h3>
          </div>
          <div className={BizClass.VLECard}>
            <Form.Group column={2} controlwidth="100%">
              <Form.InputGroup req="true" label="Appointment Date" errorMsg={formValidationError["txtAppointmentDate"]}>
                <Form.InputControl
                  control="input"
                  type="text"
                  name="txtAppointmentDate"
                  value={formValueSearch.txtAppointmentDate}
                  autoComplete="off"
                  onChange={(e) => updateStateSearch("txtAppointmentDate", e.target.value)}
                  disabled={true}
                />
              </Form.InputGroup>
              <Form.InputGroup req="true" label="Appointment Slot" errorMsg={formValidationError["txtAppointmentSlot"]}>
                <Form.InputControl
                  control="input"
                  type="text"
                  name="txtAppointmentSlot"
                  value={formValueSearch.txtAppointmentSlot}
                  autoComplete="off"
                  onChange={(e) => updateStateSearch("txtAppointmentSlot", e.target.value)}
                  disabled={true}
                />
              </Form.InputGroup>
              <Form.InputGroup req="true" label="State" errorMsg={formValidationError["txtState"]}>
                <Form.InputControl
                  control="input"
                  type="text"
                  name="txtState"
                  value={formValueSearch.txtState}
                  autoComplete="off"
                  onChange={(e) => updateStateSearch("txtState", e.target.value)}
                  disabled={true}
                />
              </Form.InputGroup>
              <Form.InputGroup req="true" label="District" errorMsg={formValidationError["txtDistrict"]}>
                <Form.InputControl
                  control="input"
                  type="text"
                  name="txtDistrict"
                  value={formValueSearch.txtDistrict}
                  autoComplete="off"
                  onChange={(e) => updateStateSearch("txtDistrict", e.target.value)}
                  disabled={true}
                />
              </Form.InputGroup>
              <Form.InputGroup req="true" label="Pincode" errorMsg={formValidationError["txtPinCode"]}>
                <Form.InputControl
                  control="input"
                  type="text"
                  name="txtPinCode"
                  value={formValueSearch.txtPinCode}
                  autoComplete="off"
                  maxLength={6}
                  minLength={6}
                  onChange={(e) => updateStateSearch("txtPinCode", e.target.value.replace(/\D/g, ""))}
                  disabled={true}
                />
              </Form.InputGroup>
              <Form.InputGroup req="true" label="Re-Appointment Date" column={1} errorMsg={formValidationError["txtReAppointmentDate"]}>
                <Form.InputControl
                  control="input"
                  type="date"
                  name="txtReAppointmentDate"
                  value={formValueSearch.txtReAppointmentDate}
                  onChange={(e) => updateStateSearch("txtReAppointmentDate", e.target.value)}
                  min={moment().subtract(0, "days").format("YYYY-MM-DD")}
                  onKeyDown={(e) => e.preventDefault()}
                />
              </Form.InputGroup>
              <Form.InputGroup req="true" label="Re-Appointment Slot" column={1} errorMsg={formValidationError["txtReAppointmentSlot"]}>
                <Form.InputControl
                  control="select"
                  type="text"
                  prefix={false}
                  label="Appointment Slot"
                  name="txtReAppointmentSlot"
                  value={formValueSearch.txtReAppointmentSlot}
                  options={appointmentslotDropdownDataList}
                  loader={isLoadingAppointmentSlotDropdownDataList ? <Loader /> : null}
                  getOptionLabel={(option) => `${option.AppointmentSlot}`}
                  getOptionValue={(option) => `${option}`}
                  onChange={(e) => updateStateSearch("txtReAppointmentSlot", e)}
                  isOptionDisabled={(option) => option.IsExpired === true}
                />
              </Form.InputGroup>
            </Form.Group>
            <div className={BizClass.VLESearchFooterRight}>
              <Button className={BizClass.VLESearchFooterButton} onClick={(e) => handleSearchClick(e)}>
                Search
              </Button>
            </div>
          </div>
          <div className={BizClass.VLESearchTitle}>
            <h3>VLE Details</h3>
          </div>
          <div className={BizClass.VLEGrid}>
            <PageBar>
              <PageBar.Search value={searchTextVLE} onChange={(e) => onSearchVLE(e.target.value)} />
            </PageBar>
            <DataGrid
              rowData={vLEList}
              loader={isLoadingVLEList ? <Loader /> : null}
              onGridReady={onGridReady}
              getRowStyle={getRowStyle}
              suppressRowClickSelection={true}
              rowSelection="single"
            >
              <DataGrid.Column
                lockPosition="1"
                pinned="left"
                headerName="Select"
                field=""
                width={75}
                checkboxSelection={(param) => {
                  return Number(param.data.ScheduleLimit) !== Number(param.data.Scheduled);
                }}
              />
              <DataGrid.Column field="#" headerName="Sr No." width={75} valueGetter="node.rowIndex + 1" pinned="left" />
              <DataGrid.Column field="ScheduleLimit" headerName="Scheduled Limit" width={135} cellStyle={{ "text-align": "right" }} />
              <DataGrid.Column field="Scheduled" headerName="Scheduled" width={105} cellStyle={{ "text-align": "right" }} />
              <DataGrid.Column field="vleName" headerName="VLE Name" width={180} />
              <DataGrid.Column field="mobile" headerName="Mobile" width={100} />
              <DataGrid.Column field="email" headerName="Email ID" width={195} />
              <DataGrid.Column
                field="locationType"
                headerName="Location Type"
                width={125}
                valueGetter={(node) => {
                  return node.data && node.data.locationType && node.data.locationType === "U" ? "URBAN" : node.data.locationType === "R" ? "RURAL" : "";
                }}
              />
              <DataGrid.Column field="stateName" headerName="State" width={160} />
              <DataGrid.Column field="distName" headerName="District" width={160} />
              <DataGrid.Column field="pinCode" headerName="Pincode" width={100} />
              <DataGrid.Column field="vleAddress" headerName="Address" width={240} />
            </DataGrid>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="Button" varient="danger" onClick={(e) => handleAssign(e)} trigger={btnLoaderActive ? "true" : "false"}>
          Assign
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RescheduleAppointment;

RescheduleAppointment.propTypes = {
  toggleRescheduleAppointmentClick: PropTypes.func.isRequired,
  selectedApplicant: PropTypes.object,
  selectedApplointment: PropTypes.object,
  updateVLEData: PropTypes.func.isRequired,
  setAlertMessage: PropTypes.func.isRequired,
};
