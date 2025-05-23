import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect, useState } from "react";
import { getUserProfileListData, userProfileMenuAssign } from "../Services/Methods";

function ProfileManagementLogics() {
  const [profileMasterData, setProfileMasterData] = useState([]);
  const [filterProfileMasterData, setFilterProfileMasterData] = useState([]);
  const [isLoadingProfileMasterData, setIsLoadingProfileMasterData] = useState(false);
  const [menuListData, setMenuListData] = useState([]);
  const [treeMenuListData, setTreeMenuListData] = useState([]);
  const [isLoadingMenuList, setIsLoadingMenuList] = useState(false);
  const [profileListData, setProfileListData] = useState([]);
  const [recentAddedMenuId, setRecentAddedMenuId] = useState(null);

  const setAlertMessage = AlertMessage();

  const [profilegridApi, setProfileGridApi] = useState();
  const onProfileGridReady = (params) => {
    setProfileGridApi(params.api);
  };

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    debugger;
    setGridApi(params.api);
  };

  const onSearchMenuList = (val) => {
    gridApi.setQuickFilter(val);
  };

  const onSearch = (val) => {
    if (val !== "") {
      const filteredData = profileMasterData.filter((data) => {
        return data.ProfileName.toLowerCase().includes(val.toLowerCase());
      });
      setFilterProfileMasterData(filteredData);
    } else {
      setFilterProfileMasterData(profileMasterData);
    }
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
        UserProfileID: menu.UserProfileID,
        ProfileMenuID: menu.ProfileMenuID,
        MenuMasterID: menu.MenuMasterID,
        MenuName: menu.MenuName,
        ReactURL: menu.ReactURL,
        WebURL: menu.WebURL,
        IsNewlyAdded: menu.IsNewlyAdded,
        orgHierarchy: [menu.MenuMasterID],
        AssignmentFlag: menu.AssignmentFlag,
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
      debugger;
      if (menu.UnderMenuID.toString() !== "0") {
        const parentMenu = menuListData.find((x) => x.MenuMasterID.toString() === menu.UnderMenuID.toString());
        if (parentMenu !== null && parentMenu !== undefined) {
          menuData.orgHierarchy.push(parentMenu.MenuMasterID);
          recHierarchy(menuData, parentMenu);
        }
      }
      menuTreeListData.push(menuData);
    });
    console.log("menuTreeListData", menuTreeListData);
    debugger;
    menuTreeListData.forEach((menu) => {
      menu.orgHierarchy = menu.orgHierarchy.reverse();
    });
    setTreeMenuListData(menuTreeListData);
  };

  useEffect(() => {
    if (menuListData != null && menuListData.length > 0) {
      buildHierarchy();
    } else {
      setTreeMenuListData([]);
    }
  }, [menuListData]);

  useEffect(() => {
    if (gridApi && treeMenuListData.length > 0 && recentAddedMenuId) {
      gridApi.forEachNode(function (rowNode) {
        if (rowNode.data.MenuMasterID.toString() === recentAddedMenuId.toString()) {
          gridApi.ensureIndexVisible(rowNode.rowIndex);
          setRecentAddedMenuId(null);
        }
      });
    }
  }, [treeMenuListData]);

  const getMenuListData = async (ProfileMenuID, UserProfileID, ModuleCode, MenuMasterID, ViewMode) => {
    try {
      setIsLoadingMenuList(true);

      const formData = {
        profileMenuID: ProfileMenuID,
        userProfileID: UserProfileID,
        viewMode: ViewMode,
        moduleCode: ModuleCode,
        menuMasterID: MenuMasterID,
      };

      const result = await userProfileMenuAssign(formData);
      setIsLoadingMenuList(false);
      debugger;
      if (result.response.responseCode === 1) {
        if (ViewMode === "AssignMenu" || ViewMode === "UNAssignMenu") {
          if (result.response.responseData && result.response.responseData.ProfileMenuID !== 0) {
            if (gridApi) {
              gridApi.forEachNode(function (rowNode) {
                if (rowNode.data.MenuMasterID === MenuMasterID) {
                  if (ViewMode === "AssignMenu" && result.response.responseData && result.response.responseData.ProfileMenuID) {
                    rowNode.data.ProfileMenuID = Number(result.response.responseData.ProfileMenuID);
                    rowNode.data.AssignmentFlag = 1;
                    rowNode.data.UserProfileID = UserProfileID;
                  } else if (ViewMode === "UNAssignMenu") {
                    rowNode.data.ProfileMenuID = null;
                    rowNode.data.AssignmentFlag = 0;
                    rowNode.data.UserProfileID = UserProfileID;
                  }
                  rowNode.setData(rowNode.data);
                }
              });
            }
          }
          setAlertMessage({
            type: "success",
            message: result.response.responseMessage,
          });
        } else if (result.response.responseData.UserProfileMenu && result.response.responseData.UserProfileMenu.length > 0) {
          setMenuListData(result.response.responseData.UserProfileMenu);
          console.log(result.response.responseData.UserProfileMenu);
        } else {
          setMenuListData([]);
        }
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
      console.log(error);
    }
  };

  const setSelectedRowColorUserProfile = (UserProfileID) => {
    if (profilegridApi) {
      profilegridApi.forEachNode(function (rowNode) {
        if (rowNode.data.UserProfileID === UserProfileID) {
          const newData = {
            ...rowNode.data,
            IsSelected: true,
          };
          rowNode.setData(newData);
        } else {
          rowNode.data.IsSelected = false;
          rowNode.setData(rowNode.data);
        }
      });
    }
  };

  const onAssignMenu = (menu) => {
    debugger;
    console.log("onUnAssignMenu", menu);
    getMenuListData(0, profileListData.UserProfileID, 0, menu.MenuMasterID, "AssignMenu");
  };

  const onGetMenuClick = (moduleData) => {
    debugger;
    console.log(moduleData);
    setMenuListData([]);
    setProfileListData(moduleData);
    getMenuListData(0, moduleData.UserProfileID, 0, 0, "AssignedMenu");
    setSelectedRowColorUserProfile(moduleData.UserProfileID);
  };

  const onUnAssignMenu = (menu) => {
    debugger;
    console.log("onUnAssignMenu", menu);
    getMenuListData(menu.ProfileMenuID, profileListData.UserProfileID, 0, menu.MenuMasterID, "UNAssignMenu");
  };

  const getUserProfileData = async () => {
    debugger;
    try {
      setProfileMasterData([]);
      setFilterProfileMasterData([]);

      setIsLoadingProfileMasterData(true);
      const formdata = {
        userProfileID: "0",
        viewMode: "Select",
        searchText: "#ALL",
        brHeadTypeID: "#ALL",
      };
      const result = await getUserProfileListData(formdata);
      setIsLoadingProfileMasterData(false);
      if (result.response.responseCode === 1) {
        setProfileMasterData(result.response.responseData.UserProfileMaster);
        setFilterProfileMasterData(result.response.responseData.UserProfileMaster);
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
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

  const onRefreshClick = () => {
    setFilterProfileMasterData([]);
    getUserProfileData();
  };

  const updateProfileMgmt = (addedData) => {
    if (profilegridApi) {
      const rowData = [];
      if (addedData && addedData.length > 0) {
        addedData.forEach((data) => {
          rowData.push(data);
        });
      }
      profilegridApi.forEachNode((node) => rowData.push(node.data));
      profilegridApi.setRowData(rowData);
    }
  };

  useEffect(() => {
    debugger;
    getUserProfileData();
  }, []);

  return {
    profileMasterData,
    filterProfileMasterData,
    isLoadingProfileMasterData,
    profilegridApi,
    onProfileGridReady,
    onGetMenuClick,
    updateProfileMgmt,
    treeMenuListData,
    isLoadingMenuList,
    gridApi,
    onGridReady,
    onAssignMenu,
    onUnAssignMenu,
    onSearch,
    onRefreshClick,
    onSearchMenuList,
  };
}

export default ProfileManagementLogics;
