import { React, useEffect, useState } from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { HiArrowCircleLeft } from "react-icons/hi";
import PropTypes from "prop-types";
import { getDTDSMasterDataBindingDataList } from "../../../D2DService/Service/Method";
import AssignUnassignDocumentToState from "./AssignUnassignDocumentToState";
import BizClass from "../ServiceManagement.module.scss";

const cellTemplate = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      <HiArrowCircleLeft
        style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
        onClick={() => props.toggelAssignUnassignDocumenttoStateClick(props.data)}
      />
    </div>
  );
};

function ServiceToStateList({ toggleDocumentToServiceStateListModal, selectedService, setAlertMessage }) {
  // A const [formValues, setFormValues] = useState({
  // A  txtService:
  // A    selectedService && selectedService.ServiceTypeID && selectedService.ServiceName
  // A      ? { ServiceTypeID: selectedService.ServiceTypeID, ServiceName: selectedService.ServiceName }
  // A      : null,
  // A });
  // A const updateState = (name, value) => {
  // A  setFormValues({ ...formValues, [name]: value });
  // A };

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

  const setSelectedRowColorServiceToState = (pStateCode) => {
    if (serviceToStateGridApi) {
      serviceToStateGridApi.forEachNode(function (rowNode) {
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
  const [selectedState, setSelectedState] = useState();
  const [assignUnassignDocumentToStateListModal, setAssignUnassignDocumentToStateListModal] = useState(false);
  const toggelAssignUnassignDocumenttoStateClick = (data) => {
    debugger;
    if (data) {
      setSelectedState(data);
      setSelectedRowColorServiceToState(data.StateCode ? data.StateCode : 0);
    }
    setAssignUnassignDocumentToStateListModal(!assignUnassignDocumentToStateListModal);
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

  return (
    <>
      {assignUnassignDocumentToStateListModal && (
        <AssignUnassignDocumentToState
          toggelAssignUnassignDocumenttoStateClick={toggelAssignUnassignDocumenttoStateClick}
          selectedState={selectedState}
          selectedService={selectedService}
          setAlertMessage={setAlertMessage}
        />
      )}
      <Modal varient="half" title="Service To State List" show={toggleDocumentToServiceStateListModal} right="0" width="48.5vw">
        <Modal.Body>
          <div className={BizClass.CardPopUp}>
            <PageBar>
              <span
                title={selectedService && selectedService.ServiceName ? selectedService.ServiceName : ""}
                style={{ color: "#fff", fontWeight: "normal", fontSize: "12px", cursor: "pointer", border: "solid 1px", padding: "2px" }}
              >
                {selectedService && selectedService.ServiceName
                  ? selectedService.ServiceName.length > 55
                    ? `${selectedService.ServiceName.substring(0, 55)} ....`
                    : selectedService.ServiceName
                  : ""}
              </span>
              {/* <PageBar.Select
                ControlTxt="Service"
                name="txtService"
                options={[]}
                getOptionLabel={(option) => `${option.ServiceName}`}
                getOptionValue={(option) => `${option}`}
                value={formValues.txtService}
                onChange={(e) => updateState("txtService", e)}
                isDisabled={true}
              /> */}
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
                  toggelAssignUnassignDocumenttoStateClick,
                }}
              />
              <DataGrid.Column field="StateMasterName" headerName="State Name" width={550} />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
}

export default ServiceToStateList;

ServiceToStateList.propTypes = {
  toggleDocumentToServiceStateListModal: PropTypes.func.isRequired,
  selectedService: PropTypes.object,
  setAlertMessage: PropTypes.func.isRequired,
};
