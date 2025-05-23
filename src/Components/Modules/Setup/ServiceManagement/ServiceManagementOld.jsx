import { React, useState } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Loader, Splitter } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import { MdOutlineAssignmentTurnedIn, MdOutlineAssignment } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { setSessionStorage } from "Components/Common/Login/Auth/auth";
import { getServiceData, getDocumentData } from "./Service/Method";
import AddService from "./Modal/AddService";
import EditService from "./Modal/EditService";
import AddDocument from "./Modal/AddDocument";
import EditDocument from "./Modal/EditDocument";
import AssignUnAssignDocumentToService from "./Modal/AssignUnAssignDocumentToService";
import AssignUnAssignServiceToState from "./Modal/AssignUnassignServiceToState";
import ServiceToStateList from "./Modal/ServiceToStateList";
import VistingFeeOrVLESetup from "./Modal/VistingFeeOrVLESetup";
import BizClass from "./ServiceManagement.module.scss";

const cellTemplate = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      <AiFillEdit
        title="Edit Service"
        style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
        onClick={() => props.toggleEditServiceModal(props.data)}
      />

      <MdOutlineAssignmentTurnedIn
        title="Document Assign And Unassign To Service"
        style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
        onClick={() => props.toggleServiceToStateListModal(props.data)}
      />

      <MdOutlineAssignment
        title="Document Assign And Unassign To State"
        style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
        onClick={() => props.toggleDocumentToServiceStateListModal(props.data)}
      />
    </div>
  );
};

const cellDocumentTemplate = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      <AiFillEdit
        title="Edit Document"
        style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
        onClick={() => props.toggleEditDocumentModal(props.data)}
      />
    </div>
  );
};

