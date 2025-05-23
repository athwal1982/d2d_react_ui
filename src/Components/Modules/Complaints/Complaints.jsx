import { React, useState } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat, dateToCompanyFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getComplaintData } from "./Service/Method";
import BizClass from "./Complaints.module.scss";

const complaintStatusCellStyle = (params) => {
  return (
    <div>
      {params.data.ComplaintStatusID && params.data.ComplaintStatusID === 132001 ? (
        <div className={BizClass.StatusBox}>
          <span className={BizClass.spanStatusBox} style={{ background: "#fbc326", color: "#17202A" }}>
            {params.data.ComplaintStatus}
          </span>
        </div>
      ) : params.data.ComplaintStatusID && params.data.ComplaintStatusID === 132002 ? (
        <div className={BizClass.StatusBox}>
          <span className={BizClass.spanStatusBox} style={{ background: "#05b76c", color: "#ffffff" }}>
            {params.data.ComplaintStatus}
          </span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

function Complaint() {
  const setAlertMessage = AlertMessage();

  const [filterComplaintDataList, setFilterComplaintDataList] = useState([]);
  const [isLoadingComplaintList, setIsLoadingComplaintList] = useState(false);

  const searchByoptionsFilter = [
    { value: "1", label: "Mobile No" },
    { value: "2", label: "Appointment No" },
  ];

  const [filterValues, setFilterValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
    SearchByFilter: null,
    txtSearchFilter: "",
  });

  const [complaintGridApi, setComplaintGridApi] = useState();
  const onComplaintGridReady = (params) => {
    setComplaintGridApi(params.api);
  };

  const onSearchComplaint = (val) => {
    complaintGridApi.setQuickFilter(val);
    complaintGridApi.refreshCells();
  };

  const updateFilterState = (name, value) => {
    setFilterValues({ ...filterValues, [name]: value });
    if (name === "txtSearchFilter") {
      onSearchComplaint(value);
    }
  };

  const getComplaintListData = async (message) => {
    debugger;
    if (filterValues.txtFromDate > filterValues.txtToDate) {
      setAlertMessage({
        type: "warning",
        message: "From Date must be less than to To Date",
      });
      return;
    }
    if (filterValues.SearchByFilter === null) {
      setFilterValues({
        ...filterValues,
        txtSearchFilter: "",
      });
      onSearchComplaint("");
    }
    let apppointmentNoVal = "";
    let mobileNoVal = "";

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
      } else if (filterValues.SearchByFilter.value === "2") {
        if (filterValues.txtSearchFilter.length === 0) {
          setAlertMessage({
            type: "error",
            message: "Please enter appointment no.",
          });
          return;
        }
        apppointmentNoVal = filterValues.txtSearchFilter;
      }
    }
    try {
      const formdata = {
        viewMode: "LIST",
        requestorMobileNo: mobileNoVal,
        appointmentNo: apppointmentNoVal,
        fromDate: filterValues.txtFromDate ? dateToCompanyFormat(filterValues.txtFromDate) : "",
        toDate: filterValues.txtToDate ? dateToCompanyFormat(filterValues.txtToDate) : "",
      };
      debugger;
      setIsLoadingComplaintList(true);
      const result = await getComplaintData(formdata);
      setIsLoadingComplaintList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          setFilterComplaintDataList(result.response.responseData);
        } else {
          setFilterComplaintDataList([]);
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

  const getRowStyle = (params) => {
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.data.IsSelected) {
      return { background: "#ffc176" };
    }
    return { background: "" };
  };

  return (
    <div className={BizClass.PageStart}>
      <PageBar>
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
          onClick={() => getComplaintListData()}
          style={{ width: "158px" }}
        />
      </PageBar>
      <DataGrid
        rowData={filterComplaintDataList}
        loader={isLoadingComplaintList ? <Loader /> : false}
        getRowStyle={getRowStyle}
        onGridReady={onComplaintGridReady}
        frameworkComponents={{
          complaintStatusCellStyle,
        }}
      >
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="ComplaintNo" headerName="Complaint No." width="128px" type="rightAligned" />
        <DataGrid.Column field="#" headerName="Status" width="90px" cellRenderer="complaintStatusCellStyle" />
        <DataGrid.Column field="masterComplaintType" headerName="Complaint Type" width="160px" />
        <DataGrid.Column
          field="#"
          headerName="Complaint Type 1"
          width="290px"
          valueGetter={(node) => {
            return node.data.ComplainTypeID && node.data.ComplainTypeID === 131006 ? node.data.OtherComplaint : node.data.ComplaintType;
          }}
        />
        <DataGrid.Column field="BriefComplaint" headerName="Description" width="280px" />
        <DataGrid.Column field="AppointmentNo" headerName="Appointment No." width="155px" />
        <DataGrid.Column
          field="AppointmentDate"
          headerName="Appointment Date"
          width="150px"
          valueFormatter={(param) => (param.value ? moment(param.value).format("DD-MM-YYYY") : "")}
        />
        <DataGrid.Column
          field="#"
          headerName="Appointment Slot"
          width="150px"
          valueGetter={(node) => {
            return node.data.AppointmentSlotFrom && node.data.AppointmentSlotTo ? `${node.data.AppointmentSlotFrom} - ${node.data.AppointmentSlotTo}` : "";
          }}
        />
        <DataGrid.Column field="CallerName" headerName="Caller Name" width="160px" />
        <DataGrid.Column field="ApplicantName" headerName="Applicant Name" width="160px" />
        <DataGrid.Column field="ApplicantContactNumber" headerName="Contact Number" width="140px" />
      </DataGrid>
    </div>
  );
}

export default Complaint;
