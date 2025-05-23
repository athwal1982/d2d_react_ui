import { React, useState, useEffect } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Loader } from "Framework/Components/Widgets";
import { FaFileUpload } from "react-icons/fa";
import { RiFileList3Line } from "react-icons/ri";
import { setSessionStorage, getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getDTDSMasterDataBindingDataList } from "../../D2DService/Service/Method";
import { getServiceData } from "./Service/Method";
import VistingFeeOrVLESetup from "./Modal/VistingFeeOrVLESetup";
import ImportServiceData from "./Modal/ImportServiceData";
import ServiceDocumentList from "../../D2DService/Modal/ServiceDocumentList";
import BizClass from "./ServiceManagement.module.scss";

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
function ServiceManagement() {
  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");
  const [formValues, setFormValues] = useState({
    txtState: null,
  });

  const updateState = (name, value) => {
    debugger;
    setFormValues({ ...formValues, [name]: value });
    if (name === "txtState") {
      setFormValues({
        ...formValues,
        txtState: value,
      });
    }
  };

  const [serviceGridApi, setServiceGridApi] = useState();
  const onServiceGridReady = (params) => {
    setServiceGridApi(params.api);
  };

  const [serviceList, setServiceList] = useState([]);
  const [isLoadingServiceList, setIsLoadingServiceList] = useState(false);
  const getServiceListData = async () => {
    try {
      debugger;
      if (formValues.txtState === null) {
        setAlertMessage({
          type: "error",
          message: "Please select state.",
        });
        return;
      }
      setIsLoadingServiceList(true);
      const formdata = {
        stateID: formValues && formValues.txtState ? formValues.txtState.StateCode : 0,
      };
      const result = await getServiceData(formdata);
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
        message: error,
      });
    }
  };

  const [searchServiceText, setsearchServiceText] = useState("");
  const onSearchService = (val) => {
    setsearchServiceText(val);
    serviceGridApi.setQuickFilter(val);
    serviceGridApi.refreshCells();
  };

  const [selectedService, setSelectedService] = useState();
  const [vistingFeeOrVLESetupModal, setVistingFeeOrVLESetupModal] = useState(false);
  const toggleVistingFeeOrVLESetupModal = (pType) => {
    setSelectedService({});
    setSessionStorage("VistingFeeOrVLESetup", pType);
    setVistingFeeOrVLESetupModal(!vistingFeeOrVLESetupModal);
  };

  const [openImportServiceDataModal, setOpenImportServiceDataModal] = useState(false);
  const openImportServiceDataPopUp = () => {
    setOpenImportServiceDataModal(!openImportServiceDataModal);
  };

  const [stateList, setStateList] = useState([]);
  const [isLoadingStateList, setIsLoadingStateList] = useState(false);
  const getStateListData = async () => {
    try {
      setStateList([]);
      setIsLoadingStateList(true);
      const formdata = {
        filterID: 0,
        filterID1: userData && userData.LoginID ? userData.LoginID : 0,
        filterID2: "",
        filterID3: "",
        // A masterName: "DTDSSTATE",
        masterName: "GETSTATE",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      console.log(result, "State Data");
      setIsLoadingStateList(false);
      if (result.response.responseCode === 1) {
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
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
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
  useEffect(() => {
    getStateListData();
  }, []);
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
      {vistingFeeOrVLESetupModal && (
        <VistingFeeOrVLESetup
          toggleVistingFeeOrVLESetupModal={toggleVistingFeeOrVLESetupModal}
          selectedService={selectedService}
          setAlertMessage={setAlertMessage}
        />
      )}
      {openImportServiceDataModal && <ImportServiceData showfunc={openImportServiceDataPopUp} />}
      <div className={BizClass.PageStart}>
        <PageBar>
          <span style={{ cursor: "pointer", color: "#fff", fontSize: "20px" }}>
            {" "}
            <FaFileUpload title="Import Servcie Data" onClick={() => openImportServiceDataPopUp(true)} />{" "}
          </span>
          <PageBar.Button onClick={() => toggleVistingFeeOrVLESetupModal("VS")}>VLE Setup</PageBar.Button>
          <PageBar.Select
            ControlTxt="txtState"
            name="SearchByFilter"
            getOptionLabel={(option) => `${option.StateMasterName}`}
            getOptionValue={(option) => `${option}`}
            options={stateList}
            isLoading={isLoadingStateList}
            value={formValues.txtState}
            onChange={(e) => updateState("txtState", e)}
          />
          <PageBar.Search onClick={() => getServiceListData(true)} value={searchServiceText} onChange={(e) => onSearchService(e.target.value)} />
        </PageBar>
        <DataGrid
          rowData={serviceList}
          loader={isLoadingServiceList ? <Loader /> : false}
          getRowStyle={getRowStyle}
          onGridReady={onServiceGridReady}
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
          <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} />
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
    </>
  );
}

export default ServiceManagement;
