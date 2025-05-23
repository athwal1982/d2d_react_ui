import React, { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat, dateToCompanyFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getDTDSMasterDataBindingDataList } from "../../D2DService/Service/Method";
import { getAgeingDashBoardReportData } from "../Service/Method";
import BizClass from "./AgeingDepartmentWise.module.scss";

function AgeingDepartmentWise() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    txtState: null,
  });

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

  const gridColumnDefs = [
    { field: "#", headerName: "Sr.No.", width: 80, pinned: "left", lockPosition: "2", valueGetter: "node.rowIndex + 1" },
    { field: "Department", headerName: "Department", pinned: "left", width: 275 },
    { field: "SubDepartment", headerName: "Sub Department", pinned: "left", width: 275 },
    {
      field: "#",
      headerName: "1-4 Days",
      children: [
        {
          field: "Applied",
          colId: "Applied4",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Applied4 ? node.data.Applied4 : 0),
        },
        {
          field: "Discard",
          colId: "Discard4",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Discard4 ? node.data.Discard4 : 0),
        },
        {
          field: "Pending",
          colId: "Pending4",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Pending4 ? node.data.Pending4 : 0),
        },
      ],
    },
    {
      field: "#",
      headerName: "5-8 Days",
      children: [
        {
          field: "Applied",
          colId: "Applied8",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Applied8 ? node.data.Applied8 : 0),
        },
        {
          field: "Discard",
          colId: "Discard8",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Discard8 ? node.data.Discard8 : 0),
        },
        {
          field: "Pending",
          colId: "Pending8",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Pending8 ? node.data.Pending8 : 0),
        },
      ],
    },
    {
      field: "#",
      headerName: "9-12 Days",
      children: [
        {
          field: "Applied",
          colId: "Applied12",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Applied12 ? node.data.Applied12 : 0),
        },
        {
          field: "Discard",
          colId: "Discard12",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Discard12 ? node.data.Discard12 : 0),
        },
        {
          field: "Pending",
          colId: "Pending12",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Pending12 ? node.data.Pending12 : 0),
        },
      ],
    },
    {
      field: "#",
      headerName: "13-16 Days",
      children: [
        {
          field: "Applied",
          colId: "Applied16",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Applied16 ? node.data.Applied16 : 0),
        },
        {
          field: "Discard",
          colId: "Discard16",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Discard62 ? node.data.Discard16 : 0),
        },
        {
          field: "Pending",
          colId: "Pending16",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Pending16 ? node.data.Pending16 : 0),
        },
      ],
    },
    {
      field: "#",
      headerName: "More Than 16 Days",
      children: [
        {
          field: "Applied",
          colId: "Applied17",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Applied17 ? node.data.Applied17 : 0),
        },
        {
          field: "Discard",
          colId: "Discard17",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Discard17 ? node.data.Discard17 : 0),
        },
        {
          field: "Pending",
          colId: "Pending17",
          width: 100,
          cellStyle: { "text-align": "right" },
          valueGetter: (node) => (node.data.Pending17 ? node.data.Pending17 : 0),
        },
      ],
    },
  ];

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

  const [filteredTicketHistoryDataList, setFilteredTicketHistoryDataList] = useState([]);
  const [isLoadingTicketHistoryDataList, setLoadingTicketHistoryDataList] = useState(false);
  const getTicketHistoryData = async () => {
    debugger;
    try {
      setLoadingTicketHistoryDataList(true);

      const formData = {
        viewMode: "",
        requestorMobileNo: "",
        statusID: 0,
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
        userID: userData && userData.LoginID ? userData.LoginID.toString() : 0,
        stateID: formValues.txtState && formValues.txtState.StateCode ? formValues.txtState.StateCode : 0,
      };
      const result = await getAgeingDashBoardReportData(formData);
      setLoadingTicketHistoryDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (result.response.responseData && result.response.responseData.dashbard.length > 0) {
            setFilteredTicketHistoryDataList(result.response.responseData.dashbard);
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
      fileName: "Ageing_Department_Wise",
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

export default AgeingDepartmentWise;
