import React from "react";
import { DataGrid, PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Loader } from "Framework/Components/Widgets";
import { HiArrowCircleRight } from "react-icons/hi";
import BizClass from "./AccessRights.module.scss";

const cellTemplate = (props) => {
  return (
    <span style={{ display: "flex", gap: "8px" }}>
      <HiArrowCircleRight style={{ fontSize: "16px", color: "#34495E" }} onClick={() => props.toggleAssignUserPopUp(props.data)} />
    </span>
  );
};

function AccessRights({
  toggleAddRightsModal,
  filteredRightsDataList,
  isLoadingRightsData,
  onGridReady,
  toggleAssignUserPopUp,
  onChangeRightsList,
  userRightsItemSearch,
  getRightsList,
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
        <PageBar.Search value={userRightsItemSearch} onChange={(e) => onChangeRightsList(e.target.value)} onClick={() => getRightsList()} />
        <PageBar.Button onClick={() => toggleAddRightsModal()}>Add</PageBar.Button>
      </PageBar>
      <DataGrid
        rowData={filteredRightsDataList}
        components={{
          actionTemplate: cellTemplate,
        }}
        getRowStyle={getRowStyle}
        onGridReady={onGridReady}
        loader={isLoadingRightsData ? <Loader /> : false}
      >
        <DataGrid.Column
          field="#"
          headerName="Action"
          width={140}
          pinned="left"
          cellRenderer="actionTemplate"
          cellRendererParams={{
            toggleAssignUserPopUp,
          }}
        />
        <DataGrid.Column valueGetter="node.rowIndex + 1" field="#" headerName="Sr No." width={80} pinned="left" />
        <DataGrid.Column field="RightName" headerName="Right Name" width={160} />
        <DataGrid.Column field="RightCode" headerName="Right Code" width={160} />
        <DataGrid.Column field="RightAPIURL" headerName="API URL" width={160} />
        <DataGrid.Column field="MenuName" headerName="Menu Name" width={160} />
        <DataGrid.Column
          field="#"
          headerName="Admin Status"
          width={190}
          cellRenderer={(node) => {
            return node.data.ApplyToAdmin.toString() === "Y" ? "Active" : "In-Active";
          }}
        />
      </DataGrid>
    </div>
  );
}

export default AccessRights;

AccessRights.propTypes = {
  filteredRightsDataList: PropTypes.array,
  isLoadingRightsData: PropTypes.bool,
  toggleAddRightsModal: PropTypes.func.isRequired,
  onGridReady: PropTypes.func.isRequired,
  toggleAssignUserPopUp: PropTypes.func.isRequired,
  onChangeRightsList: PropTypes.func.isRequired,
  getRightsList: PropTypes.func.isRequired,
  userRightsItemSearch: PropTypes.string,
};
