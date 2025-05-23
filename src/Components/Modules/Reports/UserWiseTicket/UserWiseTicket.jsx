import React, { useState, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { getDTDSMasterDataBindingDataList } from "../../D2DService/Service/Method";
import BizClass from "./UserWiseTicket.module.scss";

function TicketHistory() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    txtState: null,
    txtFilter: null,
  });

  const [filterList] = useState([
    { lable: "Mobile No.", value: "Mobile" },
    { lable: "Name", value: "Name" },
  ]);

  const [filteredTicketHistoryDataList, setFilteredTicketHistoryDataList] = useState([]);
  const [isLoadingTicketHistoryDataList, setLoadingTicketHistoryDataList] = useState(false);
  const setAlertMessage = AlertMessage();

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
        filterID1: 0,
        filterID2: "",
        filterID3: "",
        masterName: "DTDSSTATE",
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

  const getTicketHistoryData = async () => {
    debugger;
    try {
      setLoadingTicketHistoryDataList(true);

      //  A  const formData = {
      //  A   insuranceCompanyID:
      //   A    formValues.txtInsuranceCompany && formValues.txtInsuranceCompany.CompanyID ? formValues.txtInsuranceCompany.CompanyID.toString() : "#ALL",
      //   A  stateID: formValues.txtState && formValues.txtState.StateMasterID ? formValues.txtState.StateMasterID.toString() : "#ALL",
      //   A  fromdate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
      //   A  toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
      //  A };
      //  A const result = await getSupportTicketDetailReport(formData);
      setLoadingTicketHistoryDataList(false);
      // A  if (result.responseCode === 1) {
      //  A   if (ticketHistoryListItemSearch && ticketHistoryListItemSearch.toLowerCase().includes("#")) {
      //  A     onChangeTicketHistoryList("");
      //  A   }
      //  A   setTicketHistoryDataList(result.responseData.supportTicket);
      //  A   setFilteredTicketHistoryDataList(result.responseData.supportTicket);
      //  A } else {
      //  A   setAlertMessage({
      //   A    type: "error",
      //    A   message: result.responseMessage,
      //   A  });
      // A }
      setFilteredTicketHistoryDataList([]);
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
      fileName: "User WiseTicket",
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
          ControlTxt="State"
          name="txtFilter"
          value={formValues.txtFilter}
          options={filterList}
          getOptionLabel={(option) => `${option.lable}`}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtFilter", e)}
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
        {/* <DataGrid.Column field="SupportTicketNo" headerName="Ticket No" width="160px" />
        <DataGrid.Column
          field="#"
          headerName="Creation Date"
          width="128px"
          valueGetter={(node) => {
            return node.data.TicketDate ? `${dateFormatDDMMYY(node.data.TicketDate.split("T")[0])}` : null;
          }}
        />
        <DataGrid.Column field="TicketStatus" headerName="Ticket Status" width="120px" />
        <DataGrid.Column
          field="#"
          headerName="Status Date"
          width="120px"
          valueGetter={(node) => {
            return node.data.StatusDate ? `${dateFormatDDMMYY(node.data.StatusDate.split("T")[0])}` : null;
          }}
        />
        <DataGrid.Column field="TicketHeadName" headerName="Type" width="110px" />
        <DataGrid.Column field="SupportTicketTypeName" headerName="Category" width="160px" />
        <DataGrid.Column field="TicketCategoryName" headerName="Sub Category" width="170px" />
        <DataGrid.Column field="InsuranceMasterName" headerName="Insurance Company" width="290px" />
        <DataGrid.Column
          field="#"
          headerName="Application No"
          cellClass="numberType"
          valueGetter={(node) => {
            return node.data.ApplicationNo ? node.data.ApplicationNo.toString() : null;
          }}
          width="210px"
        />
        <DataGrid.Column field="RequestorName" headerName="Farmer Name" width="220px" />
        <DataGrid.Column field="RequestorMobileNo" headerName="Mobile No" width="125px" />
        <DataGrid.Column field="TicketDescription" headerName="Description" width="290px" /> */}
      </DataGrid>
    </div>
  );
}

export default TicketHistory;
