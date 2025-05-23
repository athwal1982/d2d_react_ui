import React, { useState, useEffect } from "react";
import { Loader } from "Framework/Components/Widgets";
// A import { DataGrid, PageBar } from "Framework/Components/Layout";
import Modal from "Framework/Components/Layout/Modal/Modal";
import parse from "html-react-parser";
import { PropTypes } from "prop-types";
import BizClass from "../D2DServcie.module.scss";
// A import { getDTDSMasterDataBindingDataList } from "../../Support/ManageTicket/Views/Modals/AddTicket/Services/Methods";

// A function ServiceDocumentList({ selectedData, isLoadingDocumentList, selectDocumentClick, setAlertMessage, documentList, documentData, setDocumentData }) {
function ServiceDocumentList({ selectedData, selectDocumentClick }) {
  // A const [gridApi, setGridApi] = useState();
  // A const onGridReady = (params) => {
  // A  setGridApi(params.api);
  // A };

  // A  const [searchTextDocument, setSearchTextDocument] = useState("");
  // A const onSearchDocument = (val) => {
  // A  debugger;
  // A  setSearchTextDocument(val);
  // A  gridApi.setQuickFilter(val);
  // A };

  // A const getRowStyle = (params) => {
  // A  console.log(documentData);
  // A  if (params.data.IsNewlyAdded) {
  // A    return { background: "#d5a10e" };
  // A  }
  // A  if (params.data.IsSelected) {
  // A    return { background: "#ffc176" };
  // A  }
  // A  return { background: "" };
  // A };

  const [isLoadingDocumentList, setIsLoadingDocumentList] = useState(false);
  const [documentList, setDocumentList] = useState("");
  const [optionalDocumentList, setOptionalDocumentList] = useState("");
  const getDocumentDataList = async () => {
    debugger;
    setIsLoadingDocumentList(true);
    setDocumentList(selectedData && selectedData.ServiceDocument ? selectedData.ServiceDocument : "");
    setOptionalDocumentList(selectedData && selectedData.OptionalDocuments ? selectedData.OptionalDocuments : "");
    setIsLoadingDocumentList(false);
  };

  useEffect(() => {
    getDocumentDataList();
  }, []);

  return (
    <Modal varient="center" title="Document List" right={0} width="60vw" height="75vh" show={selectDocumentClick}>
      <Modal.Body>
        <div className={BizClass.myCardGrid}>
          {/* <PageBar>
              <PageBar.Search value={searchTextDocument} onChange={(e) => onSearchDocument(e.target.value)} />
            </PageBar> */}
          <span className={BizClass.span_service}>{selectedData && selectedData.ServiceName ? `Service : ${selectedData.ServiceName}` : ""} </span>
          {isLoadingDocumentList ? <Loader /> : null}
          <div className={BizClass.div_documentList}>
            <div className={BizClass.div_service_documentList}>
              <span> Mandatory Documents :</span> {documentList ? parse(documentList.toString()) : null}
            </div>
            <div className={BizClass.div_optional_documentList}>
              <span> Optional Documents :</span> {optionalDocumentList ? parse(optionalDocumentList.toString()) : null}
            </div>
          </div>

          {/* <DataGrid
              rowData={documentList}
              loader={isLoadingDocumentList ? <Loader /> : null}
              onGridReady={onGridReady}
              suppressRowClickSelection={true}
              rowSelection="multiple"
              getRowStyle={getRowStyle}
            >
              <DataGrid.Column field="#" headerName="Sr No." width={75} valueGetter="node.rowIndex + 1" pinned="left" />
              <DataGrid.Column field="DocumentName" headerName="Document Name" width={730} />
            </DataGrid> */}
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

export default ServiceDocumentList;

ServiceDocumentList.propTypes = {
  selectedData: PropTypes.object,
  // A isLoadingDocumentList: PropTypes.func.isRequired,
  selectDocumentClick: PropTypes.func.isRequired,
  // A setAlertMessage: PropTypes.func.isRequired,
  // A documentData: PropTypes.object,
  // A setDocumentData: PropTypes.func.isRequired,
  // A documentList: PropTypes.array,
  // A DocumentData: PropTypes.object,
};