function ServiceManagement() {
  const setAlertMessage = AlertMessage();

  const [documentGridApi, setDocumentGridApi] = useState();
  const onDocumentGridReady = (params) => {
    setDocumentGridApi(params.api);
  };
  const [searchDocumentText, setsearchDocumentText] = useState("");
  const onSearchDocument = (val) => {
    setsearchDocumentText(val);
    documentGridApi.setQuickFilter(val);
    documentGridApi.refreshCells();
  };

  const [serviceGridApi, setServiceGridApi] = useState();
  const onServiceGridReady = (params) => {
    setServiceGridApi(params.api);
  };

  const [searchServiceText, setsearchServiceText] = useState("");
  const onSearchService = (val) => {
    setsearchServiceText(val);
    serviceGridApi.setQuickFilter(val);
    serviceGridApi.refreshCells();
  };

  const [selectedService, setSelectedService] = useState();
  const [addServiceModal, setAddServiceModal] = useState(false);
  const toggleAddServiceModal = () => {
    setAddServiceModal(!addServiceModal);
  };

  const [vistingFeeOrVLESetupModal, setVistingFeeOrVLESetupModal] = useState(false);
  const toggleVistingFeeOrVLESetupModal = (pType) => {
    setSessionStorage("VistingFeeOrVLESetup", pType);
    setVistingFeeOrVLESetupModal(!vistingFeeOrVLESetupModal);
  };
  const [editServiceModal, setEditServiceModal] = useState(false);
  const toggleEditServiceModal = (data) => {
    debugger;
    setSelectedService(data);
    setEditServiceModal(!editServiceModal);
  };

  const [addDocumentModal, setAddDocumentModal] = useState(false);
  const toggleAddDocumentModal = () => {
    setAddDocumentModal(!addDocumentModal);
  };

  const [selectedDocument, setSelectedDocument] = useState();
  const [editDocumentModal, setEditDocumentModal] = useState(false);
  const toggleEditDocumentModal = (data) => {
    setSelectedDocument(data);
    setEditDocumentModal(!editDocumentModal);
  };

  const [assignUnassignDocumentToServiceListModal, setAssignUnassignDocumentToServiceListModal] = useState(false);
  const toggleServiceToStateListModal = (data) => {
    setSelectedService(data);
    setAssignUnassignDocumentToServiceListModal(!assignUnassignDocumentToServiceListModal);
  };

  const [assignUnassignServiceToStateListModal, setAssignUnassignServiceToStateListModal] = useState(false);
  const toggleAssignUnassignServiceToStateListModal = (data) => {
    setSelectedService(data);
    setAssignUnassignServiceToStateListModal(!assignUnassignServiceToStateListModal);
  };

  const [documentToServiceStateListModal, setDocumentToServiceStateListModal] = useState(false);
  const toggleDocumentToServiceStateListModal = (data) => {
    setSelectedService(data);
    setDocumentToServiceStateListModal(!documentToServiceStateListModal);
  };
  const [serviceList, setServiceList] = useState([]);
  const [isLoadingServiceList, setIsLoadingServiceList] = useState(false);
  const getServiceListData = async () => {
    try {
      debugger;
      setIsLoadingServiceList(true);
      const result = await getServiceData();
      setIsLoadingServiceList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (result.response.responseData && result.response.responseData.length > 0) {
            setServiceList(result.response.responseData);
          } else {
            setServiceList([]);
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
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const [documentList, setDocumentList] = useState([]);
  const [isLoadingDocumentList, setIsLoadingDocumentList] = useState(false);
  const getDocumentListData = async () => {
    try {
      debugger;
      setIsLoadingDocumentList(true);
      const result = await getDocumentData();
      setIsLoadingDocumentList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (result.response.responseData && result.response.responseData.length > 0) {
            setDocumentList(result.response.responseData);
          } else {
            setDocumentList([]);
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

  const updateAddService = (addedData) => {
    if (serviceGridApi) {
      const rowData = [];
      if (addedData && addedData.length > 0) {
        addedData.forEach((data) => {
          rowData.push(data);
        });
      }
      serviceGridApi.forEachNode((node) => rowData.push(node.data));
      serviceGridApi.setRowData(rowData);
    }
  };

  const updateEditService = (selectedService) => {
    if (serviceGridApi) {
      const itemsToUpdate = [];
      serviceGridApi.forEachNode(function (rowNode) {
        if (rowNode.data.ServiceTypeID === selectedService.ServiceTypeID) {
          itemsToUpdate.push(selectedService);
          rowNode.setData(selectedService);
        }
      });
      serviceGridApi.updateRowData({
        update: itemsToUpdate,
      });
    }
  };

  const updateAddDocument = (addedData) => {
    if (documentGridApi) {
      const rowData = [];
      if (addedData && addedData.length > 0) {
        addedData.forEach((data) => {
          rowData.push(data);
        });
      }
      documentGridApi.forEachNode((node) => rowData.push(node.data));
      documentGridApi.setRowData(rowData);
    }
  };

  const updateEditDocument = (selectedDocument) => {
    if (serviceGridApi) {
      const itemsToUpdate = [];
      serviceGridApi.forEachNode(function (rowNode) {
        if (rowNode.data.DocumentTypeID === selectedDocument.DocumentTypeID) {
          itemsToUpdate.push(selectedDocument);
          rowNode.setData(selectedDocument);
        }
      });
      serviceGridApi.updateRowData({
        update: itemsToUpdate,
      });
    }
  };

  return (
    <>
      {addServiceModal && <AddService toggleAddServiceModal={toggleAddServiceModal} updateAddService={updateAddService} setAlertMessage={setAlertMessage} />}
      {editServiceModal && (
        <EditService
          toggleEditServiceModal={toggleEditServiceModal}
          selectedService={selectedService}
          updateEditService={updateEditService}
          setAlertMessage={setAlertMessage}
        />
      )}
      {addDocumentModal && (
        <AddDocument toggleAddDocumentModal={toggleAddDocumentModal} updateAddDocument={updateAddDocument} setAlertMessage={setAlertMessage} />
      )}
      {editDocumentModal && (
        <EditDocument
          toggleEditDocumentModal={toggleEditDocumentModal}
          selectedDocument={selectedDocument}
          updateEditDocument={updateEditDocument}
          setAlertMessage={setAlertMessage}
        />
      )}
      {assignUnassignDocumentToServiceListModal && (
        <AssignUnAssignDocumentToService
          toggleServiceToStateListModal={toggleServiceToStateListModal}
          selectedService={selectedService}
          setAlertMessage={setAlertMessage}
        />
      )}
      {assignUnassignServiceToStateListModal && (
        <AssignUnAssignServiceToState
          toggleAssignUnassignServiceToStateListModal={toggleAssignUnassignServiceToStateListModal}
          setAlertMessage={setAlertMessage}
        />
      )}
      {documentToServiceStateListModal && (
        <ServiceToStateList
          toggleDocumentToServiceStateListModal={toggleDocumentToServiceStateListModal}
          selectedService={selectedService}
          setAlertMessage={setAlertMessage}
        />
      )}
      {vistingFeeOrVLESetupModal && (
        <VistingFeeOrVLESetup
          toggleVistingFeeOrVLESetupModal={toggleVistingFeeOrVLESetupModal}
          selectedService={selectedService}
          setAlertMessage={setAlertMessage}
        />
      )}
      <div className={BizClass.PageStart}>
        <Splitter varient="column" template="1.1fr 9px 1fr">
          <div className={BizClass.Card}>
            <PageBar>
              <span style={{ paddingRight: "0px", color: "#fff", fontWeight: "normal", fontSize: "12px" }}>Service Master</span>
              <PageBar.Search onClick={() => getServiceListData(true)} value={searchServiceText} onChange={(e) => onSearchService(e.target.value)} />
              <PageBar.Button onClick={() => toggleAddServiceModal()}>Add Service</PageBar.Button>
              <PageBar.Button onClick={() => toggleVistingFeeOrVLESetupModal("VF")}>Visiting Fee</PageBar.Button>
              <PageBar.Button onClick={() => toggleAssignUnassignServiceToStateListModal()}>Service List</PageBar.Button>
              <PageBar.Button onClick={() => toggleServiceToStateListModal()} style={{ display: "none" }}>
                {" "}
                Document To State{" "}
              </PageBar.Button>
            </PageBar>
            <DataGrid
              rowData={serviceList}
              loader={isLoadingServiceList ? <Loader /> : false}
              frameworkComponents={{
                cellTemplate,
              }}
              getRowStyle={getRowStyle}
              onGridReady={onServiceGridReady}
            >
              <DataGrid.Column
                headerName="Action"
                lockPosition="1"
                pinned="left"
                width={100}
                cellRenderer="cellTemplate"
                cellRendererParams={{
                  toggleServiceToStateListModal,
                  toggleDocumentToServiceStateListModal,
                  toggleEditServiceModal,
                }}
              />
              <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} />
              <DataGrid.Column headerName="Service Name" field="ServiceName" width={440} />
              {/* <DataGrid.Column
                headerName="Document Required"
                field="DocumentRequired"
                width={160}
                valueGetter={(node) => {
                  return node.data.DocumentRequired && node.data.DocumentRequired === "Y" ? "Yes" : node.data.DocumentRequired === "N" ? "No" : "";
                }}
              /> */}
            </DataGrid>
          </div>
          <div className={BizClass.Card}>
            <PageBar>
              <span style={{ paddingRight: "10px", color: "#fff", fontWeight: "normal", fontSize: "12px" }}>Document Master</span>
              <PageBar.Search onClick={() => getDocumentListData(true)} value={searchDocumentText} onChange={(e) => onSearchDocument(e.target.value)} />
              <PageBar.Button onClick={() => toggleAddDocumentModal()}>Add Document</PageBar.Button>
              <PageBar.Button onClick={() => toggleVistingFeeOrVLESetupModal("VS")}>VLE Setup</PageBar.Button>
            </PageBar>
            <DataGrid
              rowData={documentList}
              loader={isLoadingDocumentList ? <Loader /> : false}
              frameworkComponents={{
                cellDocumentTemplate,
              }}
              getRowStyle={getRowStyle}
              onGridReady={onDocumentGridReady}
            >
              <DataGrid.Column
                headerName="Action"
                lockPosition="1"
                pinned="left"
                width={100}
                cellRenderer="cellDocumentTemplate"
                cellRendererParams={{
                  toggleEditDocumentModal,
                }}
              />
              <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} />
              <DataGrid.Column headerName="Document Name" field="DocumentName" width={545} />
            </DataGrid>
          </div>
        </Splitter>
      </div>
    </>
  );
}

export default ServiceManagement;

ServiceManagement.propTypes = {
  toggleServiceToStateListModal: PropTypes.func.isRequired,
};
