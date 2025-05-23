import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { manageUserRightAssign } from "../../../../Services/Methods";

function AssignUserPopUpLogic() {
  const [assignedUserList, setAssignedUserList] = useState([]);
  const [isLoadingAssignedUserList, setIsLoadingAssignedUserList] = useState(false);
  const [filteredAssignedUserList, setFilteredAssignedUserList] = useState([]);

  const [unAssignUsersPopUp, setUnAssignUsersPopUp] = useState(false);
  const toggleUnAssignUsersPopUp = () => {
    setUnAssignUsersPopUp(!unAssignUsersPopUp);
  };

  const [assignedUserGridApi, setAssignedUserGridApi] = useState();
  const onAssignedUserGridReady = (params) => {
    setAssignedUserGridApi(params.api);
  };

  const [searchTextAssigendUser, setSearchTextAssigendUser] = useState("");
  const onSearchAssignedUser = (val) => {
    setSearchTextAssigendUser(val);
    assignedUserGridApi.setQuickFilter(val);
    assignedUserGridApi.refreshCells();
  };

  const setAlertMessage = AlertMessage();

  const getAssignedUserListData = async (data) => {
    debugger;
    try {
      setAssignedUserList([]);
      setFilteredAssignedUserList([]);
      setIsLoadingAssignedUserList(true);
      const formdata = {
        rightsAssignID: "0",
        accessID: "0",
        rightMasterID: data && data.RightMasterID ? data.RightMasterID.toString() : "0",
        viewMode: "GETASSIGNED",
      };
      const result = await manageUserRightAssign(formdata);
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
    console.log(assignedList);
    const newlyAddedUser = [];
    if (assignedList && assignedList.length > 0) {
      assignedList.forEach((data) => {
        if (!assignedUserList.some((x) => x.AccessID.toString() === data.AccessID.toString())) {
          newlyAddedUser.push(data);
        }
      });
    }

    if (assignedUserGridApi) {
      const rowData = [];
      if (newlyAddedUser && newlyAddedUser.length > 0) {
        newlyAddedUser.forEach((data) => {
          rowData.push(data);
        });
      }
      assignedUserGridApi.forEachNode((node) => rowData.push(node.data));
      assignedUserGridApi.setRowData(rowData);
    }
  };

  const [deletedAssignedUser, setDeletedAssignedUser] = useState();
  const onClickDeleteAssignedUser = async (data) => {
    console.log(data);
    try {
      setIsLoadingAssignedUserList(true);
      const formdata = {
        rightsAssignID: data && data.RightsAssignID ? data.RightsAssignID.toString() : "0",
        accessID: data && data.AccessID ? data.AccessID.toString() : "0",
        rightMasterID: data && data.RightMasterID ? data.RightMasterID.toString() : "0",
        viewMode: "UNASSIGN",
      };
      const result = await manageUserRightAssign(formdata);
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
    unAssignUsersPopUp,
    toggleUnAssignUsersPopUp,
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

export default AssignUserPopUpLogic;
