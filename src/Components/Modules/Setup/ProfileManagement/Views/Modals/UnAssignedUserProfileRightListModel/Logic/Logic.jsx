import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState, useEffect } from "react";
import { manageUserProfileRightAssign } from "../../../../Services/Methods";

function UnAssignedUserProfileRightListModalLogic() {
  const [unAssignedUserProfileRightList, setUnassignedUserProfileRightList] = useState([]);
  const [isLoadingUnassignedUserProfileRightList, setIsLoadingUnassignedUserProfileRightList] = useState(false);
  const [filteredUnassignedUserProfileRightList, setFiltereUnAssignedUserProfileRightList] = useState([]);

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

  const getUnAssignedUserProfileRightListData = async (data) => {
    debugger;
    try {
      setUnassignedUserProfileRightList([]);
      setFiltereUnAssignedUserProfileRightList([]);
      setIsLoadingUnassignedUserProfileRightList(true);
      const formdata = {
        profileRightID: "0",
        userProfileID: data && data.UserProfileID ? data.UserProfileID : 0,
        viewMode: "UNASSIGNRIGHTS",
        rightMasterID: "0",
      };
      const result = await manageUserProfileRightAssign(formdata);
      setIsLoadingUnassignedUserProfileRightList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.UserProfileRight) {
          const mappedData = result.response.responseData.UserProfileRight.map((data) => {
            return { ...data, IsChecked: false };
          });
          setUnassignedUserProfileRightList(mappedData);
          setFiltereUnAssignedUserProfileRightList(mappedData);
        } else {
          setUnassignedUserProfileRightList([]);
          setFiltereUnAssignedUserProfileRightList([]);
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

  const resetUnAssignedUserProfileRightList = (result, updateAssignedUserProfileRightList) => {
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
        const filteredAssignedList = filteredUnassignedUserProfileRightList.reduce((assignedList, data) => {
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
        updateAssignedUserProfileRightList(filteredAssignedList);
      }

      let updatedUnAssignedList = unAssignedUserProfileRightList.filter(function (value) {
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
      setUnassignedUserProfileRightList([]);
      setFiltereUnAssignedUserProfileRightList([]);
      setUnassignedUserProfileRightList(updatedUnAssignedList);
      setFiltereUnAssignedUserProfileRightList(updatedUnAssignedList);
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

  const [searchTextUnAssigendUserProfileRight, setSearchTextUnAssigendUserProfileRight] = useState("");
  const onSearchUnAssignedUserProfileRight = (val) => {
    debugger;
    setSearchTextUnAssigendUserProfileRight(val);
    gridApiUnAssign.setQuickFilter(val);
    gridApiUnAssign.refreshCells();
  };

  const updateUnAssignedUserProfileRightList = (newlyAddedUser) => {
    debugger;

    if (newlyAddedUser && newlyAddedUser.length > 0) {
      newlyAddedUser.forEach((data) => {
        if (!unAssignedUserProfileRightList.some((x) => x.AccessID.toString() === data.AccessID.toString())) {
          unAssignedUserProfileRightList.unshift(data);
        }
      });
    }
    setUnassignedUserProfileRightList([]);
    setUnassignedUserProfileRightList(unAssignedUserProfileRightList);
    setFiltereUnAssignedUserProfileRightList([]);
    setFiltereUnAssignedUserProfileRightList(unAssignedUserProfileRightList);

    if (gridApiUnAssign) {
      gridApiUnAssign.setRowData(unAssignedUserProfileRightList);
    }
  };

  useEffect(() => {
    debugger;
    if (deletedAssignedRow) {
      updateUnAssignedUserProfileRightList(deletedAssignedRow);
    }
  }, [deletedAssignedRow]);

  const getSelectedRowData = () => {
    const selectedNodes = gridApiUnAssign.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async (e, updateAssignedUserProfileRightList) => {
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
      const result = await manageUserProfileRightAssign(formdata);
      console.log(result, "result");
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        console.log(result.response.responseData);
        resetUnAssignedUserProfileRightList(result, updateAssignedUserProfileRightList);
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
    unAssignedUserProfileRightList,
    filteredUnassignedUserProfileRightList,
    isLoadingUnassignedUserProfileRightList,
    getUnAssignedUserProfileRightListData,
    formValues,
    updateState,
    userProfileTypeList,
    btnLoaderActive,
    handleSave,
    onGridReadyUnAssign,
    setSelectedRowData,
    searchTextUnAssigendUserProfileRight,
    onSearchUnAssignedUserProfileRight,
    setDeletedAssignedRow,
  };
}

export default UnAssignedUserProfileRightListModalLogic;
