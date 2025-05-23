import React, { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat, dateToCompanyFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getDTDSMasterDataBindingDataList } from "../../D2DService/Service/Method";
import { getCitizenAppointmentReportData } from "../Service/Method";
import BizClass from "./SRComplete.module.scss";

function SRComplete() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    txtState: null,
    txtDistrict: null,
    txtSubDistrict: null,
  });

  const [lableTalukAnything, setlableTalukAnything] = useState("SubDistrict");
  const [filteredTicketHistoryDataList, setFilteredTicketHistoryDataList] = useState([]);
  const [isLoadingTicketHistoryDataList, setLoadingTicketHistoryDataList] = useState(false);
  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");
  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const [ticketHistoryListItemSearch, setTicketHistoryListItemSearch] = useState("");
  const onChangeTicketHistoryList = (val) => {
    debugger;
    setTicketHistoryListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const [stateList, setStateList] = useState([]);
  const [isLoadingStateList, setIsLoadingStateList] = useState(false);
  const getStateListData = async () => {
    try {
      setStateList([]);
      setIsLoadingStateList(true);
      const formdata = {
        filterID: 0,
        filterID1: userData && userData.LoginID ? userData.LoginID : 0,
        filterID2: "",
        filterID3: "",
        masterName: "GETSTATE",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      setIsLoadingStateList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateList(result.response.responseData.masterdatabinding);
        } else {
          setStateList([]);
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

  const [districtList, setDistrictList] = useState([]);
  const [isLoadingDistrictList, setIsLoadingDistrictList] = useState(false);
  const getDistrictByStateListData = async (pstatemasterid) => {
    try {
      setIsLoadingDistrictList(true);
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
      setIsLoadingDistrictList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setDistrictList(result.response.responseData.masterdatabinding);
        } else {
          setDistrictList([]);
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
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const [subDistrictList, setSubDistrictList] = useState([]);
  const [isLoadingSubDistrictList, setIsLoadingSubDistrictList] = useState(false);
  const getSubDistrictByStateANDDistrictListData = async (pdistrictMasterCode) => {
    try {
      setIsLoadingSubDistrictList(true);
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
      setIsLoadingSubDistrictList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setSubDistrictList(result.response.responseData.masterdatabinding);
        } else {
          setSubDistrictList([]);
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
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const getTicketHistoryData = async () => {
    debugger;
    try {
      setLoadingTicketHistoryDataList(true);

      const formData = {
        viewMode: "SUBDISTRICTCODE",
        fromDate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        stateID: formValues.txtState && formValues.txtState.StateMasterID ? formValues.txtState.StateMasterID : 0,
        districtMasterID: formValues.txtDistrict && formValues.txtDistrict.DistrictMasterCode ? formValues.txtDistrict.DistrictMasterCode : 0,
        subDistrictMasterID: formValues.txtSubDistrict && formValues.txtSubDistrict.SubDistrictMasterCode ? formValues.txtSubDistrict.SubDistrictMasterCode : 0,
      };
      const result = await getCitizenAppointmentReportData(formData);
      setLoadingTicketHistoryDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (result.response.responseData && result.response.responseData.dashboard.length > 0) {
            setFilteredTicketHistoryDataList(result.response.responseData.dashboard);
          } else {
            setFilteredTicketHistoryDataList([]);
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      } else if (result.response.responseCode !== 1) {
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

  const updateState = (name, value) => {
    debugger;
    setFormValues({ ...formValues, [name]: value });
    if (name === "txtState") {
      setFormValues({
        ...formValues,
        txtState: value,
        txtDistrict: null,
        txtSubDistrict: null,
      });
      setDistrictList([]);
      setSubDistrictList([]);
      setlableTalukAnything("SubDistrict");
      if (value) {
        setlableTalukAnything(value.Level4Name ? value.Level4Name : "SubDistrict");

        getDistrictByStateListData(value.StateCode);
      }
    } else if (name === "txtDistrict") {
      setFormValues({
        ...formValues,
        txtDistrict: value,
        txtSubDistrict: null,
        txtVillage: "",
      });
      setSubDistrictList([]);
      if (value) {
        getSubDistrictByStateANDDistrictListData(value.DistrictMasterCode);
      }
    }
  };

  const getTicketHistoryList = () => {
    if (formValues.txtFromDate > formValues.txtToDate) {
      setAlertMessage({
        type: "warning",
        message: "From Date must be less than to To Date",
      });
      return;
    }
    getTicketHistoryData();
  };

  const onClickClearSearchFilter = () => {
    setFormValues({
      ...formValues,
      txtFromDate: "",
      txtToDate: "",
    });
  };

  const exportClick = () => {
    const excelParams = {
      fileName: "SR_Complete",
    };
    gridApi.exportDataAsExcel(excelParams);
  };

  useEffect(() => {
    getStateListData();
  }, []);

  return (
    <div className={BizClass.PageStart}>
      <PageBar>
        <PageBar.Input
          ControlTxt="From Date"
          control="input"
          type="date"
          name="txtFromDate"
          value={formValues.txtFromDate}
          onChange={(e) => updateState("txtFromDate", e.target.value)}
          style={{ width: "120px" }}
        />
        <PageBar.Input
          ControlTxt="To Date"
          control="input"
          type="date"
          name="txtToDate"
          value={formValues.txtToDate}
          onChange={(e) => updateState("txtToDate", e.target.value)}
          style={{ width: "120px" }}
        />

        <PageBar.Select
          ControlTxt="State"
          name="txtState"
          value={formValues.txtState}
          loader={isLoadingStateList ? <Loader /> : null}
          options={stateList}
          getOptionLabel={(option) => `${option.StateMasterName}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtState", e)}
        />
        <PageBar.Select
          ControlTxt="District"
          name="txtDistrict"
          value={formValues.txtDistrict}
          loader={isLoadingDistrictList ? <Loader /> : null}
          options={districtList}
          getOptionLabel={(option) => `${option.DistrictMasterName}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtDistrict", e)}
        />
        <PageBar.Select
          ControlTxt={lableTalukAnything}
          name="txtSubDistrict"
          value={formValues.txtSubDistrict}
          loader={isLoadingSubDistrictList ? <Loader /> : null}
          options={subDistrictList}
          getOptionLabel={(option) => `${option.SubDistrictMasterName}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtSubDistrict", e)}
        />

        <PageBar.Search
          value={ticketHistoryListItemSearch}
          onChange={(e) => onChangeTicketHistoryList(e.target.value)}
          onClick={() => getTicketHistoryList()}
        />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredTicketHistoryDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid rowData={filteredTicketHistoryDataList} loader={isLoadingTicketHistoryDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field={["Citizen Name"]} headerName="Customer Name" width={190} />
        <DataGrid.Column field={["Citizen Mobile No."]} headerName="Mobile No" width={125} />
        <DataGrid.Column field={["Service Request ID"]} headerName="Service Request ID" width={160} />
        <DataGrid.Column
          field={["Created Date"]}
          headerName="Created Date"
          width={120}
          valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
        />
        <DataGrid.Column field={["Created By"]} headerName="Created By" width={160} />
        <DataGrid.Column
          field={["Appointment Date"]}
          headerName="Appointment Date"
          width={150}
          valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
        />
        <DataGrid.Column field={["Service Request Status"]} headerName="Service Request Status" width={185} />
        <DataGrid.Column
          field={["Status Date"]}
          headerName="Status Date"
          width={125}
          valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
        />
        <DataGrid.Column field={["Citizen Address 1"]} headerName="Address" width={165} />
        <DataGrid.Column field={["District"]} headerName="District" width={145} />
        <DataGrid.Column field={["City"]} headerName="City" width={145} />
        <DataGrid.Column field={["Pincode"]} headerName="Pincode" width={125} />
        <DataGrid.Column field={["Department"]} headerName="Department" width="225px" />
        <DataGrid.Column field={["Sub Department"]} headerName="Sub Department" width="225px" />
        <DataGrid.Column field={["Name of Service"]} headerName="Name of Service" width={225} cellStyle={{ "text-align": "right" }} />
        <DataGrid.Column field={["Government Fee"]} headerName="Gov. Fee" width={145} cellStyle={{ "text-align": "right" }} />
        <DataGrid.Column field={["Payment Mode (Gov.)"]} headerName="Payment Mode" width={145} />
        <DataGrid.Column field={["Vendor Fees"]} headerName="Vendor Fees" width={145} cellStyle={{ "text-align": "right" }} />
        {/* <DataGrid.Column field={["Consolidate Tax"]} headerName="Consolidated Tax" width={145} cellStyle={{ "text-align": "right" }} /> */}
        <DataGrid.Column field={["Receipt No."]} headerName="Receipt No" width={145} />
        <DataGrid.Column field={["VLE Name"]} headerName="VLE Name" width={145} />
        <DataGrid.Column field={["VLE Area"]} headerName="VLE Area" width={145} />
        <DataGrid.Column field={["Application No. Gov."]} headerName="Application No. Gov." width={175} />
        <DataGrid.Column field={["If Discard, Reason"]} headerName="If Discard, Reason" width={155} />
        <DataGrid.Column field={["Total (vendor fees)"]} headerName="Total" width={100} cellStyle={{ "text-align": "right" }} />
      </DataGrid>
    </div>
  );
}

export default SRComplete;
