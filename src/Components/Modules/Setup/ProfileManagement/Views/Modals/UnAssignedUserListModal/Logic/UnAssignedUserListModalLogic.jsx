import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState, useEffect } from "react";
import { manageUserProfileAssign } from "../../../../Services/Methods";

function UnAssignedUserListModalLogic() {
  const [unAssignedUserList, setUnassignedUserList] = useState([]);
  const [isLoadingUnassignedUserList, setIsLoadingUnassignedUserList] = useState(false);
  const [filteredUnassignedUserList, setFiltereUnAssignedUserList] = useState([]);

  const [selectedRowData, setSelectedRowData] = useState();
  const [deletedAssignedRow, setDeletedAssignedRow] = useState([]);

  const [formValues, setFormValues] = useState({
    txtUserProfileTypeList: null,
  });

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const userProfileTypeList = [
    { lable: "Dynamic", value: "D" },
    { lable: "Static", value: "S" },
  ];

  const setAlertMessage = AlertMessage();

  const getUnAssignedUserListData = async (data) => {
    debugger;
    try {
      setUnassignedUserList([]);
      setFiltereUnAssignedUserList([]);
      setIsLoadingUnassignedUserList(true);
      const formdata = {
        action: "GETUNASSIGNED",
        profileAssignID: "0",
        userProfileID: data && data.UserProfileID ? data.UserProfileID.toString() : "0",
        accessID: "0",
        userProfileType: "",
      };
      const result = await manageUserProfileAssign(formdata);
      setIsLoadingUnassignedUserList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.UserProfileAssignMaster) {
          const mappedData = result.response.responseData.UserProfileAssignMaster.map((data) => {
            return { ...data, IsChecked: false };
          });
          setUnassignedUserList(mappedData);
          setFiltereUnAssignedUserList(mappedData);
        } else {
          setUnassignedUserList([]);
          setFiltereUnAssignedUserList([]);
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

  const resetUnAssignedUserList = (result, updateAssignedUserList) => {
    console.log(result);
    if (result.response.responseData) {
      const responseAssignedIds = result.response.responseData.ProfileAssignID ? result.response.responseData.ProfileAssignID.split(",") : [];
      console.log(responseAssignedIds);

      let assignedIds = [];
      if (responseAssignedIds.length > 0) {
        assignedIds = responseAssignedIds.reduce((assignmentIdList, data) => {
          const splitData = data.split("|");
          if (splitData.length > 0 && splitData[0] && splitData[1]) {
            assignmentIdList.push({
              AccessID: splitData[0],
              ProfileAssignID: splitData[1],
            });
          }
          return assignmentIdList;
        }, []);
      }
      if (assignedIds.length > 0) {
        console.log(assignedIds, "assignedIds");
        const filteredAssignedList = filteredUnassignedUserList.reduce((assignedList, data) => {
          const resultData = assignedIds.find((x) => x.AccessID.toString() === data.AccessID.toString());
          if (resultData) {
            assignedList.push({
              ProfileAssignID: resultData.ProfileAssignID.toString(),
              AccessID: data.AccessID,
              UserDisplayName: data.UserDisplayName,
              AppAccessUserName: data.AppAccessUserName,
              ProfileDescription: selectedRowData && selectedRowData.ProfileDescription ? selectedRowData.ProfileDescription : "",
              ProfileName: selectedRowData && selectedRowData.ProfileName ? selectedRowData.ProfileName : "",
              UserProfileID: selectedRowData && selectedRowData.UserProfileID ? selectedRowData.UserProfileID.toString() : "0",
              UserProfileType: "Dynamic",
              IsNewlyAdded: true,
            });
          }
          return assignedList;
        }, []);
        updateAssignedUserList(filteredAssignedList);
      }

      let updatedUnAssignedList = unAssignedUserList.filter(function (value) {
        return assignedIds.length === 0 || !assignedIds.some((x) => x.AccessID.toString() === value.AccessID.toString());
      });
      const unAssignedIds = result.response.responseData.ProfileAssignID ? result.response.responseData.ProfileAssignID.split(",") : [];
      if (unAssignedIds.length > 0) {
        updatedUnAssignedList = updatedUnAssignedList.map((data) => {
          if (unAssignedIds.includes(data.AccessID.toString())) {
            data.FailedAssigned = true;
            data.IsChecked = false;
          }
          return { ...data };
        });
      }
      setUnassignedUserList([]);
      setFiltereUnAssignedUserList([]);
      setUnassignedUserList(updatedUnAssignedList);
      setFiltereUnAssignedUserList(updatedUnAssignedList);
      if (assignedIds.length > 0)
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
      else if (unAssignedIds.length > 0)
        setAlertMessage({
          type: "success",
          message: "Already Assigned",
        });
    } else {
      setAlertMessage({
        type: "success",
        message: result.response.responseData.responseMessage,
      });
    }
  };

  const [gridApiUnAssign, setGridApiUnAssign] = useState();
  const onGridReadyUnAssign = (params) => {
    debugger;
    setGridApiUnAssign(params.api);
  };

  const [searchTextUnAssigendUser, setSearchTextUnAssigendUser] = useState("");
  const onSearchUnAssignedUser = (val) => {
    debugger;
    setSearchTextUnAssigendUser(val);
    gridApiUnAssign.setQuickFilter(val);
    gridApiUnAssign.refreshCells();
  };

  const updateUnAssignedUserList = (newlyAddedUser) => {
    debugger;

    if (newlyAddedUser && newlyAddedUser.length > 0) {
      newlyAddedUser.forEach((data) => {
        if (!unAssignedUserList.some((x) => x.AccessID.toString() === data.AccessID.toString())) {
          unAssignedUserList.unshift(data);
        }
      });
    }
    setUnassignedUserList([]);
    setUnassignedUserList(unAssignedUserList);
    setFiltereUnAssignedUserList([]);
    setFiltereUnAssignedUserList(unAssignedUserList);

    if (gridApiUnAssign) {
      gridApiUnAssign.setRowData(unAssignedUserList);
    }
  };

  useEffect(() => {
    debugger;
    if (deletedAssignedRow) {
      updateUnAssignedUserList(deletedAssignedRow);
    }
  }, [deletedAssignedRow]);

  const getSelectedRowData = () => {
    const selectedNodes = gridApiUnAssign.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async (e, updateAssignedUserList) => {
    debugger;
    try {
      if (e) e.preventDefault();
      const checkedItem = getSelectedRowData();
      if (checkedItem.length === 0) {
        setAlertMessage({
          type: "error",
          message: "Please select atleast one user.",
        });
        return;
      }
      const accessIds = checkedItem
        .map((data) => {
          return data.AccessID;
        })
        .join(",");
      setBtnLoaderActive(true);

      const formdata = {
        action: "ASSIGN",
        profileAssignID: "0",
        userProfileID: selectedRowData && selectedRowData.UserProfileID ? selectedRowData.UserProfileID.toString() : "0",
        accessID: accessIds,
        userProfileType: "D",
      };
      const result = await manageUserProfileAssign(formdata);
      console.log(result, "result");
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        console.log(result.response.responseData);
        resetUnAssignedUserList(result, updateAssignedUserList);
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
    }
  };
  return {
    unAssignedUserList,
    filteredUnassignedUserList,
    isLoadingUnassignedUserList,
    getUnAssignedUserListData,
    formValues,
    updateState,
    userProfileTypeList,
    btnLoaderActive,
    handleSave,
    onGridReadyUnAssign,
    setSelectedRowData,
    searchTextUnAssigendUser,
    onSearchUnAssignedUser,
    setDeletedAssignedRow,
  };
}

export default UnAssignedUserListModalLogic;
