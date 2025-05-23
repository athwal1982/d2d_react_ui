import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect, useState } from "react";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getUserListData, userUpdateActiveStatus } from "../Services/Methods";

function UserManagementLogics() {
  const [userDataList, setUserDataList] = useState(false);
  const [filteredUserDataList, setFilteredUserDataList] = useState([]);
  const [isLoadingUserDataList, setLoadingUserDataList] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [userListItemSearch, setUserListItemSearch] = useState("");
  const onChangeUserList = (val) => {
    setUserListItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const getUserData = async () => {
    debugger;
    try {
      setLoadingUserDataList(true);
      const userData = getSessionStorage("user");
      const formData = {
        appAccessID: userData && userData.LoginID ? userData.LoginID : 0,
        viewMode: "Select",
        userRelationType: "#ALL",
        userType: 0,
        searchText: userListItemSearch || "#ALL",
      };
      const result = await getUserListData(formData);
      setLoadingUserDataList(false);
      if (result.response.responseCode === 1) {
        if (userListItemSearch && userListItemSearch.toLowerCase().includes("#")) {
          onChangeUserList("");
        }
        setUserDataList(result.response.responseData.user);
        setFilteredUserDataList(result.response.responseData.user);
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
        setUserDataList([]);
        setFilteredUserDataList([]);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const updateUserData = (newlyAddedUser) => {
    debugger;
    console.log("newlyAddedUser", newlyAddedUser);
    if (gridApi) {
      const rowData = [];
      if (newlyAddedUser && newlyAddedUser.length > 0) {
        newlyAddedUser.forEach((data) => {
          rowData.push(data);
        });
      }
      gridApi.forEachNode((node) => rowData.push(node.data));
      gridApi.setRowData(rowData);
      userDataList.unshift(newlyAddedUser);
      setUserDataList([]);
      setUserDataList(userDataList);
      console.log("userDataList", userDataList);
    }
  };
  useEffect(() => {}, [userDataList]);
  const getUsersList = () => {
    getUserData();
  };

  const ActiveInActiveUserUpdate = async (data, pActiveStatus) => {
    debugger;
    try {
      setLoadingUserDataList(true);
      const updateActiveStatus = pActiveStatus && pActiveStatus === "Y" ? "N" : pActiveStatus === "N" ? "Y" : "";
      const formdata = {
        appAccessID: data.AppAccessID,
        isActive: updateActiveStatus,
      };
      const result = await userUpdateActiveStatus(formdata);
      setLoadingUserDataList(false);
      if (result.response.responseCode === 1) {
        if (gridApi) {
          const itemsToUpdate = [];
          gridApi.forEachNode(function (rowNode) {
            if (rowNode.data.AppAccessID.toString() === data.AppAccessID.toString()) {
              if (pActiveStatus === "Y") {
                data.ActiveStatus = "N";
              } else if (pActiveStatus === "N") {
                data.ActiveStatus = "Y";
              }
              itemsToUpdate.push(data);
              rowNode.setData(data);
            }
          });
          gridApi.updateRowData({
            update: itemsToUpdate,
          });
          console.log(itemsToUpdate);
        }
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

  const onActiveUser = (data) => {
    ActiveInActiveUserUpdate(data, data.ActiveStatus);
  };

  const onDeActiveUser = (data) => {
    ActiveInActiveUserUpdate(data, data.ActiveStatus);
  };

  const updateUserDataList = (data) => {
    if (gridApi) {
      console.log("data profile list", data);
      const itemsToUpdate = [];
      gridApi.forEachNode(function (rowNode) {
        debugger;
        if (rowNode.data.AppAccessID.toString() === data.AppAccessID.toString()) {
          debugger;
          rowNode.data.AssignmentFlag = "1";
          rowNode.data.ProfileName = data.ProfileName;
          console.log("rowNode.data", rowNode.data);
          itemsToUpdate.push(rowNode.data);
          rowNode.setData(rowNode.data);
        }
      });

      console.log("itemsToUpdate", itemsToUpdate);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return {
    userDataList,
    filteredUserDataList,
    isLoadingUserDataList,
    updateUserData,
    gridApi,
    onGridReady,
    onChangeUserList,
    userListItemSearch,
    getUsersList,
    onActiveUser,
    onDeActiveUser,
    updateUserDataList,
  };
}
export default UserManagementLogics;
