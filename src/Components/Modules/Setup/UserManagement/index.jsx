import React, { useState } from "react";
import UserManagement from "./Views/UserManagement";
import UserManagementLogics from "./Logic/Logic";
import AddUser from "./Views/Modals/AddUser/AddUser";
import ProfileListModal from "./Views/Modals/ProfileListModal/ProfileListModal";
import AssignStateListModal from "./Views/Modals/AssignStateListModal/AssignStateListModal";
import ResetPasswordModal from "./Views/Modals/ResetPasswordModal/ResetPasswordModal";

function UserManagementPage() {
  const [addUserModal, setAddUserModal] = useState(false);
  const toggleAddVisitModal = () => {
    setAddUserModal(!addUserModal);
  };
  const {
    filteredUserDataList,
    isLoadingUserDataList,
    updateUserData,
    onGridReady,
    onChangeUserList,
    getUsersList,
    userListItemSearch,
    onActiveUser,
    onDeActiveUser,
    updateUserDataList,
  } = UserManagementLogics();

  const referenceTypeOptions = [
    { Name: "EMP", Value: "EMP" },
    { Name: "BR", Value: "BR" },
  ];

  const [selectedUserData, setSelectedUserData] = useState({});

  const [profileListModal, setProfileListModal] = useState(false);
  const toggleProfileListModal = (data) => {
    debugger;
    setProfileListModal(!profileListModal);
    setSelectedUserData(data);
  };

  const [assignStateListModal, setAssignStateListModal] = useState(false);
  const toggleAssignStateListModal = (data) => {
    setAssignStateListModal(!assignStateListModal);
    setSelectedUserData(data);
  };

  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const toggleResetPasswordModal = (data) => {
    setResetPasswordModal(!resetPasswordModal);
    setSelectedUserData(data);
  };

  return (
    <>
      {addUserModal ? <AddUser showfunc={toggleAddVisitModal} updateUserData={updateUserData} referenceTypeOptions={referenceTypeOptions} /> : null}
      {profileListModal && <ProfileListModal showfunc={toggleProfileListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} />}
      {assignStateListModal ? (
        <AssignStateListModal showfunc={toggleAssignStateListModal} selectedUserData={selectedUserData} updateUserDataList={updateUserDataList} />
      ) : null}
      {resetPasswordModal ? <ResetPasswordModal showfunc={toggleResetPasswordModal} selectedUserData={selectedUserData} /> : null}
      <UserManagement
        filteredUserDataList={filteredUserDataList}
        isLoadingUserDataList={isLoadingUserDataList}
        toggleAddVisitModal={toggleAddVisitModal}
        onGridReady={onGridReady}
        getUsersList={getUsersList}
        onChangeUserList={onChangeUserList}
        userListItemSearch={userListItemSearch}
        onActiveUser={onActiveUser}
        onDeActiveUser={onDeActiveUser}
        toggleProfileListModal={toggleProfileListModal}
        toggleAssignStateListModal={toggleAssignStateListModal}
        toggleResetPasswordModal={toggleResetPasswordModal}
      />
    </>
  );
}

export default UserManagementPage;
