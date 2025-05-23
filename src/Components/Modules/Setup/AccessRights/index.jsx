import React, { useState } from "react";
import AccessRights from "./Views/AccessRights";
import AccessRightsLogics from "./Logic/Logic";
import AddRights from "./Views/Modals/AddRights/AddRights";
import AssignUsersPopup from "./Views/Modals/AssignUsersPopup/AssignUsersPopup";

function AccessRightsPage() {
  const [addUserModal, setAddUserModal] = useState(false);
  const toggleAddRightsModal = () => {
    setAddUserModal(!addUserModal);
  };
  const { filteredRightsDataList, isLoadingRightsData, updateRightsData, onGridReady, userRightsItemSearch, getRightsList, onChangeRightsList } =
    AccessRightsLogics();

  const [assignedUsersPopUp, setAssignedUsersPopUp] = useState(false);

  const [assignUsersPopUp, setAssignUsersPopUp] = useState(false);
  const toggleAssignUserPopUp = (data) => {
    debugger;
    setAssignUsersPopUp(!assignUsersPopUp);
    setAssignedUsersPopUp(data);
  };

  return (
    <>
      {assignUsersPopUp ? <AssignUsersPopup showfunc={toggleAssignUserPopUp} assignedUsersPopUp={assignedUsersPopUp} /> : null}
      {addUserModal ? <AddRights showfunc={toggleAddRightsModal} updateRightsData={updateRightsData} /> : null}
      <AccessRights
        toggleAddRightsModal={toggleAddRightsModal}
        onGridReady={onGridReady}
        filteredRightsDataList={filteredRightsDataList}
        isLoadingRightsData={isLoadingRightsData}
        toggleAssignUserPopUp={toggleAssignUserPopUp}
        onChangeRightsList={onChangeRightsList}
        getRightsList={getRightsList}
        userRightsItemSearch={userRightsItemSearch}
      />
    </>
  );
}

export default AccessRightsPage;
