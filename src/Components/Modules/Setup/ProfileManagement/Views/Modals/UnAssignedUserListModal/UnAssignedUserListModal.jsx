import React, { useEffect } from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Loader, Button } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import UnAssignedUserListModalLogic from "./Logic/UnAssignedUserListModalLogic";
import BizClass from "./UnAssignedUserListModal.module.scss";

function UnAssignedUserListModal({ showfunc, assignedUsersModal, updateAssignedUserList, deletedAssignedUser }) {
  const {
    unAssignedUserList,
    isLoadingUnassignedUserList,
    getUnAssignedUserListData,
    setSelectedRowData,
    onGridReadyUnAssign,
    handleSave,
    btnloaderActive,
    searchTextUnAssigendUser,
    onSearchUnAssignedUser,
    setDeletedAssignedRow,
  } = UnAssignedUserListModalLogic();

  useEffect(() => {
    setSelectedRowData(assignedUsersModal);
    getUnAssignedUserListData(assignedUsersModal);
  }, [assignedUsersModal]);

  useEffect(() => {
    setDeletedAssignedRow(deletedAssignedUser);
  }, [deletedAssignedUser]);

  return (
    <Modal
      onSubmit={(e) => handleSave(e, updateAssignedUserList)}
      varient="half"
      title={`Un-Assigned User List (${assignedUsersModal.ProfileName ? assignedUsersModal.ProfileName : ""})`}
      show={showfunc}
      left="0"
      width="49.5vw"
    >
      <Modal.Body>
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search onClick={() => console.log("CLicked")} value={searchTextUnAssigendUser} onChange={(e) => onSearchUnAssignedUser(e.target.value)} />
          </PageBar>
          <DataGrid rowData={unAssignedUserList} loader={isLoadingUnassignedUserList ? <Loader /> : false} onGridReady={onGridReadyUnAssign}>
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
            <DataGrid.Column field="UserDisplayName" headerName="Display Name" width={150} />
            <DataGrid.Column field="AppAccessUserName" headerName="User Name" width={150} />
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

export default UnAssignedUserListModal;

UnAssignedUserListModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
  assignedUsersModal: PropTypes.array,
  updateAssignedUserList: PropTypes.func.isRequired,
  deletedAssignedUser: PropTypes.array,
};
