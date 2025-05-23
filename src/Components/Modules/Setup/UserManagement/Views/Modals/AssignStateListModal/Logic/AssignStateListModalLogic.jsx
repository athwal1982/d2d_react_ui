import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { GetUserStateAssignManage } from "../Service/Methods";

function AssignStateListModalLogic() {
  const setAlertMessage = AlertMessage();
  const [userStateAssignList, setUserStateAssignList] = useState([]);
  const [isLoadingUserStateAssignList, setIsLoadingUserStateAssignList] = useState(false);
  const [userAssignStateGridApi, setUserAssignStateGridApi] = useState();
  const [searchTextUserAssignState, setSearchTextUserAssignState] = useState("");
  const [unAssignedStateListModal, setUnAssignedStateListModal] = useState(false);

  const getUserStateAssignList = async (data) => {
    try {
      setIsLoadingUserStateAssignList(true);
      const formdata = {
        viewMode: "GETASSIGNED",
        userStateID: "",
        appAccessID: data && data.AppAccessID ? data.AppAccessID : 0,
        stateMasterID: "",
      };
      const result = await GetUserStateAssignManage(formdata);
      console.log(result, "result");
      setIsLoadingUserStateAssignList(false);
      if (result.responseCode === 1) {
        console.log(result.responseData);
        setUserStateAssignList(result.responseData.UserStateAssignManage);
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const onUserAssignStateGridReady = (params) => {
    setUserAssignStateGridApi(params.api);
  };

  const onSearchUserAssignState = (val) => {
    setSearchTextUserAssignState(val);
    userAssignStateGridApi.setQuickFilter(val);
    userAssignStateGridApi.refreshCells();
  };

  const deleteUserAssignState = async (data) => {
    debugger;
    try {
      const formData = {
        viewMode: "UNASSIGN",
        userStateID: data && data.UserStateID ? data.UserStateID.toString() : "",
        appAccessID: data && data.AppAccessID ? data.AppAccessID : 0,
        stateMasterID: data && data.StateMasterID ? data.StateMasterID.toString() : "",
      };
      const result = await GetUserStateAssignManage(formData);
      console.log(result);
      if (result.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.responseMessage,
        });

        if (userAssignStateGridApi) {
          userAssignStateGridApi.updateRowData({ remove: [data] });
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

  const onClickDeleteUserAssignState = (data) => {
    console.log(data);
    deleteUserAssignState(data);
  };

  const toggleUnAssignedStateListModal = () => {
    setUnAssignedStateListModal(!unAssignedStateListModal);
  };

  const updateAssignedStateList = (assignedList) => {
    console.log(assignedList, "coming");

    if (assignedList && assignedList.length > 0) {
      assignedList.forEach((data) => {
        if (!userStateAssignList.some((x) => x.StateMasterID.toString() === data.StateMasterID.toString())) {
          userStateAssignList.unshift(data);
        }
      });
    }
    setUserStateAssignList([]);
    setUserStateAssignList(userStateAssignList);

    if (userAssignStateGridApi) {
      userAssignStateGridApi.setRowData(userStateAssignList);
    }
  };

  return {
    getUserStateAssignList,
    userStateAssignList,
    isLoadingUserStateAssignList,
    onUserAssignStateGridReady,
    searchTextUserAssignState,
    onSearchUserAssignState,
    onClickDeleteUserAssignState,
    unAssignedStateListModal,
    toggleUnAssignedStateListModal,
    updateAssignedStateList,
  };
}

export default AssignStateListModalLogic;
