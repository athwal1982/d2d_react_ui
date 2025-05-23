import React, { useEffect } from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Loader, Button } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import UnAssignedUserProfileRightListModalLogic from "./Logic/Logic";
import BizClass from "./UnAssignedUserProfileRightListModel.module.scss";

function UnAssignedUserProfileRightListModal({
  showfunc,
  assignedUsersProfileRightModal,
  updateAssignedUserProfileRightList,
  deletedAssignedUserProfileRight,
}) {
  const {
    unAssignedUserProfileRightList,
    isLoadingUnassignedUserProfileRightList,
    getUnAssignedUserProfileRightListData,
    setSelectedRowData,
    onGridReadyUnAssign,
    handleSave,
    btnloaderActive,
    searchTextUnAssigendUserProfileRight,
    onSearchUnAssignedUserProfileRight,
    setDeletedAssignedRow,
  } = UnAssignedUserProfileRightListModalLogic();

  useEffect(() => {
    setSelectedRowData(assignedUsersProfileRightModal);
    getUnAssignedUserProfileRightListData(assignedUsersProfileRightModal);
  }, [assignedUsersProfileRightModal]);

  useEffect(() => {
    setDeletedAssignedRow(deletedAssignedUserProfileRight);
  }, [deletedAssignedUserProfileRight]);

  return (
    <Modal
      onSubmit={(e) => handleSave(e, updateAssignedUserProfileRightList)}
      varient="half"
      title={`Un-Assigned User Profile Right List (${assignedUsersProfileRightModal.MenuName ? assignedUsersProfileRightModal.MenuName : ""})`}
      show={showfunc}
      left="0"
      width="49.5vw"
    >
      <Modal.Body>
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search
              onClick={() => console.log("CLicked")}
              value={searchTextUnAssigendUserProfileRight}
              onChange={(e) => onSearchUnAssignedUserProfileRight(e.target.value)}
            />
          </PageBar>
          <DataGrid
            rowData={unAssignedUserProfileRightList}
            loader={isLoadingUnassignedUserProfileRightList ? <Loader /> : false}
            onGridReady={onGridReadyUnAssign}
          >
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
            <DataGrid.Column field="MenuName" headerName="Menu Name" width={150} />
            <DataGrid.Column field="RightCode" headerName="Right Code" width={150} />
            <DataGrid.Column field="RightName" headerName="Right Name" width={150} />
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

export default UnAssignedUserProfileRightListModal;

UnAssignedUserProfileRightListModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
  assignedUsersProfileRightModal: PropTypes.array,
  updateAssignedUserProfileRightList: PropTypes.func.isRequired,
  deletedAssignedUserProfileRight: PropTypes.array,
};
