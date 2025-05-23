import React from "react";
import MenuToUserManagement from "./Views/MenuToUser";
import MenuToUserLogics from "./Logic/Logic";

function MenuToUser() {
  const {
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
  } = MenuToUserLogics();
  return (
    <MenuToUserManagement
      treeMenuListData={treeMenuListData}
      isLoadingMenuList={isLoadingMenuList}
      filteredUserDataList={filteredUserDataList}
      isLoadingUserDataList={isLoadingUserDataList}
      onGridReady={onGridReady}
      updateState={updateState}
      formValues={formValues}
      userNameSelect={userNameSelect}
      onChangeMenuList={onChangeMenuList}
      menuListItemSearch={menuListItemSearch}
      getMenuLists={getMenuLists}
      onAssignUnAssignMenu={onAssignUnAssignMenu}
    />
  );
}

export default MenuToUser;
