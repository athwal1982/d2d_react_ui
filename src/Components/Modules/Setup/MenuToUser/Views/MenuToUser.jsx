import React from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Button, Loader } from "Framework/Components/Widgets";

import BizClass from "../../MenuManagement/Views/MenuManagement.module.scss";

const cellmenuTemplate = (props) => {
  const menuData = props.data;

  return (
    <div>
      {menuData.AssignmentFlag && menuData.AssignmentFlag.toString() === "1" ? (
        <Button type="button" varient="secondary" onClick={() => props.onAssignUnAssignMenu(props.data, "UNASSIGN")} style={{ cursor: "pointer" }}>
          UnAssign
        </Button>
      ) : (
        <Button type="button" varient="primary" onClick={() => props.onAssignUnAssignMenu(props.data, "ASSIGN")} style={{ cursor: "pointer" }}>
          Assign
        </Button>
      )}
    </div>
  );
};

function MenuToUserManagement({
  filteredUserDataList,
  isLoadingUserDataList,
  onGridReady,
  updateState,
  formValues,
  userNameSelect,
  onChangeMenuList,
  menuListItemSearch,
  getMenuLists,
  treeMenuListData,
  isLoadingMenuList,
  onAssignUnAssignMenu,
}) {
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
        <PageBar.Select
          label="Users"
          options={filteredUserDataList}
          ref={userNameSelect}
          isLoading={isLoadingUserDataList ? <Loader /> : null}
          name="txtUserName"
          value={formValues.txtUserName}
          getOptionValue={(option) => `${option}`}
          onChange={(e) => updateState("txtUserName", e)}
          getOptionLabel={(option) => `${option.AppAccessUserName}`}
        />
        <PageBar.Search value={menuListItemSearch} onChange={(e) => onChangeMenuList(e.target.value)} onClick={() => getMenuLists()} />
      </PageBar>
      <DataGrid
        onGridReady={onGridReady}
        rowData={treeMenuListData}
        loader={isLoadingMenuList ? <Loader /> : false}
        treeData="true"
        animateRows="true"
        getRowStyle={getRowStyle}
        components={{
          actionTemplate: cellmenuTemplate,
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
        groupDefaultExpanded={-1}
        getDataPath={(data) => {
          return data.orgHierarchy;
        }}
      >
        <DataGrid.Column headerName="Menu Type" field="MenuTypeName" width={220} />
        <DataGrid.Column hide headerName="Menu Name" field="MenuName" width={220} />
        <DataGrid.Column headerName="Web URl" field="WebURL" width={220} />
        <DataGrid.Column headerName="React Url" field="ReactURL" width={220} />
        <DataGrid.Column headerName="WPF Url" field="WPFURL" width={220} />
        <DataGrid.Column
          headerName="Action"
          width={120}
          cellRenderer="actionTemplate"
          cellRendererParams={{
            onAssignUnAssignMenu,
          }}
        />
      </DataGrid>
    </div>
  );
}

export default MenuToUserManagement;
MenuToUserManagement.propTypes = {
  treeMenuListData: PropTypes.array,
  isLoadingMenuList: PropTypes.bool,
  filteredUserDataList: PropTypes.array,
  isLoadingUserDataList: PropTypes.bool,
  onGridReady: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,
  formValues: PropTypes.object,
  userNameSelect: PropTypes.bool,
  onChangeMenuList: PropTypes.func.isRequired,
  menuListItemSearch: PropTypes.string,
  getMenuLists: PropTypes.func.isRequired,
  onAssignUnAssignMenu: PropTypes.func.isRequired,
};
