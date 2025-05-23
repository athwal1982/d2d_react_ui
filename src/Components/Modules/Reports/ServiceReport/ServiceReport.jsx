import React, { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat, dateToCompanyFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getDTDSMasterDataBindingDataList } from "../../D2DService/Service/Method";
import { getConsolidateReportDataList } from "../Service/Method";
import BizClass from "./ServiceReport.module.scss";

function ServiceReport() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    txtState: null,
  });

  const [filteredServiceReportDataList, setFilteredServiceReportDataList] = useState([]);
  const [isLoadingServiceReportDataList, setLoadingServiceReportDataList] = useState(false);
  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");
  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [ServiceReportListItemSearch, setServiceReportListItemSearch] = useState("");
  const onChangeServiceReportList = (val) => {
    debugger;
    setServiceReportListItemSearch(val);
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

  const getServiceReportData = async () => {
    debugger;
    try {
      if (formValues.txtFromDate > formValues.txtToDate) {
        setAlertMessage({
          type: "warning",
          message: "From Date must be less than to To Date",
        });
        return;
      }
      setLoadingServiceReportDataList(true);

      const formData = {
        viewMode: "SERVICE",
        stateID: formValues.txtState && formValues.txtState.StateCode ? formValues.txtState.StateCode : 0,
        fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
      };
      const result = await getConsolidateReportDataList(formData);
      setLoadingServiceReportDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (result.response.responseData && result.response.responseData.length > 0) {
            setFilteredServiceReportDataList(result.response.responseData);
          } else {
            setFilteredServiceReportDataList([]);
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

  const getServiceReportList = () => {
    if (formValues.txtFromDate) {
      if (formValues.txtToDate) {
        if (formValues.txtFromDate > formValues.txtToDate) {
          setAlertMessage({
            type: "warning",
            message: "From date must be less than To Date",
          });
          return;
        }
      } else {
        setAlertMessage({
          type: "warning",
          message: "Please select To Date",
        });
        return;
      }
    }
    getServiceReportData();
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
      fileName: "Service Consolidated",
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
          value={ServiceReportListItemSearch}
          onChange={(e) => onChangeServiceReportList(e.target.value)}
          onClick={() => getServiceReportList()}
        />
        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredServiceReportDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid rowData={filteredServiceReportDataList} loader={isLoadingServiceReportDataList ? <Loader /> : false} onGridReady={onGridReady}>
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="ServiceName" headerName="Service" width="450px" />
        <DataGrid.Column field="StateMasterName" headerName="State" width="220px" />

        <DataGrid.Column field="Applied" headerName="Service Applied Count" width="180px" cellStyle={{ "text-align": "right" }} />
      </DataGrid>
    </div>
  );
}

export default ServiceReport;
