import React from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Loader, Splitter } from "Framework/Components/Widgets";
import { RiFileUserLine } from "react-icons/ri";
import { HiArrowCircleRight } from "react-icons/hi";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import BizClass from "./ProfileManagement.module.scss";

const cellTemplate = (props) => {
  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      <HiArrowCircleRight style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }} onClick={() => props.onGetMenuClick(props.data)} />
      <RiFileUserLine style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }} onClick={() => props.toggleAssignedUserListModal(props.data)} />
    </div>
  );
};

const cellmenuTemplate = (props) => {
  const menuData = props.data;

  return (
    <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
      {menuData && menuData.AssignmentFlag.toString() === "1" ? (
        <>
          <button type="button" className={BizClass.UnAssignActionButton} onClick={() => props.onUnAssignMenu(props.data)}>
            Un-Assign
          </button>
          <MdOutlineAssignmentTurnedIn
            title="Rights Assign"
            style={{ fontSize: "16px", color: "#34495E", cursor: "pointer" }}
            onClick={() => props.toggleAssignedUserProfileRightListModal(props.data)}
          />
        </>
      ) : (
        <button type="button" className={BizClass.ActionButton} onClick={() => props.onAssignMenu(props.data)} style={{ cursor: "pointer" }}>
          Assign
        </button>
      )}
    </div>
  );
};

function ProfileManagement({
  filterProfileMasterData,
  isLoadingProfileMasterData,
  onGetMenuClick,
  onProfileGridReady,
  toggleAddUserProfileModal,
  treeMenuListData,
  isLoadingMenuList,
  onGridReady,
  onAssignMenu,
  onUnAssignMenu,
  toggleAssignedUserListModal,
  onSearch,
  onRefreshClick,
  onSearchMenuList,
  toggleAssignedUserProfileRightListModal,
}) {
  const getRowStyle = (params) => {
    if (params.data.IsNewlyAdded) {
      return { background: "#d5a10e" };
    }
    if (params.data.IsSelected) {
      return { background: "#ffc176" };
    }
    return { background: "" };
  };

  const getRowStyleMenu = (params) => {
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
      <Splitter varient="column" template="1fr 9px 1fr">
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search onChange={(e) => onSearch(e.target.value)} onClick={() => onRefreshClick()} />
            <PageBar.Button onClick={() => toggleAddUserProfileModal()}>Add Profile</PageBar.Button>
          </PageBar>
          <DataGrid
            rowData={filterProfileMasterData}
            loader={isLoadingProfileMasterData ? <Loader /> : false}
            components={{
              actionTemplate: cellTemplate,
            }}
            getRowStyle={getRowStyle}
            onGridReady={onProfileGridReady}
          >
            <DataGrid.Column
              headerName="Action"
              lockPosition="1"
              pinned="left"
              width={100}
              cellRenderer="actionTemplate"
              cellRendererParams={{
                onGetMenuClick,
                toggleAssignedUserListModal,
              }}
            />
            <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} />
            <DataGrid.Column headerName="Profile Name" field="ProfileName" width={240} />
            <DataGrid.Column headerName="Profile Description" field="ProfileDescription" width={220} />
          </DataGrid>
        </div>
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search onChange={(e) => onSearchMenuList(e.target.value)} />
          </PageBar>
          <DataGrid
            rowData={treeMenuListData}
            loader={isLoadingMenuList ? <Loader /> : false}
            defaultColDef={{
              flex: 1,
              resizable: true,
            }}
            frameworkComponents={{
              cellmenuTemplate,
            }}
            autoGroupColumnDef={{
              headerName: "Menu Name",
              minWidth: 220,
              cellRendererParams: {
                innerRenderer: (params) => {
                  return params.data.MenuName;
                },
              },
            }}
            treeData="true"
            animateRows="true"
            groupDefaultExpanded={-1}
            getRowStyle={getRowStyleMenu}
            onGridReady={onGridReady}
            getDataPath={(data) => {
              return data.orgHierarchy;
            }}
          >
            <DataGrid.Column hide headerName="Menu Name" field="MenuName" width={50} />
            <DataGrid.Column headerName="Web URl" field="WebURL" width={50} />
            <DataGrid.Column headerName="React Url" field="ReactURL" width={50} />
            <DataGrid.Column headerName="WPF Url" field="WPFURL" width={50} />
            <DataGrid.Column
              headerName="Action"
              lockPosition="1"
              pinned="left"
              width={125}
              cellRenderer="cellmenuTemplate"
              cellRendererParams={{
                onAssignMenu,
                onUnAssignMenu,
                toggleAssignedUserProfileRightListModal,
              }}
            />
          </DataGrid>
        </div>
      </Splitter>
    </div>
  );
}

export default ProfileManagement;

ProfileManagement.propTypes = {
  filterProfileMasterData: PropTypes.array,
  isLoadingProfileMasterData: PropTypes.bool,
  onGetMenuClick: PropTypes.func.isRequired,
  toggleAddUserProfileModal: PropTypes.func.isRequired,
  onProfileGridReady: PropTypes.func.isRequired,
  treeMenuListData: PropTypes.array,
  isLoadingMenuList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  onAssignMenu: PropTypes.func.isRequired,
  onUnAssignMenu: PropTypes.func.isRequired,
  toggleAssignedUserListModal: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  onSearchMenuList: PropTypes.func.isRequired,
  toggleAssignedUserProfileRightListModal: PropTypes.func.isRequired,
};
