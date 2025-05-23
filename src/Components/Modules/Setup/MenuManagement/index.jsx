import React, { useState } from "react";
import MenuManagement from "./Views/MenuManagement";
import MenuManagementLogics from "./Logic/Logic";
import SubMenuPopup from "./Views/SubMenu/SubMenuPopUp";
import AddMenuPopup from "./Views/AddMenuPopUp/AddMenuPopUp";

function MenuManagementPage() {
  const [addMenuModal, setAddMenuModal] = useState(false);
  const toggleAddMenuModal = () => {
    debugger;
    setAddMenuModal(!addMenuModal);
  };

  const {
    treeMenuListData,
    isLoadingMenuList,
    submenuPopupData,
    openSubmenuPopup,
    toggleAddSubMenuModal,
    onGridReady,
    updateMenuList,
    onChangemenuList,
    getMenuList,
    menuItemSearch,
  } = MenuManagementLogics();

  return (
    <>
      {addMenuModal ? <AddMenuPopup showMenufunc={toggleAddMenuModal} updateMenuList={updateMenuList} /> : null}
      {submenuPopupData.open ? (
        <SubMenuPopup
          isEditMode={submenuPopupData.isEditMode}
          openSubmenuPopup={openSubmenuPopup}
          menuData={submenuPopupData.data}
          showfunc={toggleAddSubMenuModal}
          updateMenuList={updateMenuList}
        />
      ) : null}
      <MenuManagement
        treeMenuListData={treeMenuListData}
        isLoadingMenuList={isLoadingMenuList}
        openSubmenuPopup={openSubmenuPopup}
        onGridReady={onGridReady}
        toggleAddMenuModal={toggleAddMenuModal}
        onChangemenuList={onChangemenuList}
        getMenuList={getMenuList}
        menuItemSearch={menuItemSearch}
      />
    </>
  );
}

export default MenuManagementPage;
