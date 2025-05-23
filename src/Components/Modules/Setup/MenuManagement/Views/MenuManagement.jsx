import React from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { HiPlusCircle } from "react-icons/hi";
import BizClass from "./MenuManagement.module.scss";

const cellTemplate = (props) => {
  const menuData = props.data;
  const onDeleteClick = () => {};
  const onAddClick = () => {
    debugger;
    props.openSubmenuPopup({ open: true, data: menuData, isEditMode: false });
  };
  const onEditClick = () => {
    props.openSubmenuPopup({ open: true, data: menuData, isEditMode: true });
  };
  return menuData.HasChild === "1" ? (
    <div>
      <span style={{ cursor: "pointer", paddingRight: "8px" }}>
        {" "}
        <HiPlusCircle className="Biz_Bm__Icon" onClick={() => onAddClick()} />
      </span>
      <span style={{ cursor: "pointer", paddingRight: "8px" }}>
        <FaEdit className="Biz_Bm__Icon" onClick={() => onEditClick()} />{" "}
      </span>
      <span>
        <FaTrashAlt className="Biz_Bm__Icon" onClick={() => onDeleteClick()} />
      </span>
    </div>
  ) : (
    <div>
      <span style={{ cursor: "pointer", paddingRight: "8px" }}>
        <FaEdit className="Biz_Bm__Icon" onClick={() => onEditClick()} />{" "}
      </span>
      <FaTrashAlt className="Biz_Bm__Icon" onClick={() => onDeleteClick()} />
    </div>
  );
};

function MenuManagement({
  treeMenuListData,
  isLoadingMenuList,
  openSubmenuPopup,
  onGridReady,
  toggleAddMenuModal,
  getMenuList,
  onChangemenuList,
  menuItemSearch,
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
        <PageBar.Search value={menuItemSearch} onChange={(e) => onChangemenuList(e.target.value)} onClick={() => getMenuList()} />
        <PageBar.Button onClick={() => toggleAddMenuModal()}>Add Menu</PageBar.Button>
      </PageBar>
      <DataGrid
        rowData={treeMenuListData}
        loader={isLoadingMenuList ? <Loader /> : false}
        components={{
          actionTemplate: cellTemplate,
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
        getRowStyle={getRowStyle}
        onGridReady={onGridReady}
        getDataPath={(data) => {
          return data.orgHierarchy;
        }}
      >
        <DataGrid.Column hide headerName="Menu Name" field="MenuName" width={220} />
        <DataGrid.Column headerName="Web URl" field="WebURL" width={220} />
        <DataGrid.Column headerName="React Url" field="ReactURL" width={220} />
        <DataGrid.Column headerName="WPF Url" field="WPFURL" width={220} />
        <DataGrid.Column
          headerName="Action"
          width={120}
          cellRenderer="actionTemplate"
          cellRendererParams={{
            openSubmenuPopup,
          }}
        />
      </DataGrid>
    </div>
  );
}

export default MenuManagement;
MenuManagement.propTypes = {
  treeMenuListData: PropTypes.array,
  isLoadingMenuList: PropTypes.bool,
  openSubmenuPopup: PropTypes.func.isRequired,
  onGridReady: PropTypes.func.isRequired,
  toggleAddMenuModal: PropTypes.func.isRequired,
  onChangemenuList: PropTypes.func.isRequired,
  getMenuList: PropTypes.func.isRequired,
  menuItemSearch: PropTypes.string,
};
