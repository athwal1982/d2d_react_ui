import React, { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat, dateToCompanyFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getDTDSMasterDataBindingDataList } from "../../D2DService/Service/Method";
import { getAdditionalReportDataList } from "../Service/Method";
import BizClass from "./AgeingVLEWise.module.scss";

function AgeingVLEWise() {
  const user = getSessionStorage("user");
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
    console.log(params.api);
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
        // A masterName: "DTDSSTATE",
        masterName: "GETSTATE",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      console.log(result, "State Data");
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
      console.log(error);
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
      console.log(result, "District Data");
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
      console.log(error);
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
      console.log(result, "SubDistrict Data");
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
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const gridColumnDefs = [
    { field: "#", headerName: "Sr.No.", width: 80, pinned: "left", lockPosition: "2", valueGetter: "node.rowIndex + 1" },
    { field: "#", headerName: "CSC ID", pinned: "left", width: 120 },
    { field: "#", headerName: "VLE Name", pinned: "left", width: 200 },
    {
      field: "#",
      headerName: "1-4 Days",
      children: [
        { field: "Applied", colId: "Applied", width: 100, cellStyle: { "text-align": "right" } },
        { field: "Discard", colId: "Discard", width: 100, cellStyle: { "text-align": "right" } },
        { field: "Pending", colId: "Pending1", width: 100, cellStyle: { "text-align": "right" } },
      ],
    },
    {
      field: "#",
      headerName: "5-8 Days",
      children: [
        { field: "Applied", colId: "Applied", width: 100, cellStyle: { "text-align": "right" } },
        { field: "Discard", colId: "Discard", width: 100, cellStyle: { "text-align": "right" } },
        { field: "Pending", colId: "Pending1", width: 100, cellStyle: { "text-align": "right" } },
      ],
    },
    {
      field: "#",
      headerName: "9-12 Days",
      children: [
        { field: "Applied", colId: "Applied", width: 100, cellStyle: { "text-align": "right" } },
        { field: "Discard", colId: "Discard", width: 100, cellStyle: { "text-align": "right" } },
        { field: "Pending", colId: "Pending1", width: 100, cellStyle: { "text-align": "right" } },
      ],
    },
    {
      field: "#",
      headerName: "13-16 Days",
      children: [
        { field: "Applied", colId: "Applied", width: 100, cellStyle: { "text-align": "right" } },
        { field: "Discard", colId: "Discard", width: 100, cellStyle: { "text-align": "right" } },
        { field: "Pending", colId: "Pending1", width: 100, cellStyle: { "text-align": "right" } },
      ],
    },
    {
      field: "#",
      headerName: "More Than 16 Days",
      children: [
        { field: "Applied", colId: "Applied", width: 100, cellStyle: { "text-align": "right" } },
        { field: "Discard", colId: "Discard", width: 100, cellStyle: { "text-align": "right" } },
        { field: "Pending", colId: "Pending1", width: 100, cellStyle: { "text-align": "right" } },
      ],
    },
  ];
  const getTicketHistoryData = async () => {
    debugger;
    try {
      setLoadingTicketHistoryDataList(true);

      const formData = {
        viewMode: "DEPT",
        requestorMobileNo: "",
        statusID: 0,
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        userID: user && user.LoginID ? user.LoginID.toString() : 0,
        stateID: formValues.txtState && formValues.txtState.StateCode ? formValues.txtState.StateCode.toString() : "0",
      };
      const result = await getAdditionalReportDataList(formData);
      setLoadingTicketHistoryDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (result.response.responseData && result.response.responseData.length > 0) {
            setFilteredTicketHistoryDataList(result.response.responseData);
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
      console.log(error);
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
        // A txtVillage: null,
        txtVillage: "",
      });
      setSubDistrictList([]);
      // A setVillageList([]);
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
      fileName: "Ticket History",
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
        />
        <PageBar.Input
          ControlTxt="To Date"
          control="input"
          type="date"
          name="txtToDate"
          value={formValues.txtToDate}
          onChange={(e) => updateState("txtToDate", e.target.value)}
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
      <DataGrid
        columnDefs={gridColumnDefs}
        rowData={filteredTicketHistoryDataList}
        loader={isLoadingTicketHistoryDataList ? <Loader /> : false}
        onGridReady={onGridReady}
      />
    </div>
  );
}

export default AgeingVLEWise;
