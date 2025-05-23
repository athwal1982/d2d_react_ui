import React, { useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat, dateToCompanyFormat, Convert24FourHourAndMinute } from "Configration/Utilities/dateformat";
import moment from "moment";
import { getComplaintMasterData } from "../Service/Method";
import BizClass from "./Complaint.module.scss";

function Complaint() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
  });

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

  const getTicketHistoryData = async () => {
    debugger;
    try {
      setLoadingTicketHistoryDataList(true);

      const formData = {
        viewMode: "",
        fromDate: formValues.txtFromDate ? dateToCompanyFormat(formValues.txtFromDate) : "",
        toDate: formValues.txtToDate ? dateToCompanyFormat(formValues.txtToDate) : "",
      };
      const result = await getComplaintMasterData(formData);
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
      fileName: "Complaint",
    };
    gridApi.exportDataAsExcel(excelParams);
  };

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
        <DataGrid.Column field={["Citizen Name"]} headerName="Customer Name" width="190px" />
        <DataGrid.Column field={["Mobile No."]} headerName="Mobile No" width="120px" />
        <DataGrid.Column
          field="#"
          headerName="Created On"
          width="145px"
          valueGetter={(node) => {
            return node.data["Created On"]
              ? dateToSpecificFormat(
                  `${node.data["Created On"].split("T")[0]} ${Convert24FourHourAndMinute(node.data["Created On"].split("T")[1])}`,
                  "DD-MM-YYYY HH:mm",
                )
              : null;
          }}
        />
        <DataGrid.Column field={["Service Request No."]} headerName="Service Request No." width="160px" />
        <DataGrid.Column field={["Complain Request No."]} headerName="Complaint Request No." width="180px" />
        <DataGrid.Column field="Description" headerName="Description" width="255px" />
        <DataGrid.Column field="Department" headerName="Department" width="225px" />
        <DataGrid.Column field={["Sub Department"]} headerName="Sub Department" width="225px" />
        <DataGrid.Column field="Service" headerName="Servcie" width="225px" />
        <DataGrid.Column field={["Complaint Type"]} headerName="Compalint Type" width="175px" />
        <DataGrid.Column field={["Complaint Sub Type"]} headerName="Compalint Sub Type" width="170px" />
        <DataGrid.Column field="Closure" headerName="Closure Remarks" width="220px" />
        <DataGrid.Column field="Status" headerName="Status" width="90px" />
      </DataGrid>
    </div>
  );
}

export default Complaint;
