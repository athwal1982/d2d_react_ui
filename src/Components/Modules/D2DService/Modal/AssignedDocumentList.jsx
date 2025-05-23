import React, { useState } from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { PropTypes } from "prop-types";
import BizClass from "../D2DServcie.module.scss";

function AssignedDocumentList({ toggleDocumentListClick, documentList }) {
  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const [searchTextDocument, setSearchTextDocument] = useState("");
  const onSearchDocument = (val) => {
    debugger;
    setSearchTextDocument(val);
    gridApi.setQuickFilter(val);
  };

  return (
    <Modal style={{ zIndex: "999999999" }} varient="center" title="Document List" right={0} width="60vw" height="75vh" show={toggleDocumentListClick}>
      <Modal.Body>
        <div className={BizClass.myCardGrid}>
          <PageBar>
            <PageBar.Search value={searchTextDocument} onChange={(e) => onSearchDocument(e.target.value)} />
          </PageBar>
          <span className={BizClass.span_service}> {documentList && documentList[0].ServiceName ? `Service : ${documentList[0].ServiceName}` : ""}</span>
          <DataGrid rowData={documentList} onGridReady={onGridReady} rowSelection="multiple">
            <DataGrid.Column field="#" headerName="Sr No." width={75} valueGetter="node.rowIndex + 1" pinned="left" />
            <DataGrid.Column field="DocumentName" headerName="Document Name" width={730} />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

export default AssignedDocumentList;

AssignedDocumentList.propTypes = {
  toggleDocumentListClick: PropTypes.func.isRequired,
  documentList: PropTypes.array,
  selectedApplicant: PropTypes.object,
};
