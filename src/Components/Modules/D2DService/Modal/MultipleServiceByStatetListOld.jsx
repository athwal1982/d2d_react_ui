import React, { useState } from "react";
import { Loader, Button } from "Framework/Components/Widgets";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { RiFileList3Line } from "react-icons/ri";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { PropTypes } from "prop-types";
import BizClass from "../D2DServcie.module.scss";
import ServiceDocumentList from "./ServiceDocumentList";
// A import { getDTDSMasterDataBindingDataList } from "../Service/Method";

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
function MultipleServiceByStatetList({
  serviceTypeDropdownDataList,
  isLoadingServiceTypeDropdownDataList,
  toggleMultipleServiceByStateClick,
  // A selectedState,
  serviceTypeData,
  setServiceTypeData,
  updateformState,
  setFormValuesForConsumer,
  formValuesForConsumer,
  setAlertMessage,
}) {
  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const [searchTextService, setSearchTextService] = useState("");
  const onSearchService = (val) => {
    debugger;
    setSearchTextService(val);
    gridApi.setQuickFilter(val);
  };

  // A const [selectedServices, setSelectedServices] = useState([]);
  const getSelectedRowData = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  const selectServiceListClick = () => {
    debugger;
    const checkedItem = getSelectedRowData();
    if (checkedItem.length === 0) {
      setAlertMessage({
        type: "warning",
        message: "Please select atleast one service.",
      });
      return;
    }
    if (checkedItem.length > 3) {
      setAlertMessage({
        type: "warning",
        message: "Maximum 3 services is allowed at a time.",
      });
      return;
    }
    const ServiceTypeIDs = checkedItem
      .map((data) => {
        return data.ServiceTypeID;
      })
      .join(",");

    setServiceTypeData(ServiceTypeIDs);
    let pServiceFee = 0;

    checkedItem.forEach((v) => {
      pServiceFee += Number(v.ServiceFees);
    });
    setFormValuesForConsumer({
      ...formValuesForConsumer,
      txtServiceFee: pServiceFee,
      txtDocumentRequired: null,
    });
    updateformState("SelectServc");
    toggleMultipleServiceByStateClick();
  };

  const unselectServiceListClick = () => {
    debugger;
    if (gridApi) {
      gridApi.forEachNode(function (rowNode) {
        rowNode.setSelected(false);
      });
    }
    setServiceTypeData("");
    setFormValuesForConsumer({
      ...formValuesForConsumer,
      txtServiceFee: "",
      txtDocumentRequired: null,
    });
    updateformState("UnselectServc");
    // A toggleMultipleServiceByStateClick();
  };

  const getRowStyle = (params) => {
    debugger;
    let selectedServicesArry = [];
    selectedServicesArry = serviceTypeData.split(",");
    let pselectedService = "";
    for (let i = 0; i < selectedServicesArry.length; i += 1) {
      if (Number(selectedServicesArry[i]) === params.data.ServiceTypeID) {
        pselectedService = Number(selectedServicesArry[i]);
        break;
      }
    }

    if (params.node.data.ServiceTypeID === pselectedService) {
      params.node.setSelected(true);
    } else {
      params.node.setSelected(false);
    }
  };

  // A const [documentData, setDocumentData] = useState("");
  // A const [isLoadingDocumentList, setIsLoadingDocumentList] = useState(false);
  // A const [documentList, setDocumentList] = useState([]);
  // A const getDocumentDataList = async (pServiceTypeID, pStateCode) => {
  // A  debugger;
  // A  try {
  // A    const formdata = {
  // A      filterID: pServiceTypeID,
  // A      filterID1: pStateCode,
  // A      filterID2: "",
  // A      filterID3: "",
  // A      masterName: "SRVDOCTYP",
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

  // A        setDocumentData(documentTypeIDs);
  // A      } else {
  // A        setDocumentList([]);
  // A        setDocumentData("");
  // A      }
  // A    } else {
  // A      setAlertMessage({
  // A        type: "error",
  // A        message: result.response.responseMessage,
  // A      });
  // A   }
  // A  } catch (error) {
  // A    setAlertMessage({
  // A      type: "error",
  // A      message: error,
  // A    });
  // A  }
  // A };

  const [openDocumentModal, setOpenDocumentModal] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const selectDocumentClick = (data) => {
    debugger;
    if (data) {
      setSelectedData(data);
      // A if (data && data.ServiceTypeID) {
      // A  getDocumentDataList(data.ServiceTypeID, selectedState.StateCode);
      // A }
    }
    setOpenDocumentModal(!openDocumentModal);
  };

  return (
    <>
      {" "}
      {openDocumentModal && (
        <ServiceDocumentList
          selectedData={selectedData}
          // A isLoadingDocumentList={isLoadingDocumentList}
          selectDocumentClick={selectDocumentClick}
          setAlertMessage={setAlertMessage}
          // A documentList={documentList}
          // A documentData={documentData}
          // A setDocumentData={setDocumentData}
        />
      )}
      <Modal varient="half" title="Service List" right="0" width="75.5vw" show={toggleMultipleServiceByStateClick}>
        <Modal.Body>
          <div className={BizClass.myCardGrid}>
            <PageBar>
              <PageBar.Search value={searchTextService} onChange={(e) => onSearchService(e.target.value)} />
            </PageBar>
            <span className={BizClass.span_service} />
            <DataGrid
              rowData={serviceTypeDropdownDataList}
              loader={isLoadingServiceTypeDropdownDataList ? <Loader /> : null}
              onGridReady={onGridReady}
              suppressRowClickSelection={true}
              rowSelection="multiple"
              getRowStyle={getRowStyle}
              cellRenderer="actionTemplate"
              frameworkComponents={{
                cellTemplate,
              }}
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
              <DataGrid.Column
                lockPosition="1"
                pinned="left"
                headerName=""
                field=""
                width={75}
                headerCheckboxSelection
                headerCheckboxSelectionFilteredOnly
                checkboxSelection={true}
              />
              {/* <DataGrid.Column field="#" headerName="Sr No." width={75} valueGetter="node.rowIndex + 1" pinned="left" /> */}
              <DataGrid.Column field="ServiceFees" headerName="Service Fee" width={110} cellStyle={{ "text-align": "right" }} />
              <DataGrid.Column field="ServiceName" headerName="Service Name" width={750} />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button varient="danger" onClick={() => selectServiceListClick()}>
            Select
          </Button>
          <Button varient="danger" onClick={() => unselectServiceListClick()}>
            Unselect
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MultipleServiceByStatetList;

MultipleServiceByStatetList.propTypes = {
  // A selectedData: PropTypes.object,
  toggleMultipleServiceByStateClick: PropTypes.func.isRequired,
  setAlertMessage: PropTypes.func.isRequired,
  // A ServiceData: PropTypes.object,
  setServiceData: PropTypes.func.isRequired,
  isLoadingServiceTypeDropdownDataList: PropTypes.func.isRequired,
  serviceTypeDropdownDataList: PropTypes.array,
  // A selectedState: PropTypes.object,
  serviceTypeData: PropTypes.object,
  setServiceTypeData: PropTypes.func.isRequired,
  updateformState: PropTypes.func.isRequired,
  setFormValuesForConsumer: PropTypes.object,
  formValuesForConsumer: PropTypes.func.isRequired,
  // A ServiceData: PropTypes.object,
};
