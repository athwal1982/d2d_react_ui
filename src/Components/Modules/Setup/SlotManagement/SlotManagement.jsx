import { React, useState } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Loader, Splitter } from "Framework/Components/Widgets";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import PropTypes from "prop-types";
import { HiArrowCircleRight } from "react-icons/hi";
import { getDTDSMasterDataBindingDataList } from "../../D2DService/Service/Method";
import { getSlotData, isActiveSlotData } from "./Service/Method";
import BizClass from "./SlotManagement.module.scss";
import AddSlot from "./Modal/AddSlot";

const cellTemplate = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      <HiArrowCircleRight
        title="Slot List"
        style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
        onClick={() => props.toggleStateWiseSlotListModal(props.data)}
      />
    </div>
  );
};

const cellSlotTemplate = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      {props.data && props.data.IsActive === "YES" ? (
        <BsToggleOn style={{ fontSize: "17px", color: "#4caf50" }} title="In-Active" onClick={() => props.toggleOnActiveInactive(props.data)} />
      ) : (
        <BsToggleOff style={{ fontSize: "17px", color: "#ff0000" }} title="Active" onClick={() => props.toggleOnActiveInactive(props.data)} />
      )}
    </div>
  );
};

function SlotManagement() {
  const setAlertMessage = AlertMessage();

  const [selectedState, setSelectedState] = useState();

  const [slotGridApi, setSlotGridApi] = useState();
  const onSlotGridReady = (params) => {
    setSlotGridApi(params.api);
  };
  const [searchSlotText, setsearchSlotText] = useState("");
  const onSearchSlot = (val) => {
    setsearchSlotText(val);
    slotGridApi.setQuickFilter(val);
    slotGridApi.refreshCells();
  };

  const [stateGridApi, setStateGridApi] = useState();
  const onStateGridReady = (params) => {
    setStateGridApi(params.api);
  };

  const [searchStateText, setsearchStateText] = useState("");
  const onSearchState = (val) => {
    setsearchStateText(val);
    stateGridApi.setQuickFilter(val);
    stateGridApi.refreshCells();
  };

  const [stateList, setStateList] = useState([]);
  const [isLoadingStateList, setIsLoadingStateList] = useState(false);
  const getStateListData = async () => {
    try {
      debugger;
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
      setIsLoadingStateList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
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

  const [slotList, setSlotList] = useState([]);
  const [isLoadingSlotList, setIsLoadingSlotList] = useState(false);
  const getSlotListData = async (pStateCode) => {
    try {
      debugger;
      setIsLoadingSlotList(true);
      const formdata = {
        stateCode: pStateCode,
      };
      const result = await getSlotData(formdata);
      setIsLoadingSlotList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (result.response.responseData && result.response.responseData && result.response.responseData.length > 0) {
            setSlotList(result.response.responseData);
          } else {
            setSlotList([]);
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

  const setSelectedRowColorStateToSlot = (pStateCode) => {
    if (stateGridApi) {
      stateGridApi.forEachNode(function (rowNode) {
        if (rowNode.data.StateCode === pStateCode) {
          const newData = {
            ...rowNode.data,
            IsSelected: true,
          };
          rowNode.setData(newData);
        } else {
          rowNode.data.IsSelected = false;
          rowNode.setData(rowNode.data);
        }
      });
    }
  };

  const toggleStateWiseSlotListModal = (data) => {
    setSelectedState(data);
    setSelectedRowColorStateToSlot(data.StateCode ? data.StateCode : 0);
    getSlotListData(data.StateCode ? data.StateCode : 0);
  };

  const [addSlotModal, setAddSlotModal] = useState(false);
  const toggleAddSlotModal = () => {
    if (!selectedState) {
      setAlertMessage({
        type: "warning",
        message: "Please select state.",
      });
      return;
    }
    setAddSlotModal(!addSlotModal);
  };

  const updateSlotData = (addedData) => {
    if (slotGridApi) {
      const rowData = [];
      if (addedData && addedData.length > 0) {
        addedData.forEach((data) => {
          rowData.push(data);
        });
      }
      slotGridApi.forEachNode((node) => rowData.push(node.data));
      slotGridApi.setRowData(rowData);
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

  const UpdateActiveInactive = async (data) => {
    try {
      const formData = {
        appointmentSlotID: data && data.AppointmentSlotID ? data.AppointmentSlotID : 0,
        isActive: data && data.IsActive ? (data.IsActive === "NO" ? "YES" : "NO") : "",
      };
      const result = await isActiveSlotData(formData);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });

        if (slotGridApi) {
          const itemsToUpdate = [];
          slotGridApi.forEachNode(function (rowNode) {
            if (rowNode.data.AppointmentSlotID.toString() === data.AppointmentSlotID.toString()) {
              if (data.IsActive === "YES") {
                data.IsActive = "NO";
              } else if (data.IsActive === "NO") {
                data.IsActive = "YES";
              }
              itemsToUpdate.push(data);
              rowNode.setData(data);
            }
          });
          slotGridApi.updateRowData({
            update: itemsToUpdate,
          });
          console.log(itemsToUpdate);
        }
      } else {
        setAlertMessage({
          type: "error",
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

  const toggleOnActiveInactive = async (data) => {
    debugger;
    UpdateActiveInactive(data);
  };

  return (
    <>
      {addSlotModal && (
        <AddSlot toggleAddSlotModal={toggleAddSlotModal} selectedState={selectedState} updateSlotData={updateSlotData} setAlertMessage={setAlertMessage} />
      )}
      <div className={BizClass.PageStart}>
        <Splitter varient="column" template="1fr 9px 1fr">
          <div className={BizClass.Card}>
            <PageBar>
              <span style={{ paddingRight: "298px", color: "#fff", fontWeight: "normal", fontSize: "15px" }}>State List</span>
              <PageBar.Search onClick={() => getStateListData(true)} value={searchStateText} onChange={(e) => onSearchState(e.target.value)} />
            </PageBar>
            <DataGrid
              rowData={stateList}
              loader={isLoadingStateList ? <Loader /> : false}
              frameworkComponents={{
                cellTemplate,
              }}
              getRowStyle={getRowStyle}
              onGridReady={onStateGridReady}
            >
              <DataGrid.Column
                headerName="Action"
                lockPosition="1"
                pinned="left"
                width={100}
                cellRenderer="cellTemplate"
                cellRendererParams={{
                  toggleStateWiseSlotListModal,
                }}
              />
              <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} />
              <DataGrid.Column headerName="State Name" field="StateMasterName" width={440} />
            </DataGrid>
          </div>
          <div className={BizClass.Card}>
            <PageBar>
              <span style={{ paddingRight: "190px", color: "#fff", fontWeight: "normal", fontSize: "15px" }}>Slot Master</span>
              <PageBar.Search value={searchSlotText} onChange={(e) => onSearchSlot(e.target.value)} />
              <PageBar.Button onClick={() => toggleAddSlotModal()}>Add Slot</PageBar.Button>
            </PageBar>
            <DataGrid
              rowData={slotList}
              loader={isLoadingSlotList ? <Loader /> : false}
              frameworkComponents={{
                cellSlotTemplate,
              }}
              getRowStyle={getRowStyle}
              onGridReady={onSlotGridReady}
            >
              <DataGrid.Column
                headerName="Action"
                lockPosition="1"
                pinned="left"
                width={100}
                cellRenderer="cellSlotTemplate"
                cellRendererParams={{
                  toggleOnActiveInactive,
                }}
              />
              <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} />
              <DataGrid.Column headerName="From Time" field="AppointmentSlotFrom" width={145} />
              <DataGrid.Column headerName="Duration(Hours)" field="AppointmentDuration" width={150} />
              <DataGrid.Column headerName="To Time" field="AppointmentSlotTo" width={150} />
            </DataGrid>
          </div>
        </Splitter>
      </div>
    </>
  );
}

export default SlotManagement;

SlotManagement.propTypes = {
  toggleServiceToStateListModal: PropTypes.func.isRequired,
};
