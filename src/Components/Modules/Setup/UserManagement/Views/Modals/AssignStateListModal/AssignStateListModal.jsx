import React, { useEffect } from "react";
import { Modal, PageBar, DataGrid } from "Framework/Components/Layout";
import { Loader } from "Framework/Components/Widgets";
import { FiTrash2 } from "react-icons/fi";
import PropTypes from "prop-types";
import AssignStateListModalLogic from "./Logic/AssignStateListModalLogic";
import BizClass from "./AssignStateListModal.module.scss";
import UnAssignStateListModal from "../UnAssignStateModal/UnAssignStateModal";

const assignUserStateActionTemplate = (props) => {
  return (
    <div style={{ display: "flex" }}>
      <span
        title="Delete Assigned State"
        style={{
          cursor: "pointer",
          display: "grid",
          marginTop: "3px",
          marginRight: "3px",
        }}
      >
        <FiTrash2 style={{ fontSize: "15px", color: "#5d6d7e" }} onClick={() => props.onClickDeleteUserAssignState(props.data)} />
      </span>
    </div>
  );
};

function AssignStateListModal({ showfunc, selectedUserData }) {
  const {
    getUserStateAssignList,
    userStateAssignList,
    isLoadingUserStateAssignList,
    onUserAssignStateGridReady,
    searchTextUserAssignState,
    onSearchUserAssignState,
    onClickDeleteUserAssignState,
    unAssignedStateListModal,
    toggleUnAssignedStateListModal,
    updateAssignedStateList,
  } = AssignStateListModalLogic();

  useEffect(() => {
    getUserStateAssignList(selectedUserData);
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
  return (
    <>
      {unAssignedStateListModal ? (
        <UnAssignStateListModal
          showfunc={toggleUnAssignedStateListModal}
          selectedUserData={selectedUserData}
          updateAssignedStateList={updateAssignedStateList}
        />
      ) : null}

      <Modal
        varient="half"
        title={`Assign State List (${selectedUserData.UserDisplayName ? selectedUserData.UserDisplayName : ""})`}
        show={showfunc}
        right="0"
        width="49.5vw"
      >
        <Modal.Body>
          <div className={BizClass.Card}>
            <PageBar>
              <PageBar.Search
                onClick={() => console.log("CLicked")}
                value={searchTextUserAssignState}
                onChange={(e) => onSearchUserAssignState(e.target.value)}
              />
              <PageBar.Button onClick={toggleUnAssignedStateListModal}>Import</PageBar.Button>
            </PageBar>
            <DataGrid
              rowData={userStateAssignList}
              loader={isLoadingUserStateAssignList ? <Loader /> : false}
              components={{
                actionTemplate: assignUserStateActionTemplate,
              }}
              getRowStyle={getRowStyle}
              onGridReady={onUserAssignStateGridReady}
            >
              <DataGrid.Column
                field="#"
                headerName="Action"
                width={90}
                pinned="left"
                cellRenderer="actionTemplate"
                cellRendererParams={{ onClickDeleteUserAssignState }}
              />
              <DataGrid.Column field="#" headerName="Sr No." valueGetter="node.rowIndex + 1" width={100} type="leftAligned" />
              <DataGrid.Column headerName="State" field="StateMasterName" width={240} />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
}

export default AssignStateListModal;

AssignStateListModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
  selectedUserData: PropTypes.object,
};
