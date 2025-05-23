import { React, useEffect, useState } from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import { Loader } from "Framework/Components/Widgets";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";
import PropTypes from "prop-types";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getDTDSMasterDataBindingDataList } from "../../../D2DService/Service/Method";
import { updateVLEMapAutoModeData } from "../Service/Method";
import AddEditVisitingFee from "./AddEditVisitingFee";
import BizClass from "../ServiceManagement.module.scss";

const cellTemplate = (props) => {
  const pvistingFeeOrVLESetup = getSessionStorage("VistingFeeOrVLESetup");
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      {pvistingFeeOrVLESetup && pvistingFeeOrVLESetup === "VF" ? (
        props.data.AgentVisitingFees === null ? (
          <IoMdAddCircleOutline
            style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
            title="Add Visting Fee"
            onClick={() => props.toggelAddEditVistingFeeClick(props.data)}
          />
        ) : (
          <AiFillEdit
            style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
            title="Edit Visting Fee"
            onClick={() => props.toggelAddEditVistingFeeClick(props.data)}
          />
        )
      ) : pvistingFeeOrVLESetup && pvistingFeeOrVLESetup === "VS" ? (
        props.data.VLEMapAuto === "YES" ? (
          <BsToggleOn
            title="VLE Setup Manual"
            style={{ fontSize: "17px", color: "#4caf50", cursor: "pointer" }}
            onClick={() => props.onVLEMapAutoOrManual(props.data)}
          />
        ) : (
          <BsToggleOff
            title="VLE Setup Auto"
            style={{ fontSize: "17px", color: "#c72918", cursor: "pointer" }}
            onClick={() => props.onVLEMapAutoOrManual(props.data)}
          />
        )
      ) : null}
    </div>
  );
};

function VistingFeeOrVLESetup({ toggleVistingFeeOrVLESetupModal, selectedService, setAlertMessage }) {
  // A const [formValues, setFormValues] = useState({
  // A  txtService:
  // A    selectedService && selectedService.ServiceTypeID && selectedService.ServiceName
  // A      ? { ServiceTypeID: selectedService.ServiceTypeID, ServiceName: selectedService.ServiceName }
  // A      : null,
  // A });
  // A const updateState = (name, value) => {
  // A  setFormValues({ ...formValues, [name]: value });
  // A };
  const chkvistingFeeOrVLESetup = getSessionStorage("VistingFeeOrVLESetup");
  const [assignedStateToServiceList, setAssignedStateToServiceList] = useState([]);
  const [isLoadingAssignedStateToServiceList, setIsLoadingAssignedStateToServiceList] = useState(false);
  const getStateListData = async () => {
    debugger;
    try {
      setIsLoadingAssignedStateToServiceList(true);
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
      setIsLoadingAssignedStateToServiceList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setAssignedStateToServiceList(result.response.responseData.masterdatabinding);
        } else {
          setAssignedStateToServiceList([]);
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

  useEffect(() => {
    debugger;
    getStateListData();
  }, [selectedService]);

  const getRowStyle = (params) => {
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.data.IsSelected) {
      return { background: "#ffc176" };
    }
    return { background: "" };
  };

  const [openAddEditVistingFeeModal, setOpenAddEditVistingFeeModal] = useState(false);
  const [selectedState, setSelectedState] = useState({});
  const toggelAddEditVistingFeeClick = (data) => {
    setSelectedState(data);
    setOpenAddEditVistingFeeModal(!openAddEditVistingFeeModal);
  };

  const VLEMapAutoOrManualUpdate = async (data, pvLEMapAuto) => {
    debugger;
    try {
      const updatevLEMapAuto = pvLEMapAuto && pvLEMapAuto === "YES" ? "NO" : pvLEMapAuto === "NO" ? "YES" : "";
      const formdata = {
        stateMasterID: data.StateMasterID,
        vLEMapAuto: updatevLEMapAuto,
      };
      const result = await updateVLEMapAutoModeData(formdata);
      if (result.response.responseCode === 1) {
        if (serviceToStateGridApi) {
          const itemsToUpdate = [];
          serviceToStateGridApi.forEachNode(function (rowNode) {
            if (rowNode.data.StateMasterID.toString() === data.StateMasterID.toString()) {
              if (pvLEMapAuto === "YES") {
                data.VLEMapAuto = "NO";
              } else if (pvLEMapAuto === "NO") {
                data.VLEMapAuto = "YES";
              }
              itemsToUpdate.push(data);
              rowNode.setData(data);
            }
          });
          serviceToStateGridApi.updateRowData({
            update: itemsToUpdate,
          });
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });
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

  const onVLEMapAutoOrManual = (data) => {
    VLEMapAutoOrManualUpdate(data, data.VLEMapAuto);
  };

  return (
    <>
      {openAddEditVistingFeeModal && (
        <AddEditVisitingFee toggelAddEditVistingFeeClick={toggelAddEditVistingFeeClick} selectedState={selectedState} setAlertMessage={setAlertMessage} />
      )}
      <Modal
        varient="half"
        title={chkvistingFeeOrVLESetup === "VF" ? "State Wise Visting Fee" : chkvistingFeeOrVLESetup === "VS" ? "State Wise VLE Setup" : ""}
        show={toggleVistingFeeOrVLESetupModal}
        right="0"
        width="48.5vw"
      >
        <Modal.Body>
          <div className={BizClass.CardPopUp}>
            <PageBar>
              <PageBar.Search value={searchTextAssigendServiceToState} onChange={(e) => onSearchAssignedServiceToState(e.target.value)} />
            </PageBar>
            <DataGrid
              rowData={assignedStateToServiceList}
              loader={isLoadingAssignedStateToServiceList ? <Loader /> : false}
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
                  toggelAddEditVistingFeeClick,
                  onVLEMapAutoOrManual,
                }}
              />
              <DataGrid.Column
                field="#"
                headerName="VLE Map Mode"
                width={132}
                valueGetter={(node) => {
                  return node.data.VLEMapAuto && node.data.VLEMapAuto === "YES" ? "Auto" : node.data.VLEMapAuto === "NO" ? "Manual" : "";
                }}
                hide={chkvistingFeeOrVLESetup === "VF"}
              />
              <DataGrid.Column
                field="StateMasterName"
                headerName="State Name"
                width={chkvistingFeeOrVLESetup === "VS" ? 415 : chkvistingFeeOrVLESetup === "VF" ? 400 : 0}
              />
              <DataGrid.Column field="AgentVisitingFees" headerName="Visting Fee" width={150} hide={chkvistingFeeOrVLESetup === "VS"} />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
}

export default VistingFeeOrVLESetup;

VistingFeeOrVLESetup.propTypes = {
  toggleVistingFeeOrVLESetupModal: PropTypes.func.isRequired,
  selectedService: PropTypes.object,
  setAlertMessage: PropTypes.func.isRequired,
};
