import { React, useEffect, useState } from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import { FiTrash2 } from "react-icons/fi";
import PropTypes from "prop-types";
import { getDTDSMasterDataBindingDataList } from "../../../D2DService/Service/Method";
import { serviceTypeAssignManageData } from "../Service/Method";
import BizClass from "../ServiceManagement.module.scss";

const cellServiceToStateTemplate = (props) => {
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
          <FiTrash2 style={{ fontSize: "15px", color: "#5d6d7e" }} onClick={() => props.onClickDeleteAssignedServiceToState(props.data)} />
        </span>
      ) : null}
    </div>
  );
};

function AssignUnassignServiceToState({ toggleAssignUnassignServiceToStateListModal, setAlertMessage }) {
  const [assignedServiceToStateList, setAssignedServiceToStateList] = useState([]);
  const [isLoadingAssignedServiceToStateList, setIsLoadingAssignedServiceToStateList] = useState(false);
  // A const getAssignedServiceToStateListData = async (pStateCode) => {
  // A  debugger;
  // A  try {
  // A    setAssignedServiceToStateList([]);
  // A    setIsLoadingAssignedServiceToStateList(true);
  // A    const formdata = {
  // A      viewMode: "GETASSIGNED",
  // A      stateServiceAssignID: 0,
  // A      serviceTypeID: "0",
  // A      stateCode: pStateCode,
  // A    };
  // A    const result = await serviceTypeAssignManageData(formdata);
  // A    setIsLoadingAssignedServiceToStateList(false);
  // A    if (result.response.responseCode === 1) {
  // A      if (result.response.responseData && result.response.responseData) {
  // A        setAssignedServiceToStateList(result.response.responseData);
  // A      } else {
  // A        setAssignedServiceToStateList([]);
  // A      }
  // A    } else {
  // A      setAlertMessage({
  // A        type: "error",
  // A        message: result.response.responseMessage,
  // A      });
  // A    }
  // A  } catch (error) {
  // A    console.log(error);
  // A    setAlertMessage({
  // A      type: "error",
  // A      message: "Something went Wrong! Error Code : 442",
  // A    });
  // A  }
  // A };

  const getAssignedServiceToStateData = async (pStateCode) => {
    debugger;
    try {
      setAssignedServiceToStateList([]);
      setIsLoadingAssignedServiceToStateList(true);
      const formdata = {
        filterID: pStateCode,
        filterID1: 0,
        filterID2: "",
        filterID3: "",
        masterName: "SVCTYP",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      setIsLoadingAssignedServiceToStateList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setAssignedServiceToStateList(result.response.responseData.masterdatabinding);
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
  const [formValues, setFormValues] = useState({
    txtState: null,
  });
  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    if (name === "txtState") {
      setFormValues({
        ...formValues,
        txtState: value,
      });
      setAssignedServiceToStateList([]);
      if (value) {
        // A getAssignedServiceToStateListData(value.StateCode);
        getAssignedServiceToStateData(value.StateCode);
      }
    }
  };

  const [stateDropdownDataList, setStateDropdownDataList] = useState([]);
  const [isLoadingStateDropdownDataList, setIsLoadingStateDropdownDataList] = useState(false);
  const getStateListData = async () => {
    debugger;
    try {
      setIsLoadingStateDropdownDataList(true);
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
      setIsLoadingStateDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          setStateDropdownDataList([]);
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

  const onClickDeleteAssignedServiceToState = async (data) => {
    debugger;
    try {
      const formdata = {
        viewMode: "UNASSIGN",
        stateServiceAssignID: data && data.StateServiceAssignID ? data.StateServiceAssignID : 0,
        serviceTypeID: data.ServiceTypeID ? data.ServiceTypeID.toString() : "0",
        stateCode: formValues && formValues.txtState && formValues.txtState.StateCode ? formValues.txtState.StateCode : 0,
      };
      const result = await serviceTypeAssignManageData(formdata);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        data.AssignmentFlag = 0;
        if (serviceToStateGridApi) {
          const itemsToUpdate = [];
          serviceToStateGridApi.forEachNode(function (rowNode) {
            if (rowNode.data.ServiceTypeID === data.ServiceTypeID) {
              itemsToUpdate.push(data);
              rowNode.setData(data);
            }
          });
          serviceToStateGridApi.updateRowData({
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
    getStateListData();
  }, []);

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
    const selectedNodes = serviceToStateGridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async () => {
    debugger;
    if (formValues.txtState === null) {
      setAlertMessage({
        type: "warning",
        message: "Please select State.",
      });
      return;
    }
    try {
      const checkedItem = getSelectedRowData();
      if (checkedItem.length === 0) {
        setAlertMessage({
          type: "warning",
          message: "Please select atleast one service.",
        });
        return;
      }
      const serviceTypeIDIds = checkedItem
        .map((data) => {
          return data.ServiceTypeID;
        })
        .join(",");
      setBtnLoaderActive(true);

      const formdata = {
        viewMode: "ASSIGN",
        stateServiceAssignID: 0,
        serviceTypeID: serviceTypeIDIds,
        stateCode: formValues && formValues.txtState && formValues.txtState.StateCode ? formValues.txtState.StateCode : 0,
      };

      const result = await serviceTypeAssignManageData(formdata);
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        if (result.response.responseData) {
          const responseAssignedIds = result.response.responseData.SPStateServiceAssignID ? result.response.responseData.SPStateServiceAssignID.split(",") : [];
          console.log(responseAssignedIds);
          let assignedIds = [];
          if (responseAssignedIds.length > 0) {
            assignedIds = responseAssignedIds.reduce((assignmentIdList, data) => {
              const splitData = data.split("|");
              if (splitData.length > 0 && splitData[0] && splitData[1]) {
                assignmentIdList.push({
                  ServiceTypeID: splitData[0],
                  StateServiceAssignID: splitData[1],
                });
              }
              return assignmentIdList;
            }, []);
          }

          if (assignedIds.length > 0) {
            assignedIds.forEach((data) => {
              assignedServiceToStateList.forEach((x) => {
                let pServiceTypeID = "0";
                if (!Array.isArray(x)) {
                  pServiceTypeID = x.ServiceTypeID.toString();
                } else {
                  pServiceTypeID = x[0].ServiceTypeID.toString();
                }
                if (pServiceTypeID === data.ServiceTypeID.toString()) {
                  x.AssignmentFlag = 1;
                  x.ServiceTypeID = data.ServiceTypeID;
                  x.StateServiceAssignID = data.StateServiceAssignID;
                }
              });
            });
          }
        }

        setAssignedServiceToStateList([]);
        setAssignedServiceToStateList(assignedServiceToStateList);
        if (serviceToStateGridApi) {
          serviceToStateGridApi.setRowData(assignedServiceToStateList);
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

  return (
    <Modal
      varient="half"
      // A title="Assign Un-Assign Service To State List"
      title="State To Service List"
      show={toggleAssignUnassignServiceToStateListModal}
      right="0"
      width="59.5vw"
    >
      <Modal.Body>
        <div className={BizClass.CardPopUp}>
          <PageBar>
            <PageBar.Select
              ControlTxt="State"
              name="txtState"
              options={stateDropdownDataList}
              loader={isLoadingStateDropdownDataList ? <Loader /> : null}
              getOptionLabel={(option) => `${option.StateMasterName}`}
              getOptionValue={(option) => `${option}`}
              value={formValues.txtState}
              onChange={(e) => updateState("txtState", e)}
            />
            <PageBar.Search value={searchTextAssigendServiceToState} onChange={(e) => onSearchAssignedServiceToState(e.target.value)} />
          </PageBar>
          <DataGrid
            rowData={assignedServiceToStateList}
            loader={isLoadingAssignedServiceToStateList ? <Loader /> : false}
            suppressRowClickSelection={true}
            rowSelection="multiple"
            frameworkComponents={{
              cellServiceToStateTemplate,
            }}
            getRowStyle={getRowStyle}
            onGridReady={onServiceToStateGridReady}
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
              cellRenderer="cellServiceToStateTemplate"
              cellRendererParams={{
                onClickDeleteAssignedServiceToState,
              }}
              hide={true}
            />
            <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} />
            <DataGrid.Column
              field="AssignmentFlag"
              headerName="Status"
              width={110}
              valueFormatter={(param) => (param.value === 1 ? "Assigned" : " Not Assigned")}
              hide={true}
            />
            <DataGrid.Column field="ServiceName" headerName="Service Name" width={717} />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="Button" varient="danger" onClick={(e) => handleSave(e)} trigger={btnLoaderActive ? "true" : "false"} style={{ display: "none" }}>
          Assign
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AssignUnassignServiceToState;

AssignUnassignServiceToState.propTypes = {
  toggleAssignUnassignServiceToStateListModal: PropTypes.func.isRequired,
  setAlertMessage: PropTypes.func.isRequired,
};
