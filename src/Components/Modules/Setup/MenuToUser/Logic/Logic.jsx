import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect, useState, useRef } from "react";
import { getUserListData } from "../../UserManagement/Services/Methods";
import { getMenuListData, assignUnAssignMenuList } from "../Services/Methods";

function MenuToUserLogics() {
  const userNameSelect = useRef();
  const [formValues, setFormValues] = useState({
    txtUserName: "",
  });
  const [userDataList, setUserDataList] = useState(false);
  const [filteredUserDataList, setFilteredUserDataList] = useState([]);
  const [isLoadingUserDataList, setLoadingUserDataList] = useState(false);
  const setAlertMessage = AlertMessage();
  const getUserData = async () => {
    debugger;
    try {
      setLoadingUserDataList(true);
      const result = await getUserListData();
      setLoadingUserDataList(false);
      if (result.responseCode === 1) {
        setUserDataList(result.responseData.user);
        setFilteredUserDataList(result.responseData.user);
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

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    setGridApi(params.api);
  };
  const [menuListData, setMenuListData] = useState([]);
  const [treeMenuListData, setTreeMenuListData] = useState([]);
  const [isLoadingMenuList, setIsLoadingMenuList] = useState(false);

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    setTreeMenuListData([]);
    setMenuListData([]);
  };

  const [menuListItemSearch, setMenuListItemSearch] = useState("");
  const onChangeMenuList = (val) => {
    setMenuListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  useEffect(() => {
    if (userNameSelect.current) {
      userNameSelect.current.focus();
    }
  }, []);

  useEffect(() => {
    getUserData();
  }, []);

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
        AssignmentFlag: menu.AssignmentFlag,
        UserMenuAssignID: menu.UserMenuAssignID,
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

  const getUsersmenuList = async () => {
    try {
      setIsLoadingMenuList(true);
      const result = await getMenuListData(formValues.txtUserName);
      setIsLoadingMenuList(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.MenuMaster) {
          if (menuListItemSearch && menuListItemSearch.toLowerCase().includes("#")) {
            onChangeMenuList("");
          }
          setMenuListData(result.responseData.MenuMaster);
          setTreeMenuListData(result.responseData.MenuMaster);
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

  const getMenuLists = () => {
    if (formValues.txtUserName) {
      if (menuListItemSearch && menuListItemSearch.length >= 3) {
        getUsersmenuList();
      } else {
        setAlertMessage({
          type: "error",
          message: "Please type at least 3 character.",
        });
      }
    } else {
      if (userNameSelect.current) {
        userNameSelect.current.focus();
      }
      setAlertMessage({
        type: "error",
        message: "Please Select User First",
      });
    }
  };

  useEffect(() => {
    if (menuListData != null && menuListData.length > 0) {
      buildHierarchy();
    } else {
      setTreeMenuListData([]);
    }
  }, [menuListData]);

  const onAssignUnAssignMenu = async (data, status) => {
    try {
      const result = await assignUnAssignMenuList(data, status, formValues.txtUserName);
      if (result.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.responseMessage,
        });
        if (gridApi) {
          const itemsToUpdate = [];
          gridApi.forEachNode(function (rowNode) {
            if (rowNode.data.MenuMasterID.toString() === data.MenuMasterID.toString()) {
              if (status === "ASSIGN") {
                rowNode.data.AssignmentFlag = "1";
                rowNode.data.UserMenuAssignID = Number(result.responseData.UserMenuAssignID);
              } else {
                rowNode.data.AssignmentFlag = "0";
                rowNode.data.UserMenuAssignID = null;
              }
              itemsToUpdate.push(data);
              rowNode.setData(data);
            }
          });
          gridApi.updateRowData({
            update: itemsToUpdate,
          });
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  return {
    userDataList,
    filteredUserDataList,
    isLoadingUserDataList,
    gridApi,
    onGridReady,
    formValues,
    updateState,
    userNameSelect,
    onChangeMenuList,
    menuListItemSearch,
    getMenuLists,
    menuListData,
    treeMenuListData,
    isLoadingMenuList,
    onAssignUnAssignMenu,
  };
}
export default MenuToUserLogics;
