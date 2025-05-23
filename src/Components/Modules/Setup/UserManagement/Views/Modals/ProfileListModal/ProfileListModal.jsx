import React, { useEffect } from "react";
import { DataGrid, Modal, PageBar } from "Framework/Components/Layout";
import { Loader, Button } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import ProfileListModalLogic from "./Logic/ProfileListModalLogic";
import BizClass from "./ProfileListModal.module.scss";

function ProfileListModal({ showfunc, selectedUserData, updateUserDataList }) {
  const {
    profileList,
    isLoadingProfileList,
    getProfileListData,
    onProfilerGridReady,
    searchTextProfile,
    onSearchProfile,
    handleSave,
    btnloaderActive,
    setSelectedUser,
  } = ProfileListModalLogic();

  useEffect(() => {
    debugger;
    setSelectedUser(selectedUserData);
    getProfileListData(selectedUserData);
  }, [selectedUserData]);

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
    <Modal
      onSubmit={(e) => handleSave(e, showfunc, updateUserDataList)}
      varient="half"
      title={`Profile List (${selectedUserData.UserDisplayName ? selectedUserData.UserDisplayName : ""})`}
      show={showfunc}
      right="0"
      width="49.5vw"
    >
      <Modal.Body>
        <div className={BizClass.Card}>
          <PageBar>
            <PageBar.Search onClick={() => console.log("CLicked")} value={searchTextProfile} onChange={(e) => onSearchProfile(e.target.value)} />
          </PageBar>
          <DataGrid rowData={profileList} loader={isLoadingProfileList ? <Loader /> : false} getRowStyle={getRowStyle} onGridReady={onProfilerGridReady}>
            <DataGrid.Column
              lockPosition="1"
              pinned="left"
              headerName=""
              field=""
              width={60}
              rowMultiSelectWithClick={false}
              rowSelection="single"
              suppressRowClickSelection={false}
              checkboxSelection
            />
            <DataGrid.Column field="#" headerName="Sr No." valueGetter="node.rowIndex + 1" width={100} type="leftAligned" />
            <DataGrid.Column headerName="Profile Name" field="ProfileName" width={240} />
            <DataGrid.Column headerName="Profile Description" field="ProfileDescription" width={220} />
          </DataGrid>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" varient="secondary" trigger={btnloaderActive}>
          Assign
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProfileListModal;

ProfileListModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
  selectedUserData: PropTypes.object,
  updateUserDataList: PropTypes.func.isRequired,
};
