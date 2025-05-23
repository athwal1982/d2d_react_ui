import { React, useEffect, useState } from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { RiFileList3Line } from "react-icons/ri";
import PropTypes from "prop-types";
// A import { getDTDSMasterDataBindingDataList, getAppointmentData } from "../Service/Method";
import { getAppointmentData } from "../Service/Method";
import BizClass from "../D2DServcie.module.scss";
import ServiceDocumentList from "./ServiceDocumentList";

const cellTemplate = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      <RiFileList3Line
        title="Service Documents"
        style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
        onClick={() => props.selectDocumentClick(props.data)}
      />
    </div>
  );
};

function AssignedServiceList({ selectedApplointment, toggleServiceListClick, setAlertMessage }) {
  const [assignedServiceToStateList, setAssignedServiceToStateList] = useState([]);
  const [isLoadingAssignedServiceToStateList, setIsLoadingAssignedServiceToStateList] = useState(false);

  const getAssignedServiceToStateData = async () => {
    debugger;
    try {
      setAssignedServiceToStateList([]);
      setIsLoadingAssignedServiceToStateList(true);
      const formdata = {
        viewMode: "SERVICE",
        applicantID: "",
        appointmentNo: selectedApplointment.AppointmentNo ? selectedApplointment.AppointmentNo : "",
      };
      const result = await getAppointmentData(formdata);
      setIsLoadingAssignedServiceToStateList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData && result.response.responseData.length > 0) {
          setAssignedServiceToStateList(result.response.responseData);
        } else {
          setAssignedServiceToStateList([]);
        }
      } else {
        setAssignedServiceToStateList([]);
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

  const [serviceToStateGridApi, setServiceToStateGridApi] = useState();
  const onServiceToStateGridReady = (params) => {
    setServiceToStateGridApi(params.api);
  };

  const [searchTextAssigendServiceToState, setSearchTextAssigendServiceToState] = useState("");
  const onSearchAssignedServiceToState = (val) => {
    debugger;
    setSearchTextAssigendServiceToState(val);
    serviceToStateGridApi.setQuickFilter(val);
    serviceToStateGridApi.refreshCells();
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

  // A const [documentData, setDocumentData] = useState("");
  // A const [isLoadingDocumentList, setIsLoadingDocumentList] = useState(false);
  // A const [documentList, setDocumentList] = useState([]);
  // A const getDocumentDataList = async (pServiceTypeID) => {
  // A  debugger;
  // A  try {
  // A    const formdata = {
  // A      filterID: pServiceTypeID,
  // A      filterID1: 0,
  // A      filterID2: selectedApplointment.AppointmentNo ? selectedApplointment.AppointmentNo : "",
  // A      filterID3: "",
  // A      masterName: "APLDCTYP",
  // A      searchText: "#ALL",
  // A      searchCriteria: "AW",
  // A    };
  // A    setIsLoadingDocumentList(true);
  // A    const result = await getDTDSMasterDataBindingDataList(formdata);
  // A    console.log(result);
  // A    setIsLoadingDocumentList(false);
  // A    if (result.response.responseCode === 1) {
  // A      if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
  // A        setDocumentList(result.response.responseData.masterdatabinding);
  // A        const documentTypeIDs = result.response.responseData.masterdatabinding
  // A          .map((data) => {
  // A            return data.DocumentTypeID;
  // A          })
  // A          .join(",");

  //  A       setDocumentData(documentTypeIDs);
  //  A     } else {
  //  A       setDocumentList([]);
  //  A       setDocumentData("");
  //  A     }
  //  A   } else {
  //  A     setAlertMessage({
  //  A       type: "error",
  //  A       message: result.response.responseMessage,
  //  A     });
  //  A   }
  //  A } catch (error) {
  //  A   setAlertMessage({
  //  A     type: "error",
  //  A     message: error,
  //  A   });
  //  A }
  // A };

  const [openDocumentModal, setOpenDocumentModal] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const selectDocumentClick = (data) => {
    debugger;
    if (data) {
      setSelectedData(data);
      // A getDocumentDataList(data.ServiceID);
    }
    setOpenDocumentModal(!openDocumentModal);
  };

  useEffect(() => {
    debugger;
    getAssignedServiceToStateData(30);
  }, []);

  return (
    <>
      {openDocumentModal && (
        <ServiceDocumentList
          selectedData={selectedData}
          // A isLoadingDocumentList={isLoadingDocumentList}
          selectDocumentClick={selectDocumentClick}
          // A setAlertMessage={setAlertMessage}
          // A documentList={documentList}
          // A documentData={documentData}
          // A setDocumentData={setDocumentData}
        />
      )}
      <Modal
        varient="half"
        // A title="Assign Un-Assign Service To State List"
        title="Assigned Service List"
        show={toggleServiceListClick}
        right="0"
        width="72.5vw"
      >
        <Modal.Body>
          <div className={BizClass.myCardGrid}>
            <PageBar>
              <PageBar.Search value={searchTextAssigendServiceToState} onChange={(e) => onSearchAssignedServiceToState(e.target.value)} />
            </PageBar>
            <span className={BizClass.span_service} />
            <DataGrid
              rowData={assignedServiceToStateList}
              loader={isLoadingAssignedServiceToStateList ? <Loader /> : false}
              suppressRowClickSelection={true}
              rowSelection="single"
              frameworkComponents={{
                cellTemplate,
              }}
              getRowStyle={getRowStyle}
              onGridReady={onServiceToStateGridReady}
            >
              <DataGrid.Column
                headerName="Action"
                lockPosition="1"
                pinned="left"
                width={80}
                cellRenderer="cellTemplate"
                cellRendererParams={{
                  selectDocumentClick,
                }}
              />
              {/* <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} /> */}
              <DataGrid.Column field="NAME" headerName="Applicant Name" width={150} />
              <DataGrid.Column field="Relationof" headerName="Relation" width={90} />
              {/* <DataGrid.Column field="ServiceFees" headerName="Service Fee" width={110} type="rightAligned" /> */}
              <DataGrid.Column headerName="Department" field="DepartmentMasterName" width={255} />
              <DataGrid.Column headerName="Sub Department" field="SubDepartmentMasterName" width={255} />
              <DataGrid.Column headerName="Service Name" field="ServiceName" width={455} />
              <DataGrid.Column field="ServiceFees" headerName="Department Fee" width="140px" type="rightAligned" />
              <DataGrid.Column field="VLEServiceCharge" headerName="Service Charges" width="140px" type="rightAligned" />
              <DataGrid.Column field="VLEGSTCharge" headerName="GST" width="140px" type="rightAligned" />
              <DataGrid.Column field="VLETotal" headerName="Visiting Fee" width="140px" type="rightAligned" />
              <DataGrid.Column headerName="Time Liine" field="TimeLine" width={100} />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
}

export default AssignedServiceList;

AssignedServiceList.propTypes = {
  selectedApplointment: PropTypes.object,
  toggleServiceListClick: PropTypes.func.isRequired,
  setAlertMessage: PropTypes.func.isRequired,
};
