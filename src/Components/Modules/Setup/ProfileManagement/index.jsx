import React, { useState } from "react";
import ProfileManagement from "./Views/ProfileManagement";
import ProfileManagementLogics from "./Logic/Logic";
import AddUserProfile from "./Views/Modals/AddUserProfie/AddUserProfile";
import AssignedUserListModal from "./Views/Modals/AssignedUserListModal/AssignedUserListModal";
import AssignedUserProfileRightListModal from "./Views/Modals/AssignedUserProfileRightListModel/AssignedUserProfileRightListModel";

function ProfileManagementPage() {
  const [addUserProfileModal, setAddUserProfileModal] = useState(false);
  const toggleAddUserProfileModal = () => {
    setAddUserProfileModal(!addUserProfileModal);
  };

  const {
    filterProfileMasterData,
    isLoadingProfileMasterData,
    updateProfileMgmt,
    onGetMenuClick,
    onProfileGridReady,
    menuListData,
    treeMenuListData,
    onGridReady,
    onAssignMenu,
    onUnAssignMenu,
    onSearch,
    onRefreshClick,
    onSearchMenuList,
  } = ProfileManagementLogics();

  const [assignedUsersModal, setAssignedUsersModal] = useState(false);

  const [assignedUserListModal, setAssignedUserListModal] = useState(false);
  const toggleAssignedUserListModal = (data) => {
    debugger;
    setAssignedUserListModal(!assignedUserListModal);
    setAssignedUsersModal(data);
  };

  const [assignedUsersProfileRightModal, setAssignedUsersProfileRightModal] = useState(false);

  const [assignedUserProfileRightListModal, setAssignedUserProfileRightListModal] = useState(false);
  const toggleAssignedUserProfileRightListModal = (data) => {
    debugger;
    setAssignedUserProfileRightListModal(!assignedUserProfileRightListModal);
    setAssignedUsersProfileRightModal(data);
  };

  return (
    <>
      {addUserProfileModal ? <AddUserProfile showfunc={toggleAddUserProfileModal} updateProfileMgmt={updateProfileMgmt} /> : null}
      {assignedUserListModal && <AssignedUserListModal showfunc={toggleAssignedUserListModal} assignedUsersModal={assignedUsersModal} />}
      {assignedUserProfileRightListModal && (
        <AssignedUserProfileRightListModal showfunc={toggleAssignedUserProfileRightListModal} assignedUsersProfileRightModal={assignedUsersProfileRightModal} />
      )}
      <ProfileManagement
        filterProfileMasterData={filterProfileMasterData}
        isLoadingProfileMasterData={isLoadingProfileMasterData}
        toggleAddUserProfileModal={toggleAddUserProfileModal}
        onProfileGridReady={onProfileGridReady}
        onGetMenuClick={onGetMenuClick}
        menuListData={menuListData}
        treeMenuListData={treeMenuListData}
        onGridReady={onGridReady}
        onAssignMenu={onAssignMenu}
        onUnAssignMenu={onUnAssignMenu}
        toggleAssignedUserListModal={toggleAssignedUserListModal}
        onSearch={onSearch}
        onRefreshClick={onRefreshClick}
        onSearchMenuList={onSearchMenuList}
        toggleAssignedUserProfileRightListModal={toggleAssignedUserProfileRightListModal}
      />
    </>
  );
}

export default ProfileManagementPage;
