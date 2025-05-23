import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState, useEffect } from "react";
import { manageUserRightAssign } from "../../../../Services/Methods";

function UnAssignUsersPopUpLogic() {
  const [unAssignedUserList, setUnassignedUserList] = useState([]);
  const [isLoadingUnassignedUserList, setIsLoadingUnassignedUserList] = useState(false);
  const [filteredUnassignedUserList, setFiltereUnAssignedUserList] = useState([]);

  const [selectedRowData, setSelectedRowData] = useState();
  const [deletedAssignedRow, setDeletedAssignedRow] = useState();

  const [gridApiUnAssign, setGridApiUnAssign] = useState();
  const onGridReadyUnAssign = (params) => {
    setGridApiUnAssign(params.api);
  };

  const [searchTextUnAssigendUser, setSearchTextUnAssigendUser] = useState("");
  const onSearchUnAssignedUser = (val) => {
    setSearchTextUnAssigendUser(val);
    gridApiUnAssign.setQuickFilter(val);
    gridApiUnAssign.refreshCells();
  };
  const setAlertMessage = AlertMessage();

  const getUnAssignUserList = async (data) => {
    try {
      setUnassignedUserList([]);
      setFiltereUnAssignedUserList([]);
      setIsLoadingUnassignedUserList(true);
      const formdata = {
        rightsAssignID: "0",
        accessID: "0",
        rightMasterID: data && data.RightMasterID ? data.RightMasterID.toString() : "0",
        viewMode: "GETUNASSIGNED",
      };
      const result = await manageUserRightAssign(formdata);
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
      const responseAssignedIds = result.response.responseData.RightsAssignID ? result.response.responseData.RightsAssignID.split(",") : [];
      console.log(responseAssignedIds);

      let assignedIds = [];
      if (responseAssignedIds.length > 0) {
        assignedIds = responseAssignedIds.reduce((assignmentIdList, data) => {
          const splitData = data.split("|");
          if (splitData.length > 0 && splitData[0] && splitData[1]) {
            assignmentIdList.push({
              AccessID: splitData[0],
              RightsAssignID: splitData[1],
            });
          }
          return assignmentIdList;
        }, []);
      }
      if (assignedIds.length > 0) {
        const filteredAssignedList = filteredUnassignedUserList.reduce((assignedList, data) => {
          console.log(data);
          const resultData = assignedIds.find((x) => x.AccessID.toString() === data.AppAccessID.toString());
          console.log(resultData);
          if (resultData) {
            assignedList.push({
              RightsAssignID: resultData.RightsAssignID,
              AccessID: data.AppAccessID,
              UserDisplayName: data.UserDisplayName,
              AppAccessUserName: data.AppAccessUserName,
              RightMasterID: selectedRowData && selectedRowData.RightMasterID ? selectedRowData.RightMasterID.toString() : "0",
              IsNewlyAdded: true,
            });
          }
          return assignedList;
        }, []);
        updateAssignedUserList(filteredAssignedList);
      }

      let updatedUnAssignedList = unAssignedUserList.filter(function (value) {
        return assignedIds.length === 0 || !assignedIds.some((x) => x.AccessID.toString() === value.AppAccessID.toString());
      });
      const unAssignedIds = result.response.responseData.RightsAssignID ? result.response.responseData.RightsAssignID.split(",") : [];
      if (unAssignedIds.length > 0) {
        updatedUnAssignedList = updatedUnAssignedList.map((data) => {
          if (unAssignedIds.includes(data.AppAccessID.toString())) {
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

  const updateUnAssignedUserList = (newlyAddedUser) => {
    debugger;
    if (gridApiUnAssign) {
      const rowData = [];
      if (newlyAddedUser && newlyAddedUser.length > 0) {
        newlyAddedUser.forEach((data) => {
          rowData.push(data);
        });
      }
      gridApiUnAssign.forEachNode((node) => rowData.push(node.data));
      gridApiUnAssign.setRowData(rowData);
    }
  };

  useEffect(() => {
    debugger;
    if (deletedAssignedRow) {
      console.log(deletedAssignedRow, "deletedAssignedRow");
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
      console.log(checkedItem, "checkItem");
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
        rightsAssignID: "0",
        rightMasterID: selectedRowData && selectedRowData.RightMasterID ? selectedRowData.RightMasterID.toString() : "0",
        accessID: accessIds,
        viewMode: "ASSIGN",
      };

      const result = await manageUserRightAssign(formdata);
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
    getUnAssignUserList,
    onGridReadyUnAssign,
    searchTextUnAssigendUser,
    onSearchUnAssignedUser,
    btnLoaderActive,
    handleSave,
    setSelectedRowData,
    setDeletedAssignedRow,
  };
}

export default UnAssignUsersPopUpLogic;
