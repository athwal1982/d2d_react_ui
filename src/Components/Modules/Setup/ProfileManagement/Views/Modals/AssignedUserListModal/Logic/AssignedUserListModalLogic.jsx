import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { manageUserProfileAssign } from "../../../../Services/Methods";

function AssignedUserListModalLogic() {
  const [assignedUserList, setAssignedUserList] = useState([]);
  const [isLoadingAssignedUserList, setIsLoadingAssignedUserList] = useState(false);
  const [filteredAssignedUserList, setFilteredAssignedUserList] = useState([]);

  const setAlertMessage = AlertMessage();

  const [unAssignedUserListModal, setUnAssignedUserListModal] = useState(false);
  const toggleUnAssignedUserListModal = () => {
    setUnAssignedUserListModal(!unAssignedUserListModal);
  };

  const [assignedUserGridApi, setAssignedUserGridApi] = useState();
  const onAssignedUserGridReady = (params) => {
    setAssignedUserGridApi(params.api);
  };

  const [searchTextAssigendUser, setSearchTextAssigendUser] = useState("");
  const onSearchAssignedUser = (val) => {
    debugger;
    setSearchTextAssigendUser(val);
    assignedUserGridApi.setQuickFilter(val);
    assignedUserGridApi.refreshCells();
  };

  const getAssignedUserListData = async (data) => {
    debugger;
    try {
      setAssignedUserList([]);
      setFilteredAssignedUserList([]);
      setIsLoadingAssignedUserList(true);
      const formdata = {
        action: "GETASSIGNED",
        profileAssignID: "0",
        userProfileID: data && data.UserProfileID ? data.UserProfileID.toString() : "0",
        accessID: "0",
        userProfileType: "",
      };
      const result = await manageUserProfileAssign(formdata);
      setIsLoadingAssignedUserList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.UserProfileAssignMaster) {
          setAssignedUserList(result.response.responseData.UserProfileAssignMaster);
          setFilteredAssignedUserList(result.response.responseData.UserProfileAssignMaster);
        } else {
          setAssignedUserList([]);
          setFilteredAssignedUserList([]);
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

  const updateAssignedUserList = (assignedList) => {
    debugger;
    console.log(assignedList, "coming");

    if (assignedList && assignedList.length > 0) {
      assignedList.forEach((data) => {
        if (!assignedUserList.some((x) => x.AccessID.toString() === data.AccessID.toString())) {
          assignedUserList.unshift(data);
        }
      });
    }
    setAssignedUserList([]);
    setAssignedUserList(assignedUserList);
    setFilteredAssignedUserList([]);
    setFilteredAssignedUserList(assignedUserList);

    if (assignedUserGridApi) {
      assignedUserGridApi.setRowData(assignedUserList);
    }
  };

  const [deletedAssignedUser, setDeletedAssignedUser] = useState();
  const onClickDeleteAssignedUser = async (data) => {
    console.log(data);
    try {
      setIsLoadingAssignedUserList(true);
      const formdata = {
        action: "UNASSIGN",
        profileAssignID: data && data.ProfileAssignID ? data.ProfileAssignID.toString() : "0",
        userProfileID: data && data.UserProfileID ? data.UserProfileID.toString() : "0",
        accessID: data && data.AccessID ? data.AccessID.toString() : "0",
        userProfileType: data && data.UserProfileType ? data.UserProfileType : "",
      };
      const result = await manageUserProfileAssign(formdata);
      setIsLoadingAssignedUserList(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        setDeletedAssignedUser([data]);
        if (assignedUserGridApi) {
          assignedUserGridApi.updateRowData({ remove: [data] });
        }
      } else {
        setAlertMessage({ open: true, type: "error", msg: result.response.responseMessage });
        console.log(result.response.responseMessage);
      }
    } catch (error) {
      setAlertMessage({ open: true, type: "error", message: error });
      console.log(error);
    }
  };

  return {
    unAssignedUserListModal,
    toggleUnAssignedUserListModal,
    assignedUserList,
    filteredAssignedUserList,
    isLoadingAssignedUserList,
    getAssignedUserListData,
    updateAssignedUserList,
    onClickDeleteAssignedUser,
    deletedAssignedUser,
    searchTextAssigendUser,
    onAssignedUserGridReady,
    onSearchAssignedUser,
  };
}

export default AssignedUserListModalLogic;
