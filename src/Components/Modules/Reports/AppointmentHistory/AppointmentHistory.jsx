import React, { useState } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Convert24FourHourAndMinute, dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import * as XLSX from "xlsx";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { getAppointmentHistoryDataList } from "../Service/Method";
import BizClass from "./AppointmentHistory.module.scss";

const customerStatusCellStyle = (params) => {
  return (
    <div>
      {params.data.StatusID && params.data.StatusID.toString() === "133003" ? (
        <div className={BizClass.StatusBox}>
          <span className={BizClass.spanStatusBox} style={{ background: "#05b76c", color: "#ffffff" }}>
            {params.data.STATUS}
          </span>
        </div>
      ) : params.data.StatusID && params.data.StatusID.toString() === "133002" ? (
        <div className={BizClass.StatusBox}>
          <span className={BizClass.spanStatusBox} style={{ background: "#fb403f", color: "#ffffff" }}>
            {params.data.STATUS}
          </span>
        </div>
      ) : params.data.StatusID && params.data.StatusID.toString() === "133001" ? (
        <div className={BizClass.StatusBox}>
          <span className={BizClass.spanStatusBox} style={{ background: "#fbc326", color: "#17202A" }}>
            Registered
          </span>
        </div>
      ) : params.data.StatusID && params.data.StatusID.toString() === "133004" ? (
        <div className={BizClass.StatusBox}>
          <span className={BizClass.spanStatusBox} style={{ background: "#0398fc", color: "#ffffff" }}>
            {params.data.STATUS}
          </span>
        </div>
      ) : params.data.StatusID && params.data.StatusID.toString() === "133009" ? (
        <div className={BizClass.StatusBox}>
          <span className={BizClass.spanStatusBox} style={{ background: "#eb232a", color: "#ffffff" }}>
            {params.data.STATUS}
          </span>
        </div>
      ) : params.data.StatusID && params.data.StatusID.toString() === "133006" ? (
        <div className={BizClass.StatusBox}>
          <span className={BizClass.spanStatusBox} style={{ background: "#eb232a", color: "#ffffff" }}>
            {params.data.STATUS}
          </span>
        </div>
      ) : params.data.StatusID && params.data.StatusID.toString() === "133007" ? (
        <div className={BizClass.StatusBox}>
          <span className={BizClass.spanStatusBox} style={{ background: "#5cb85c", color: "#ffffff" }}>
            {params.data.STATUS}
          </span>
        </div>
      ) : params.data.StatusID && params.data.StatusID.toString() === "133008" ? (
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

function AppointmentHistory() {
  const searchByoptionsFilter = [{ value: "1", label: "Appointment No" }];

  const [filterValues, setFilterValues] = useState({
    SearchByFilter: { value: "1", label: "Appointment No" },
    txtSearchFilter: "",
  });

  const [filteredAppointmentHistoryDataList, setFilteredAppointmentHistoryDataList] = useState([]);
  const [isLoadingAppointmentHistoryDataList, setLoadingAppointmentHistoryDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  // A  const [gridApi, setGridApi] = useState();
  // A  const onGridReady = (params) => {
  // A    console.log(params.api);
  // A    setGridApi(params.api);
  // A  };

  const getAppointmentHistoryData = async () => {
    debugger;
    try {
      if (filterValues.SearchByFilter === null) {
        setAlertMessage({
          type: "error",
          message: "Please select appointment no.",
        });
        return;
      }
      if (filterValues.txtSearchFilter.length === 0) {
        setAlertMessage({
          type: "error",
          message: "Please enter appointment no.",
        });
        return;
      }
      setLoadingAppointmentHistoryDataList(true);
      const formData = {
        viewMode: "HISTORY",
        appointmentNo: filterValues.txtSearchFilter,
      };
      const result = await getAppointmentHistoryDataList(formData);
      setLoadingAppointmentHistoryDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (result.response.responseData.history && result.response.responseData.history.length > 0) {
            setFilteredAppointmentHistoryDataList(result.response.responseData.history);
          } else {
            setFilteredAppointmentHistoryDataList([]);
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

  const updateFilterState = (name, value) => {
    setFilterValues({ ...filterValues, [name]: value });
  };

  const getAppointmentHistoryList = () => {
    getAppointmentHistoryData();
  };

  const onClickClearSearchFilter = () => {
    setFilterValues({
      ...filterValues,
      txtSearchFilter: "",
    });
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // A let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // A XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    worksheet["!cols"] = [{ width: 25 }, { width: 25 }, { width: 20 }, { width: 35 }, { width: 50 }];
    XLSX.writeFile(workbook, "Appointment_History.xlsx");
  };

  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };

  const exportClick = () => {
    // A const excelParams = {
    // A  fileName: "LossIntimationReport",
    // A};
    // A gridApi.exportDataAsExcel(excelParams);
    if (filteredAppointmentHistoryDataList.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Data not found to download.",
      });
      return;
    }
    const columnOrder = {
      AppointmentNo: "Appointment No",
      AppointmentDate: "Appointment Date",
      Status: "Status",
      ChangedStatusOn: "Updated On",
      VLEName: "VLE Name",
    };
    const mappedData = filteredAppointmentHistoryDataList.map((value) => {
      return {
        AppointmentNo: value.AppointmentNo,
        Status: value.Status,
        VLEName: value.VLEName,
        AppointmentDate: value.AppointmentDate ? dateToSpecificFormat(value.AppointmentDate, "DD-MM-YYYY") : "",
        ChangedStatusOn: dateToSpecificFormat(
          `${value.ChangedStatusOn.split("T")[0]} ${Convert24FourHourAndMinute(value.ChangedStatusOn.split("T")[1])}`,
          "DD-MM-YYYY HH:mm",
        ),
      };
    });
    const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
    downloadExcel(rearrangedData);
  };

  return (
    <div className={BizClass.PageStart}>
      <PageBar>
        <PageBar.Select
          ControlTxt="Search By"
          name="SearchByFilter"
          getOptionLabel={(option) => `${option.label}`}
          getOptionValue={(option) => `${option}`}
          options={searchByoptionsFilter}
          value={filterValues.SearchByFilter}
          onChange={(e) => updateFilterState("SearchByFilter", e)}
        />
        <PageBar.Search
          placeholder="Search "
          name="txtSearchFilter"
          value={filterValues.txtSearchFilter}
          onChange={(e) => updateFilterState(e.target.name, e.target.value)}
          onClick={() => getAppointmentHistoryList()}
          style={{ width: "158px" }}
        />

        <PageBar.Button onClick={() => onClickClearSearchFilter()} title="Clear">
          Clear
        </PageBar.Button>
        <PageBar.ExcelButton onClick={() => exportClick()} disabled={filteredAppointmentHistoryDataList.length === 0}>
          Export
        </PageBar.ExcelButton>
      </PageBar>
      <DataGrid
        rowData={filteredAppointmentHistoryDataList}
        loader={isLoadingAppointmentHistoryDataList ? <Loader /> : false}
        // A onGridReady={onGridReady}
        frameworkComponents={{
          customerStatusCellStyle,
        }}
      >
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="AppointmentNo" headerName="Appointment No." width="155px" />
        <DataGrid.Column
          field="AppointmentDate"
          headerName="Appointment Date"
          width="150px"
          valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
        />
        <DataGrid.Column field="#" headerName="Status" width="110px" cellRenderer="customerStatusCellStyle" />
        <DataGrid.Column
          field="#"
          headerName="Updated On"
          width="145px"
          valueGetter={(node) => {
            // A return node.data.CreatedAt ? `${dateFormat(node.data.CreatedAt.split("T")[0])} ${tConvert(node.data.CreatedAt.split("T")[1])}` : null;
            return node.data.ChangedStatusOn
              ? dateToSpecificFormat(
                  `${node.data.ChangedStatusOn.split("T")[0]} ${Convert24FourHourAndMinute(node.data.ChangedStatusOn.split("T")[1])}`,
                  "DD-MM-YYYY HH:mm",
                )
              : null;
          }}
        />
        <DataGrid.Column field="VLEName" headerName="VLE" width="250x" />
      </DataGrid>
    </div>
  );
}

export default AppointmentHistory;
