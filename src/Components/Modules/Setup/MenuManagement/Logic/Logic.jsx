import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect, useState } from "react";
import { getMenuListData } from "../Services/Methods";

function MenuManagementLogics() {
  const [menuListData, setMenuListData] = useState([]);
  const [treeMenuListData, setTreeMenuListData] = useState([]);
  const [isLoadingMenuList, setIsLoadingMenuList] = useState(false);
  const [submenuPopupData, openSubmenuPopup] = useState({ open: false, data: null, isEditMode: false });
  const [recentAddedMenuId, setRecentAddedMenuId] = useState(null);

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const [menuItemSearch, setMenuItemSearch] = useState("");
  const onChangemenuList = (val) => {
    setMenuItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const recHierarchy = (menu, parent) => {
    if (parent.UnderMenuID.toString() !== 0) {
      const parentMenu = menuListData.find((x) => x.MenuMasterID.toString() === parent.UnderMenuID.toString());
      if (parentMenu !== null && parentMenu !== undefined) {
        menu.orgHierarchy.push(parentMenu.MenuMasterID);
        recHierarchy(menu, parentMenu);
      }
    }
  };

  const buildHierarchy = () => {
    const menuTreeListData = [];
    menuListData.forEach((menu) => {
      const menuData = {
        MenuMasterID: menu.MenuMasterID,
        MenuName: menu.MenuName,
        ReactURL: menu.ReactURL,
        WebURL: menu.WebURL,
        IsNewlyAdded: menu.IsNewlyAdded,
        orgHierarchy: [menu.MenuMasterID],
        HasChild: menu.HasChild.toString(),
        APIURL: menu.APIURL,
        AppURL: menu.AppURL,
        MenuSequence: menu.MenuSequence,
        MenuType: menu.MenuType,
        MenuTypeName: menu.MenuType === 1 ? "BizNext" : menu.MenuType === 2 ? "MyPortal" : "",
        UnderMenuID: menu.UnderMenuID,
        WPFURL: menu.WPFURL,
        WinURL: menu.WinURL,
      };

      if (menu.UnderMenuID.toString() !== "0") {
        const parentMenu = menuListData.find((x) => x.MenuMasterID.toString() === menu.UnderMenuID.toString());
        if (parentMenu !== null && parentMenu !== undefined) {
          menuData.orgHierarchy.push(parentMenu.MenuMasterID);
          recHierarchy(menuData, parentMenu);
        }
      }
      menuTreeListData.push(menuData);
    });

    menuTreeListData.forEach((menu) => {
      menu.orgHierarchy = menu.orgHierarchy.reverse();
    });
    setTreeMenuListData(menuTreeListData);
  };

  const setAlertMessage = AlertMessage();
  const getMenuData = async () => {
    debugger;
    try {
      setIsLoadingMenuList(true);
      const result = await getMenuListData();
      setIsLoadingMenuList(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.MenuMaster) {
          if (menuItemSearch && menuItemSearch.toLowerCase().includes("#")) {
            onChangemenuList("");
          }
          setMenuListData(result.responseData.MenuMaster);
          setTreeMenuListData(result.responseData.MenuMaster);
        } else {
          setMenuListData([]);
          setTreeMenuListData([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const toggleAddSubMenuModal = () => {
    openSubmenuPopup({ open: false, data: null, isEditMode: false });
  };

  const getMenuList = () => {
    getMenuData();
  };

  useEffect(() => {
    getMenuData();
  }, []);

  const updateMenuList = (subMenu, isEditMode) => {
    debugger;
    if (isEditMode) {
      const index = menuListData.findIndex((x) => x.MenuMasterID === subMenu.MenuMasterID);
      menuListData[index].MenuName = subMenu.MenuName;
      menuListData[index].MenuSequence = subMenu.MenuSequence;
      menuListData[index].MenuType = subMenu.MenuType;
      menuListData[index].UnderMenuID = subMenu.UnderMenuID;
      menuListData[index].APIURL = subMenu.APIURL;
      menuListData[index].AppURL = subMenu.AppURL;
      menuListData[index].ReactURL = subMenu.ReactURL;
      menuListData[index].WebURL = subMenu.WebURL;
      menuListData[index].WPFURL = subMenu.WPFURL;
      menuListData[index].WinURL = subMenu.WinURL;
      menuListData[index].IsNewlyAdded = subMenu.IsNewlyAdded;
      menuListData[index].HasChild = subMenu.HasChild;
    } else {
      menuListData.push(subMenu);
    }
    setRecentAddedMenuId(subMenu.MenuMasterID);
    setMenuListData(menuListData);
    if (menuListData != null && menuListData.length > 0) {
      buildHierarchy();
    } else {
      setTreeMenuListData([]);
    }
  };

  useEffect(() => {
    if (menuListData != null && menuListData.length > 0) {
      buildHierarchy();
    } else {
      setTreeMenuListData([]);
    }
  }, [menuListData]);

  useEffect(() => {
    debugger;
    if (gridApi && treeMenuListData.length > 0 && recentAddedMenuId) {
      gridApi.setRowData(treeMenuListData);
      setRecentAddedMenuId(null);
    }
  }, [treeMenuListData]);

  return {
    menuListData,
    treeMenuListData,
    isLoadingMenuList,
    submenuPopupData,
    openSubmenuPopup,
    toggleAddSubMenuModal,
    updateMenuList,
    onGridReady,
    onChangemenuList,
    getMenuList,
    menuItemSearch,
  };
}
export default MenuManagementLogics;
