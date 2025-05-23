import React, { useEffect } from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import { FiTrash2 } from "react-icons/fi";
import AssignedUserProfileRightListModalLogic from "./Logic/Logic";
import UnAssignedUserProfileRightListModal from "../UnAssignedUserProfileRightListModel/UnAssignedUserProfileRightListModel";
import BizClass from "./AssignedUserProfileRightListModel.module.scss";

const assignedUserProfileRightActionTemplate = (props) => {
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
const cellMenuRightTemplate = (props) => {
  const menuData = props.data;

  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      {menuData && menuData.AssignmentFlag.toString() === "1" ? (
        <Button type="button" varient="secondary" title="UnAssign Right" onClick={() => props.onUnAssignMenuRight(props.data)} style={{ cursor: "pointer" }}>
          UnAssign
        </Button>
      ) : (
        <Button type="button" varient="primary" title="Assign Right" onClick={() => props.onAssignMenuRight(props.data)} style={{ cursor: "pointer" }}>
          Assign
        </Button>
      )}
    </div>
  );
};
function AssignedUserProfileRightListModal({ showfunc, assignedUsersProfileRightModal }) {
  const {
    unAssignedUserProfileRightListModal,
    toggleUnAssignedUserProfileRightListModal,
    assignedUserProfileRightList,
    isLoadingAssignedUserProfileRightList,
    getAssignedUserProfileRightListData,
    updateAssignedUserProfileRightList,
    onAssignedUserProfileRightGridReady,
    searchTextAssigendUserProfileRight,
    onSearchAssignedUserProfileRight,
    onUnAssignMenuRight,
    onAssignMenuRight,
  } = AssignedUserProfileRightListModalLogic();

  useEffect(() => {
    debugger;
    getAssignedUserProfileRightListData(assignedUsersProfileRightModal);
  }, [assignedUsersProfileRightModal]);

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
      {unAssignedUserProfileRightListModal && (
        <UnAssignedUserProfileRightListModal
          showfunc={toggleUnAssignedUserProfileRightListModal}
          assignedUsersProfileRightModal={assignedUsersProfileRightModal}
          updateAssignedUserProfileRightList={updateAssignedUserProfileRightList}
        />
      )}

      <Modal
        varient="half"
        title={`Assign Un-Assign User Profile Right List (${assignedUsersProfileRightModal.MenuName ? assignedUsersProfileRightModal.MenuName : ""})`}
        show={showfunc}
        right="0"
        width="49.5vw"
      >
        <Modal.Body>
          <div className={BizClass.Card}>
            <PageBar>
              <PageBar.Search
                onClick={() => console.log("CLicked")}
                value={searchTextAssigendUserProfileRight}
                onChange={(e) => onSearchAssignedUserProfileRight(e.target.value)}
              />
              <PageBar.Button onClick={() => toggleUnAssignedUserProfileRightListModal()} style={{ display: "none" }}>
                Import
              </PageBar.Button>
            </PageBar>
            <DataGrid
              rowData={assignedUserProfileRightList}
              loader={isLoadingAssignedUserProfileRightList ? <Loader /> : false}
              frameworkComponents={{
                assignedUserProfileRightActionTemplate,
                cellMenuRightTemplate,
              }}
              getRowStyle={getRowStyle}
              onGridReady={onAssignedUserProfileRightGridReady}
            >
              <DataGrid.Column
                headerName="Action"
                lockPosition="1"
                pinned="left"
                width={125}
                cellRenderer="cellMenuRightTemplate"
                cellRendererParams={{
                  onAssignMenuRight,
                  onUnAssignMenuRight,
                }}
              />
              <DataGrid.Column field="RightCode" headerName="Right Code" width={150} />
              <DataGrid.Column field="RightName" headerName="Right Name" width={150} />
            </DataGrid>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
}

export default AssignedUserProfileRightListModal;

AssignedUserProfileRightListModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
  assignedUsersProfileRightModal: PropTypes.array,
};
