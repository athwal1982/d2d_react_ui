import { React, useEffect, useState } from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import { FiTrash2 } from "react-icons/fi";
import { AiFillEdit } from "react-icons/ai";
import PropTypes from "prop-types";
import { serviceTypeDocumentAssignManageData } from "../Service/Method";
import BizClass from "../ServiceManagement.module.scss";
import ServiceFeePopUp from "./ServiceFeePopUp";
import EditServiceFeePopup from "./EditServiceFeePopup";

const cellServiceDocumentTemplate = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      {props.data && props.data.AssignmentFlag === 1 ? (
        <span
          title="Delete Assigned User"
          style={{
            cursor: "pointer",
            display: "grid",
            marginTop: "3px",
            marginRight: "3px",
          }}
        >
          <FiTrash2 style={{ fontSize: "15px", color: "#5d6d7e" }} onClick={() => props.onClickDeleteAssignedDocumentToService(props.data)} />
        </span>
      ) : null}
    </div>
  );
};

function AssignUnassignDocumentToState({ toggelAssignUnassignDocumenttoStateClick, selectedState, selectedService, setAlertMessage }) {
  const [serviceDocumentGridApi, setServiceDocumentGridApi] = useState();
  const onServiceDocumentGridReady = (params) => {
    setServiceDocumentGridApi(params.api);
  };

  const [searchTextAssigendServiceDocument, setSearchTextAssigendServiceDocument] = useState("");
  const onSearchAssignedServiceDocument = (val) => {
    debugger;
    setSearchTextAssigendServiceDocument(val);
    serviceDocumentGridApi.setQuickFilter(val);
    serviceDocumentGridApi.refreshCells();
  };

  const [assignedServiceDocumentList, setAssignedServiceDocumentList] = useState([]);
  const [isLoadingAssignedServiceDocumentList, setIsLoadingAssignedServiceDocumentList] = useState(false);
  const getAssignedServiceDocumentListData = async () => {
    debugger;
    try {
      setAssignedServiceDocumentList([]);
      setIsLoadingAssignedServiceDocumentList(true);
      const formdata = {
        viewMode: "GETASSIGNED",
        stateServiceAssignID: 0,
        serviceTypeID: selectedService && selectedService.ServiceTypeID ? selectedService.ServiceTypeID : 0,
        serviceFees: 0,
        stateCode: selectedState && selectedState.StateCode ? selectedState.StateCode.toString() : "0",
        documentTypeID: "",
      };
      const result = await serviceTypeDocumentAssignManageData(formdata);
      setIsLoadingAssignedServiceDocumentList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData) {
          setAssignedServiceDocumentList(result.response.responseData);
        } else {
          setAssignedServiceDocumentList([]);
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

  const onClickDeleteAssignedDocumentToService = async (data) => {
    debugger;
    try {
      const formdata = {
        viewMode: "UNASSIGN",
        stateServiceAssignID: data && data.StateServiceAssignID ? data.StateServiceAssignID : 0,
        serviceTypeID: selectedService && selectedService.ServiceTypeID ? selectedService.ServiceTypeID : 0,
        stateCode: selectedState && selectedState.StateCode ? selectedState.StateCode.toString() : "0",
        serviceFees:
          assignedServiceDocumentList && assignedServiceDocumentList.length > 0 && assignedServiceDocumentList[0].ServiceFees
            ? assignedServiceDocumentList[0].ServiceFees
            : 0,
        documentTypeID: data.documentTypeID ? data.documentTypeID.toString() : "0",
      };
      const result = await serviceTypeDocumentAssignManageData(formdata);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        data.AssignmentFlag = 0;
        if (serviceDocumentGridApi) {
          const itemsToUpdate = [];
          serviceDocumentGridApi.forEachNode(function (rowNode) {
            if (rowNode.data.DocumentTypeID === data.DocumentTypeID) {
              itemsToUpdate.push(data);
              rowNode.setData(data);
            }
          });
          serviceDocumentGridApi.updateRowData({
            update: itemsToUpdate,
          });
        }
      } else {
        setAlertMessage({
          open: true,
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({ open: true, type: "error", message: error });
      console.log(error);
    }
  };

  useEffect(() => {
    debugger;
    getAssignedServiceDocumentListData();
  }, [selectedState, selectedService]);

  const getRowStyle = (params) => {
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.data.IsSelected) {
      return { background: "#ffc176" };
    }
    return { background: "" };
  };

  const getSelectedRowData = () => {
    const selectedNodes = serviceDocumentGridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  const [openServiceFeeModal, setOpenServiceFeeModal] = useState(false);
  const toggelServiceFeeClick = () => {
    setOpenServiceFeeModal(!openServiceFeeModal);
  };

  const [documentTypeIDs, setdocumentTypeIDs] = useState(false);
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async () => {
    debugger;
    try {
      const checkedItem = getSelectedRowData();
      if (checkedItem.length === 0) {
        setAlertMessage({
          type: "warning",
          message: "Please select atleast one document.",
        });
        return;
      }
      const documentTypesIds = checkedItem
        .map((data) => {
          return data.DocumentTypeID;
        })
        .join(",");
      if (checkedItem[0].ServiceFees === 0) {
        setdocumentTypeIDs(documentTypesIds);
        toggelServiceFeeClick();
        return;
      }

      setBtnLoaderActive(true);

      const formdata = {
        viewMode: "ASSIGN",
        stateServiceAssignID: 0,
        serviceTypeID: selectedService && selectedService.ServiceTypeID ? selectedService.ServiceTypeID : 0,
        stateCode: selectedState && selectedState.StateCode ? selectedState.StateCode.toString() : "0",
        serviceFees: checkedItem[0].ServiceFees,
        documentTypeID: documentTypesIds,
      };

      const result = await serviceTypeDocumentAssignManageData(formdata);
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        if (result.response.responseData) {
          const responseAssignedIds = result.response.responseData.StateServiceAssignID ? result.response.responseData.StateServiceAssignID.split(",") : [];
          console.log(responseAssignedIds);
          let assignedIds = [];
          if (responseAssignedIds.length > 0) {
            assignedIds = responseAssignedIds.reduce((assignmentIdList, data) => {
              const splitData = data.split("|");
              if (splitData.length > 0 && splitData[0] && splitData[1]) {
                assignmentIdList.push({
                  DocumentTypeID: splitData[0],
                  StateServiceAssignID: splitData[1],
                });
              }
              return assignmentIdList;
            }, []);
          }

          if (assignedIds.length > 0) {
            assignedIds.forEach((data) => {
              assignedServiceDocumentList.forEach((x) => {
                let pDocumentTypeID = "0";
                if (!Array.isArray(x)) {
                  pDocumentTypeID = x.DocumentTypeID.toString();
                } else {
                  pDocumentTypeID = x[0].DocumentTypeID.toString();
                }
                if (pDocumentTypeID === data.DocumentTypeID.toString()) {
                  x.AssignmentFlag = 1;
                  x.DocumentTypeID = data.DocumentTypeID;
                  x.StateServiceAssignID = data.StateServiceAssignID;
                }
              });
            });
          }
        }

        setAssignedServiceDocumentList([]);
        setAssignedServiceDocumentList(assignedServiceDocumentList);
        if (serviceDocumentGridApi) {
          serviceDocumentGridApi.setRowData(assignedServiceDocumentList);
        }
      } else {
        setAlertMessage({
          type: "warning",
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

  const updateAssignedServiceDocumentList = (responseData, pServiceFee) => {
    const responseAssignedIds = responseData.StateServiceAssignID ? responseData.StateServiceAssignID.split(",") : [];
    console.log(responseAssignedIds);
    let assignedIds = [];
    if (responseAssignedIds.length > 0) {
      assignedIds = responseAssignedIds.reduce((assignmentIdList, data) => {
        const splitData = data.split("|");
        if (splitData.length > 0 && splitData[0] && splitData[1]) {
          assignmentIdList.push({
            DocumentTypeID: splitData[0],
            StateServiceAssignID: splitData[1],
          });
        }
        return assignmentIdList;
      }, []);
    }

    if (assignedIds.length > 0) {
      assignedIds.forEach((data) => {
        assignedServiceDocumentList.forEach((x) => {
          let pDocumentTypeID = "0";
          if (!Array.isArray(x)) {
            pDocumentTypeID = x.DocumentTypeID.toString();
          } else {
            pDocumentTypeID = x[0].DocumentTypeID.toString();
          }
          if (pDocumentTypeID === data.DocumentTypeID.toString()) {
            x.AssignmentFlag = 1;
            x.DocumentTypeID = data.DocumentTypeID;
            x.StateServiceAssignID = data.StateServiceAssignID;
          }
          x.ServiceFees = pServiceFee;
          x.AppointmentFeesMasterID = responseData.AppointmentFeeMasterID;
        });
      });
    }
    setAssignedServiceDocumentList([]);
    setAssignedServiceDocumentList(assignedServiceDocumentList);
    if (serviceDocumentGridApi) {
      serviceDocumentGridApi.setRowData(assignedServiceDocumentList);
    }
  };

  const [openEditServiceFeeModal, setOpenEditServiceFeeModal] = useState(false);
  const toggleEditServiceFee = () => {
    setOpenEditServiceFeeModal(!openEditServiceFeeModal);
  };

  return (
    <>
      {openServiceFeeModal && (
        <ServiceFeePopUp
          toggelServiceFeeClick={toggelServiceFeeClick}
          selectedState={selectedState}
          selectedService={selectedService}
          documentTypeIDs={documentTypeIDs}
          updateAssignedServiceDocumentList={updateAssignedServiceDocumentList}
          setAlertMessage={setAlertMessage}
        />
      )}
      {openEditServiceFeeModal && (
        <EditServiceFeePopup
          toggleEditServiceFee={toggleEditServiceFee}
          assignedServiceDocumentList={assignedServiceDocumentList}
          setAlertMessage={setAlertMessage}
        />
      )}
      <Modal
        varient="half"
        title={`Assign Un-Assign Service Document To State List (${selectedState && selectedState.StateMasterName ? selectedState.StateMasterName : ""})`}
        // A title="Assign Un-Assign Service Document To State List"
        show={toggelAssignUnassignDocumenttoStateClick}
        left="0"
        width="50.5vw"
      >
        <Modal.Body>
          <div className={BizClass.CardPopUp}>
            <PageBar>
              <span style={{ paddingRight: "260px", color: "#fff", fontWeight: "normal", fontSize: "15px" }}>
                Service Fee :{" "}
                {assignedServiceDocumentList && assignedServiceDocumentList.length > 0 && assignedServiceDocumentList[0].ServiceFees
                  ? assignedServiceDocumentList[0].ServiceFees
                  : 0}{" "}
                &nbsp;
                {assignedServiceDocumentList && assignedServiceDocumentList.length > 0 && assignedServiceDocumentList[0].ServiceFees !== 0 ? (
                  <AiFillEdit style={{ verticalAlign: "bottom", fontSize: "18px", cursor: "pointer" }} onClick={() => toggleEditServiceFee()} />
                ) : null}
              </span>
              <PageBar.Search value={searchTextAssigendServiceDocument} onChange={(e) => onSearchAssignedServiceDocument(e.target.value)} />
            </PageBar>
            <DataGrid
              rowData={assignedServiceDocumentList}
              loader={isLoadingAssignedServiceDocumentList ? <Loader /> : false}
              suppressRowClickSelection={true}
              rowSelection="multiple"
              frameworkComponents={{
                cellServiceDocumentTemplate,
              }}
              getRowStyle={getRowStyle}
              onGridReady={onServiceDocumentGridReady}
            >
              <DataGrid.Column
                lockPosition="1"
                pinned="left"
                headerName=""
                field=""
                width={75}
                checkboxSelection={(param) => {
                  console.log(param);
                  return param.data.AssignmentFlag === 0;
                }}
                cellRenderer="cellServiceDocumentTemplate"
                cellRendererParams={{
                  onClickDeleteAssignedDocumentToService,
                }}
              />
              <DataGrid.Column
                field="AssignmentFlag"
                headerName="Status"
                width={110}
                valueFormatter={(param) => (param.value === 1 ? "Assigned" : " Not Assigned")}
              />
              <DataGrid.Column field="DocumentName" headerName="Document Name" width={612} />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button type="Button" varient="primary" onClick={() => toggelServiceFeeClick()}>
            Service Fee
          </Button> */}
          <Button type="Button" varient="danger" onClick={(e) => handleSave(e)} trigger={btnLoaderActive ? "true" : "false"}>
            Assign
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AssignUnassignDocumentToState;

AssignUnassignDocumentToState.propTypes = {
  toggelAssignUnassignDocumenttoStateClick: PropTypes.func.isRequired,
  setAlertMessage: PropTypes.func.isRequired,
  selectedService: PropTypes.object,
  selectedState: PropTypes.object,
};
