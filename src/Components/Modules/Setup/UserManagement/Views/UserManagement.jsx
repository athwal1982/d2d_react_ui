import React from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import { RiFileUserLine, RiLockPasswordLine, RiHome2Fill } from "react-icons/ri";
import PropTypes from "prop-types";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { Loader } from "Framework/Components/Widgets";
import BizClass from "./UserManagement.module.scss";

const cellActionTemplate = (props) => {
  const cellData = props.data;
  const userData = getSessionStorage("user");

  console.log(cellData, "*************cellData************");
  console.log("******************userData*****************", userData);
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      {userData.AppAccessTypeID.toString() !== "503" ? (
        cellData && cellData.ActiveStatus.toString() === "Y" ? (
          <BsToggleOn style={{ fontSize: "17px", color: "#4caf50", cursor: "pointer" }} onClick={() => props.onActiveUser(props.data)} />
        ) : (
          <BsToggleOff style={{ fontSize: "17px", color: "#c72918", cursor: "pointer" }} onClick={() => props.onDeActiveUser(props.data)} />
        )
      ) : null}
      {cellData && cellData.AssignmentFlag.toString() === "0" && userData.AppAccessTypeID.toString() !== "503" ? (
        <RiFileUserLine
          style={{ fontSize: "17px", color: "#34495E", cursor: "pointer" }}
          onClick={() => props.toggleProfileListModal(props.data)}
          title="Profile Assign"
        />
      ) : null}
      {userData.AppAccessTypeID.toString() === "472" ||
      (userData.AppAccessTypeID.toString() === "999" && userData.LoginID.toString() === cellData.InsertUserID.toString()) ? (
        <RiHome2Fill
          style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
          onClick={() => props.toggleAssignStateListModal(props.data)}
          title="State Assign"
        />
      ) : null}
      {userData.AppAccessTypeID.toString() !== "503" ? (
        <RiLockPasswordLine
          style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
          title="Reset Password"
          onClick={() => props.toggleResetPasswordModal(props.data)}
        />
      ) : null}
    </div>
  );
};
function UserManagement({
  filteredUserDataList,
  isLoadingUserDataList,
  toggleAddVisitModal,
  onGridReady,
  onChangeUserList,
  getUsersList,
  userListItemSearch,
  onActiveUser,
  onDeActiveUser,
  toggleProfileListModal,
  toggleAssignStateListModal,
  toggleResetPasswordModal,
}) {
  const userData = getSessionStorage("user");
  const getRowStyle = (params) => {
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.node.rowIndex % 2 === 0) {
      return { background: "#fff" };
    }
    return { background: "#f3f6f9" };
  };
  return (
    <div className={BizClass.PageStart}>
      <PageBar>
        <PageBar.Search value={userListItemSearch} onChange={(e) => onChangeUserList(e.target.value)} onClick={() => getUsersList()} />
        {userData && userData.AppAccessTypeID.toString() !== "503" ? <PageBar.Button onClick={() => toggleAddVisitModal()}>Add User</PageBar.Button> : null}
      </PageBar>
      <DataGrid
        rowData={filteredUserDataList}
        loader={isLoadingUserDataList ? <Loader /> : false}
        components={{
          actionTemplate: cellActionTemplate,
        }}
        getRowStyle={getRowStyle}
        onGridReady={onGridReady}
      >
        <DataGrid.Column
          headerName="Action"
          lockPosition="1"
          pinned="left"
          width={125}
          cellRenderer="actionTemplate"
          cellRendererParams={{
            onActiveUser,
            onDeActiveUser,
            toggleProfileListModal,
            toggleAssignStateListModal,
            toggleResetPasswordModal,
          }}
        />
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="AppAccessUserName" headerName="User Name" width={170} />
        <DataGrid.Column field="UserDisplayName" headerName="Display Name" width={210} />
        <DataGrid.Column field="UserMobileNumber" headerName="Mobile No." width={120} />
        <DataGrid.Column field="EmailAddress" headerName="Email ID" width={170} />
        <DataGrid.Column field="ProfileName" headerName="Profile Name" width={170} />
        <DataGrid.Column field="UserType" headerName="User Type" width={120} />
        <DataGrid.Column
          field="ActiveStatus"
          headerName="Status"
          width={110}
          cellRenderer={(node) => {
            return node.data.ActiveStatus.toString() === "Y" ? "Active" : "In-Active";
          }}
        />
      </DataGrid>
    </div>
  );
}

export default UserManagement;
UserManagement.propTypes = {
  filteredUserDataList: PropTypes.array,
  isLoadingUserDataList: PropTypes.bool,
  toggleAddVisitModal: PropTypes.func.isRequired,
  onGridReady: PropTypes.func.isRequired,
  onChangeUserList: PropTypes.func.isRequired,
  getUsersList: PropTypes.func.isRequired,
  userListItemSearch: PropTypes.string,
  onActiveUser: PropTypes.func.isRequired,
  onDeActiveUser: PropTypes.func.isRequired,
  toggleProfileListModal: PropTypes.func.isRequired,
  toggleAssignStateListModal: PropTypes.func.isRequired,
  toggleAssignDistrictListModal: PropTypes.func.isRequired,
  toggleAssignSubDistrictListModal: PropTypes.func.isRequired,
  toggleAssignBlockListModal: PropTypes.func.isRequired,
  toggleResetPasswordModal: PropTypes.func.isRequired,
  toggleCategoryModal: PropTypes.func.isRequired,
  toggleAssignRegionalOfficeListModal: PropTypes.func.isRequired,
  toggleAssignInsCompModal: PropTypes.func.isRequired,
  toggleCloseCategoryModal: PropTypes.func.isRequired,
  toggleCloseDistrictListModal: PropTypes.func.isRequired,
};
