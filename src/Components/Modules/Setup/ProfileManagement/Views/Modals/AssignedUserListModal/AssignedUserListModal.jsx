import React, { useEffect } from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import { FiTrash2 } from "react-icons/fi";
import AssignedUserListModalLogic from "./Logic/AssignedUserListModalLogic";
import UnAssignedUserListModal from "../UnAssignedUserListModal/UnAssignedUserListModal";
import BizClass from "./AssignedUserListModal.module.scss";

const assignedUserActionTemplate = (props) => {
  return (
    <div style={{ display: "flex" }}>
      <span
        title="Delete Assigned Location"
        style={{
          cursor: "pointer",
          display: "grid",
          marginTop: "3px",
          marginRight: "3px",
        }}
      >
        <FiTrash2 style={{ fontSize: "15px", color: "#5d6d7e" }} onClick={() => props.onClickDeleteAssignedUser(props.data)} />
      </span>
    </div>
  );
};
function AssignedUserListModal({ showfunc, assignedUsersModal }) {
  const {
    unAssignedUserListModal,
    toggleUnAssignedUserListModal,
    assignedUserList,
    isLoadingAssignedUserList,
    getAssignedUserListData,
    updateAssignedUserList,
    onAssignedUserGridReady,
    onClickDeleteAssignedUser,
    searchTextAssigendUser,
    onSearchAssignedUser,
    deletedAssignedUser,
  } = AssignedUserListModalLogic();

  useEffect(() => {
    debugger;
    getAssignedUserListData(assignedUsersModal);
  }, [assignedUsersModal]);

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
      {unAssignedUserListModal && (
        <UnAssignedUserListModal
          showfunc={toggleUnAssignedUserListModal}
          assignedUsersModal={assignedUsersModal}
          updateAssignedUserList={updateAssignedUserList}
          deletedAssignedUser={deletedAssignedUser}
        />
      )}

      <Modal
        varient="half"
        title={`Assigned User List (${assignedUsersModal.ProfileName ? assignedUsersModal.ProfileName : ""})`}
        show={showfunc}
        right="0"
        width="49.5vw"
      >
        <Modal.Body>
          <div className={BizClass.Card}>
            <PageBar>
              <PageBar.Search onClick={() => console.log("CLicked")} value={searchTextAssigendUser} onChange={(e) => onSearchAssignedUser(e.target.value)} />
              <PageBar.Button onClick={() => toggleUnAssignedUserListModal()}>Import</PageBar.Button>
            </PageBar>
            <DataGrid
              rowData={assignedUserList}
              loader={isLoadingAssignedUserList ? <Loader /> : false}
              frameworkComponents={{
                assignedUserActionTemplate,
              }}
              getRowStyle={getRowStyle}
              onGridReady={onAssignedUserGridReady}
            >
              <DataGrid.Column
                field="#"
                headerName="Action"
                width={90}
                pinned="left"
                cellRenderer="assignedUserActionTemplate"
                cellRendererParams={{
                  onClickDeleteAssignedUser,
                }}
              />
              <DataGrid.Column field="#" headerName="Sr No." valueGetter="node.rowIndex + 1" width={100} type="leftAligned" />
              <DataGrid.Column field="UserDisplayName" headerName="Display Name" width={150} />
              <DataGrid.Column field="AppAccessUserName" headerName="User Name" width={150} />
              <DataGrid.Column
                field="#"
                headerName="Profile Type"
                width={190}
                cellRenderer={(node) => {
                  return node.data.UserProfileType.toString() === "S" ? "Static" : node.data.UserProfileType.toString() === "D" ? "Dynamic" : "";
                }}
              />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
}

export default AssignedUserListModal;

AssignedUserListModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
  assignedUsersModal: PropTypes.array,
};
