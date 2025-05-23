import React, { useEffect } from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Loader, Button } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import UnAssignStateListModalLogic from "./Logic/UnAssignStateModalLogic";

import BizClass from "./UnAssignStateModal.module.scss";

function UnAssignStateListModal({ showfunc, selectedUserData, updateAssignedStateList }) {
  const {
    unAssignStateList,
    isLoadingUnAssignStateList,
    onGridReadyUnAssign,
    searchTextUnAssigendState,
    onSearchUnAssignedState,
    getUnAssignedStateListData,
    btnloaderActive,
    handleSave,
    setSelectedRowData,
  } = UnAssignStateListModalLogic();

  useEffect(() => {
    setSelectedRowData(selectedUserData);
    getUnAssignedStateListData(selectedUserData);
  }, []);
  return (
    <Modal
      varient="half"
      title={`UnAssign State List (${selectedUserData.UserDisplayName ? selectedUserData.UserDisplayName : ""})`}
      show={showfunc}
      left="0"
      width="49.5vw"
      onSubmit={(e) => handleSave(e, updateAssignedStateList)}
    >
      <Modal.Body>
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search
              onClick={() => console.log("CLicked")}
              value={searchTextUnAssigendState}
              onChange={(e) => onSearchUnAssignedState(e.target.value)}
            />
          </PageBar>
          <DataGrid rowData={unAssignStateList} loader={isLoadingUnAssignStateList ? <Loader /> : false} onGridReady={onGridReadyUnAssign}>
            <DataGrid.Column
              lockPosition="1"
              pinned="left"
              headerName=""
              field=""
              width={60}
              headerCheckboxSelection
              headerCheckboxSelectionFilteredOnly
              checkboxSelection
            />
            <DataGrid.Column field="#" headerName="Sr No." valueGetter="node.rowIndex + 1" width={100} type="leftAligned" />
            <DataGrid.Column headerName="State" field="StateMasterName" width={240} />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" varient="secondary" trigger={btnloaderActive}>
          Import
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UnAssignStateListModal;

UnAssignStateListModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
  selectedUserData: PropTypes.any,
  updateAssignedStateList: PropTypes.func.isRequired,
};
