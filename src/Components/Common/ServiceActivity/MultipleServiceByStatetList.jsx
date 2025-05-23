import React, { useState, useEffect } from "react";
import { Loader, Button } from "Framework/Components/Widgets";
import { Form, DataGrid, PageBar } from "Framework/Components/Layout";
import { RiFileList3Line } from "react-icons/ri";
import { AiOutlinePlus, AiFillDelete } from "react-icons/ai";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { PropTypes } from "prop-types";
import classNames from "classnames";
import BizClass from "./ServiceActivity.module.scss";
import ServiceDocumentList from "./ServiceDocumentList";
import { getDTDSMasterDataBindingDataList } from "../../Modules/D2DService/Service/Method";

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
  arrServiceToMultipleApplicant,
  setarrServiceToMultipleApplicant,
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

  const [formValuesServiceToMultipleApplicant, setFormValuesServiceToMultipleApplicant] = useState({
    addedServiceToMultipleApplicant: arrServiceToMultipleApplicant,
  });

  const [formValuesServiceMultiple, setFormValuesServiceMultiple] = useState({
    txtServiceToMultipleApplicant: null,
  });

  const updateServiceTMultiple = (name, value) => {
    setFormValuesServiceMultiple({ ...formValuesServiceMultiple, [name]: value });
  };
  const updateServiceToMultipleApplicantState = (name, value, index) => {
    debugger;
    const arrServices = [...formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant];
    arrServices[index][name] = value;
    setFormValuesServiceToMultipleApplicant({ ...formValuesServiceToMultipleApplicant, addedServiceToMultipleApplicant: arrServices });
  };

  const removeServiceToMultipleApplicant = (index) => {
    debugger;
    arrServiceToMultipleApplicant.splice(index, 1);
    setarrServiceToMultipleApplicant(arrServiceToMultipleApplicant);
    setFormValuesServiceToMultipleApplicant({ ...formValuesServiceToMultipleApplicant, addedServiceToMultipleApplicant: arrServiceToMultipleApplicant });
  };

  const [pnlServiceToMultipleApplicant, setPnlServiceToMultipleApplicant] = useState(true);
  const [serviceToMultipleApplicantList, setServiceToMultipleApplicantList] = useState([]);

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
    // A if (checkedItem.length > 3) {
    // A  setAlertMessage({
    // A    type: "warning",
    // A    message: "Maximum 3 services is allowed at a time.",
    // A  });
    // A  return;
    // A }
    const ServiceTypeIDs = checkedItem
      .map((data) => {
        return data.ServiceTypeID;
      })
      .join(",");

    setServiceTypeData(ServiceTypeIDs);
    setServiceTypeData(ServiceTypeIDs);
    setPnlServiceToMultipleApplicant(false);
    setServiceToMultipleApplicantList(checkedItem);
  };

  const unselectServiceListClick = () => {
    debugger;
    if (gridApi) {
      gridApi.forEachNode(function (rowNode) {
        rowNode.setSelected(false);
      });
    }
    setServiceTypeData("");
    setarrServiceToMultipleApplicant([]);
    setServiceToMultipleApplicantList([]);
    setFormValuesForConsumer({
      ...formValuesForConsumer,
      txtServiceFee: "",
      txtVistingFee: "",
      txtDocumentRequired: null,
    });
    setFormValuesServiceToMultipleApplicant({ ...formValuesServiceToMultipleApplicant, addedServiceToMultipleApplicant: [] });
    updateformState("UnselectServc");
    // A toggleMultipleServiceByStateClick();
  };

  const getRowStyle = (params) => {
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

  const [relationDropdownDataList, seRelationDropdownDataList] = useState([]);
  const [isLoadingRelationDropdownDataList, setIsLoadingRelationDropdownDataList] = useState(false);
  const getRelationListData = async () => {
    try {
      setIsLoadingRelationDropdownDataList(true);
      const formdata = {
        filterID: 134,
        filterID1: 0,
        filterID2: "",
        filterID3: "",
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      setIsLoadingRelationDropdownDataList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          seRelationDropdownDataList(result.response.responseData.masterdatabinding);
        } else {
          seRelationDropdownDataList([]);
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

  const BackClick = () => {
    setPnlServiceToMultipleApplicant(true);
  };
  const addServiceToMultipleApplicant = () => {
    debugger;
    if (formValuesServiceMultiple.txtServiceToMultipleApplicant === null) {
      setAlertMessage({ type: "error", message: "Please select service." });
      return;
    }
    if (formValuesServiceMultiple.txtrelationTermID === null) {
      setAlertMessage({ type: "error", message: "Please select relation." });
      return;
    }
    let rtnval = true;
    for (let i = 0; i < formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant.length; i += 1) {
      if (!rtnval) {
        return;
      }
      if (
        formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant[i].relationTermID ===
          formValuesServiceMultiple.txtrelationTermID.CommonMasterValueID &&
        formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant[i].serviceTypeID ===
          formValuesServiceMultiple.txtServiceToMultipleApplicant.ServiceTypeID
      ) {
        setAlertMessage({
          open: true,
          type: "error",
          message: `Service already exist with relation at row ${i + 1}`,
        });
        rtnval = false;
        break;
      }
    }
    if (rtnval === true) {
      arrServiceToMultipleApplicant.push({
        name: formValuesServiceMultiple.txtrelationTermID.CommonMasterValueID === 134001 ? formValuesForConsumer.txtApplicantName : "",
        relationName:
          formValuesServiceMultiple && formValuesServiceMultiple.txtrelationTermID.CommonMasterValue
            ? formValuesServiceMultiple.txtrelationTermID.CommonMasterValue
            : null,
        relationTermID:
          formValuesServiceMultiple && formValuesServiceMultiple.txtrelationTermID.CommonMasterValueID
            ? formValuesServiceMultiple.txtrelationTermID.CommonMasterValueID
            : null,
        serviceTypeID:
          formValuesServiceMultiple && formValuesServiceMultiple.txtServiceToMultipleApplicant
            ? formValuesServiceMultiple.txtServiceToMultipleApplicant.ServiceTypeID
            : null,
        serviceName:
          formValuesServiceMultiple && formValuesServiceMultiple.txtServiceToMultipleApplicant
            ? formValuesServiceMultiple.txtServiceToMultipleApplicant.ServiceName
            : "",
        serviceFees:
          formValuesServiceMultiple && formValuesServiceMultiple.txtServiceToMultipleApplicant
            ? formValuesServiceMultiple.txtServiceToMultipleApplicant.ServiceFees
            : "",
        VLETotal:
          formValuesServiceMultiple && formValuesServiceMultiple.txtServiceToMultipleApplicant
            ? formValuesServiceMultiple.txtServiceToMultipleApplicant.VLETotal
            : "",
      });
      setFormValuesServiceToMultipleApplicant({
        ...formValuesServiceToMultipleApplicant,
        addedServiceToMultipleApplicant: arrServiceToMultipleApplicant,
      });
      setarrServiceToMultipleApplicant(arrServiceToMultipleApplicant);
    }
  };

  const AddMultipleServiceToApplicantClick = () => {
    debugger;
    if (arrServiceToMultipleApplicant.length === 0) {
      setAlertMessage({
        type: "error",
        message: "Please add atleast one service to applicant",
      });
      return;
    }
    let rtnval = true;
    for (let i = 0; i < formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant.length; i += 1) {
      if (!rtnval) {
        return;
      }
      if (formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant[i].name === "") {
        setAlertMessage({
          open: true,
          type: "error",
          message: `Applicant Name is required at row ${i + 1}`,
        });
        rtnval = false;
        break;
      }
    }
    if (rtnval === true) {
      let pServiceFee = 0;
      let pVLETotal = 0;

      formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant.forEach((v) => {
        pServiceFee += Number(v.serviceFees);
        pVLETotal = Number(v.VLETotal ? v.VLETotal : 0);
      });
      setFormValuesForConsumer({
        ...formValuesForConsumer,
        txtServiceFee: pServiceFee,
        txtVistingFee: pVLETotal,
        txtDocumentRequired: null,
      });
      setarrServiceToMultipleApplicant(arrServiceToMultipleApplicant);
      updateformState("SelectServc");
      toggleMultipleServiceByStateClick();
    }
  };

  useEffect(() => {
    getRelationListData();
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
      <Modal varient="half" title="Service List" right="0" width="75.5vw" show={toggleMultipleServiceByStateClick}>
        <Modal.Body>
          <div className={BizClass.myCardGrid}>
            <PageBar>
              {pnlServiceToMultipleApplicant ? (
                <PageBar.Search value={searchTextService} onChange={(e) => onSearchService(e.target.value)} />
              ) : (
                <>
                  <div style={{ width: "600px" }}>
                    <PageBar.Select
                      ControlTxt="Service To MultipleApplicant"
                      label="Service"
                      name="txtServiceToMultipleApplicant"
                      getOptionLabel={(option) => `${option.ServiceName}`}
                      getOptionValue={(option) => `${option}`}
                      options={serviceToMultipleApplicantList}
                      value={formValuesServiceMultiple.txtServiceToMultipleApplicant}
                      onChange={(e) => updateServiceTMultiple("txtServiceToMultipleApplicant", e)}
                    />
                  </div>
                  <PageBar.Select
                    ControlTxt="Relation"
                    label="Relation"
                    name="txtrelationTermID"
                    value={formValuesServiceMultiple.txtrelationTermID}
                    options={relationDropdownDataList}
                    loader={isLoadingRelationDropdownDataList ? <Loader /> : null}
                    getOptionLabel={(option) => `${option.CommonMasterValue}`}
                    getOptionValue={(option) => `${option}`}
                    onChange={(e) => updateServiceTMultiple("txtrelationTermID", e)}
                  />
                  <button type="button" className={BizClass.addbutton} onClick={() => addServiceToMultipleApplicant()}>
                    <AiOutlinePlus style={{ width: "28px" }} title="Add Service To Multiple Applicant" />
                  </button>
                </>
              )}
            </PageBar>
            <span className={BizClass.span_service}>{pnlServiceToMultipleApplicant ? "" : " Add Service To Multiple Applicant"}</span>
            {pnlServiceToMultipleApplicant ? (
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
                <DataGrid.Column headerName="Department" field="DepartmentMasterName" width={255} />
                <DataGrid.Column headerName="Sub Department" field="SubDepartmentMasterName" width={255} />
                <DataGrid.Column headerName="Service Name" field="ServiceName" width={455} />
                <DataGrid.Column field="ServiceFees" headerName="Department Fee" width="140px" type="rightAligned" />
                <DataGrid.Column field="VLEServiceCharge" headerName="Service Charges" width="140px" type="rightAligned" />
                <DataGrid.Column field="VLEGSTCharge" headerName="GST" width="140px" type="rightAligned" />
                <DataGrid.Column field="VLETotal" headerName="Visiting Fee" width="140px" type="rightAligned" />
                <DataGrid.Column headerName="Time Liine" field="TimeLine" width={100} />
              </DataGrid>
            ) : (
              <div className={BizClass.table_Height}>
                <table className={classNames(BizClass.table, BizClass.table_hover, BizClass.table_bordered)}>
                  <thead>
                    <tr className={BizClass.blue}>
                      <th>Sr.No.</th>
                      <th>Applicant Name</th>
                      <th>Relation</th>
                      <th>Department Fee</th>
                      <th>Visiting Fee</th>
                      <th>Servicve</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formValuesServiceToMultipleApplicant &&
                      formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant &&
                      formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant.length > 0 &&
                      formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td style={{ width: "60px" }}>{index + 1}</td>
                            <td style={{ width: "170px" }}>
                              <Form.InputGroup>
                                <Form.InputControl
                                  control="input"
                                  type="text"
                                  name="name"
                                  value={formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant[index].name}
                                  autoComplete="off"
                                  onChange={(e) => {
                                    updateServiceToMultipleApplicantState("name", e.target.value, index);
                                  }}
                                  disabled={
                                    formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant[index].relationTermID &&
                                    formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant[index].relationTermID.CommonMasterValueID &&
                                    formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant[index].relationTermID.CommonMasterValueID === 134001
                                  }
                                />
                              </Form.InputGroup>
                            </td>
                            <td style={{ width: "160px" }}>{formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant[index].relationName}</td>
                            <td style={{ textAlign: "right", width: "90px" }}>
                              {formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant[index].serviceFees}
                            </td>
                            <td style={{ textAlign: "right", width: "90px" }}>
                              {formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant[index].VLETotal}
                            </td>
                            <td style={{ width: "250px" }}>{formValuesServiceToMultipleApplicant.addedServiceToMultipleApplicant[index].serviceName}</td>

                            <td style={{ width: "60px" }}>
                              <AiFillDelete style={{ fontSize: "20px" }} onClick={() => removeServiceToMultipleApplicant(index)} />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {pnlServiceToMultipleApplicant ? (
            <>
              <Button varient="danger" onClick={() => selectServiceListClick()}>
                Select
              </Button>
              <Button varient="danger" onClick={() => unselectServiceListClick()}>
                Unselect
              </Button>
              {arrServiceToMultipleApplicant && arrServiceToMultipleApplicant.length > 0 ? (
                <Button varient="primary" onClick={() => selectServiceListClick()}>
                  View
                </Button>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              <Button varient="primary" onClick={() => AddMultipleServiceToApplicantClick()}>
                Add
              </Button>
              <Button varient="danger" onClick={() => BackClick()}>
                Back
              </Button>
            </>
          )}
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
  arrServiceToMultipleApplicant: PropTypes.object,
  setarrServiceToMultipleApplicant: PropTypes.func.isRequired,
  updateformState: PropTypes.func.isRequired,
  setFormValuesForConsumer: PropTypes.object,
  formValuesForConsumer: PropTypes.func.isRequired,
  // A ServiceData: PropTypes.object,
};
