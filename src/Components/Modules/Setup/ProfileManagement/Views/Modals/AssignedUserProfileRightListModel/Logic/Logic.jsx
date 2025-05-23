import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { getUserProfileRight, manageUserProfileRightAssign } from "../../../../Services/Methods";

function AssignedUserProfileRightListModalLogic() {
  const [assignedUserProfileRightList, setAssignedUserProfileRightList] = useState([]);
  const [isLoadingAssignedUserProfileRightList, setIsLoadingAssignedUserProfileRightList] = useState(false);
  const [filteredAssignedUserProfileRightList, setFilteredAssignedUserProfileRightList] = useState([]);

  const setAlertMessage = AlertMessage();

  const [unAssignedUserProfileRightListModal, setUnAssignedUserProfileRightListModal] = useState(false);
  const toggleUnAssignedUserProfileRightListModal = () => {
    setUnAssignedUserProfileRightListModal(!unAssignedUserProfileRightListModal);
  };

  const [assignedUserProfileRightGridApi, setAssignedUserProfileRightGridApi] = useState();
  const onAssignedUserProfileRightGridReady = (params) => {
    setAssignedUserProfileRightGridApi(params.api);
  };

  const [searchTextAssigendUserProfileRight, setSearchTextAssigendUserProfileRight] = useState("");
  const onSearchAssignedUserProfileRight = (val) => {
    debugger;
    setSearchTextAssigendUserProfileRight(val);
    assignedUserProfileRightGridApi.setQuickFilter(val);
    assignedUserProfileRightGridApi.refreshCells();
  };

  const [profileRightData, setProfileRightData] = useState([]);
  const getAssignedUserProfileRightListData = async (data) => {
    debugger;
    setProfileRightData(data);
    try {
      setAssignedUserProfileRightList([]);
      setFilteredAssignedUserProfileRightList([]);
      setIsLoadingAssignedUserProfileRightList(true);
      const formdata = {
        userProfileID: data && data.UserProfileID ? data.UserProfileID.toString() : "0",
        viewMode: "MENURIGHT",
        menuMasterID: data && data.MenuMasterID ? data.MenuMasterID.toString() : "0",
      };
      const result = await getUserProfileRight(formdata);
      setIsLoadingAssignedUserProfileRightList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.UserProfileRight) {
          setAssignedUserProfileRightList(result.response.responseData.UserProfileRight);
          setFilteredAssignedUserProfileRightList(result.response.responseData.UserProfileRight);
        } else {
          setAssignedUserProfileRightList([]);
          setFilteredAssignedUserProfileRightList([]);
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

  const updateAssignedUserProfileRightList = (assignedList) => {
    debugger;
    console.log(assignedList, "coming");

    if (assignedList && assignedList.length > 0) {
      assignedList.forEach((data) => {
        if (!assignedUserProfileRightList.some((x) => x.AccessID.toString() === data.AccessID.toString())) {
          assignedUserProfileRightList.unshift(data);
        }
      });
    }
    setAssignedUserProfileRightList([]);
    setAssignedUserProfileRightList(assignedUserProfileRightList);
    setFilteredAssignedUserProfileRightList([]);
    setFilteredAssignedUserProfileRightList(assignedUserProfileRightList);

    if (assignedUserProfileRightGridApi) {
      assignedUserProfileRightGridApi.setRowData(assignedUserProfileRightList);
    }
  };

  const [deletedAssignedUserProfileRight, setDeletedAssignedUserProfileRight] = useState();
  const onClickDeleteAssignedUserProfileRight = async (data) => {
    console.log(data);
    try {
      setIsLoadingAssignedUserProfileRightList(true);
      const formdata = {
        profileRightID: data && data.ProfileRightID ? data.ProfileRightID.toString() : "0",
        userProfileID: data && data.UserProfileID ? data.UserProfileID : 0,
        viewMode: "UNASSIGNRIGHTS",
        rightMasterID: data && data.RightMasterID ? data.RightMasterID.toString() : "0",
      };
      const result = await manageUserProfileRightAssign(formdata);
      setIsLoadingAssignedUserProfileRightList(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        setDeletedAssignedUserProfileRight([data]);
        if (assignedUserProfileRightGridApi) {
          assignedUserProfileRightGridApi.updateRowData({ remove: [data] });
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

  const onUnAssignMenuRight = async (data) => {
    debugger;
    console.log(data);
    try {
      const formdata = {
        profileRightID: data && data.ProfileRightID ? data.ProfileRightID.toString() : "0",
        userProfileID: profileRightData && profileRightData.UserProfileID ? profileRightData.UserProfileID.toString() : "0",
        viewMode: "UNASSIGNRIGHTS",
        rightMasterID: "0",
      };
      const result = await manageUserProfileRightAssign(formdata);

      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        if (assignedUserProfileRightGridApi) {
          const itemsToUpdate = [];
          assignedUserProfileRightGridApi.forEachNode(function (rowNode) {
            if (rowNode.data.ProfileRightID.toString() === data.ProfileRightID.toString()) {
              data.AssignmentFlag = 0;
              itemsToUpdate.push(data);
              rowNode.setData(data);
            }
          });
          assignedUserProfileRightGridApi.updateRowData({
            update: itemsToUpdate,
          });
          console.log(itemsToUpdate);
        }
      } else {
        setAlertMessage({ open: true, type: "error", message: result.response.responseMessage });
        console.log(result.response.responseMessage);
      }
    } catch (error) {
      setAlertMessage({ open: true, type: "error", message: error });
      console.log(error);
    }
  };

  const onAssignMenuRight = async (data) => {
    debugger;
    console.log(data);
    try {
      const formdata = {
        profileRightID: "0",
        userProfileID: profileRightData && profileRightData.UserProfileID ? profileRightData.UserProfileID.toString() : "0",
        viewMode: "ASSIGNRIGHTS",
        rightMasterID: data && data.RightMasterID ? data.RightMasterID.toString() : "0",
      };
      const result = await manageUserProfileRightAssign(formdata);

      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        const responseAssignedIds = result.response.responseData.ProfileRightID ? result.response.responseData.ProfileRightID.split(",") : [];
        console.log(responseAssignedIds);
        let assignedIds = [];
        if (responseAssignedIds.length > 0) {
          assignedIds = responseAssignedIds.reduce((assignmentIdList, data) => {
            const splitData = data.split("|");
            if (splitData.length > 0 && splitData[0] && splitData[1]) {
              assignmentIdList.push({
                userProfileID: splitData[0],
                ProfileRightID: splitData[1],
              });
            }
            return assignmentIdList;
          }, []);
          if (assignedIds.length > 0) {
            if (assignedUserProfileRightGridApi) {
              const itemsToUpdate = [];
              assignedUserProfileRightGridApi.forEachNode(function (rowNode) {
                if (rowNode.data.RightMasterID.toString() === data.RightMasterID.toString()) {
                  data.AssignmentFlag = 1;
                  data.ProfileRightID = assignedIds[0].ProfileRightID;
                  itemsToUpdate.push(data);
                  rowNode.setData(data);
                }
              });
              assignedUserProfileRightGridApi.updateRowData({
                update: itemsToUpdate,
              });
              console.log(itemsToUpdate);
            }
          }
        }
      } else {
        setAlertMessage({ open: true, type: "error", message: result.response.responseMessage });
        console.log(result.response.responseMessage);
      }
    } catch (error) {
      setAlertMessage({ open: true, type: "error", message: error });
      console.log(error);
    }
  };

  return {
    unAssignedUserProfileRightListModal,
    toggleUnAssignedUserProfileRightListModal,
    assignedUserProfileRightList,
    filteredAssignedUserProfileRightList,
    isLoadingAssignedUserProfileRightList,
    getAssignedUserProfileRightListData,
    updateAssignedUserProfileRightList,
    onClickDeleteAssignedUserProfileRight,
    deletedAssignedUserProfileRight,
    searchTextAssigendUserProfileRight,
    onAssignedUserProfileRightGridReady,
    onSearchAssignedUserProfileRight,
    onUnAssignMenuRight,
    onAssignMenuRight,
  };
}

export default AssignedUserProfileRightListModalLogic;
