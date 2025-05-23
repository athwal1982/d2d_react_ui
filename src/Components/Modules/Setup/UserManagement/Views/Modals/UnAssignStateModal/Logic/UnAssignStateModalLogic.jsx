import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { GetUserStateAssignManage } from "../../AssignStateListModal/Service/Methods";

function UnAssignStateListModalLogic() {
  const setAlertMessage = AlertMessage();
  const [unAssignStateList, setUnAssignStateList] = useState([]);
  const [isLoadingUnAssignStateList, setIsLoadingUnAssignStateList] = useState(false);
  const [gridApiUnAssign, setGridApiUnAssign] = useState();
  const [searchTextUnAssigendState, setSearchTextUnAssigendState] = useState("");
  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();

  const onGridReadyUnAssign = (params) => {
    setGridApiUnAssign(params.api);
  };

  const onSearchUnAssignedState = (val) => {
    setSearchTextUnAssigendState(val);
    gridApiUnAssign.setQuickFilter(val);
    gridApiUnAssign.refreshCells();
  };

  const getUnAssignedStateListData = async (data) => {
    try {
      setUnAssignStateList([]);
      setIsLoadingUnAssignStateList(true);

      const formdata = {
        viewMode: "GETUNASSIGNED",
        userStateID: "",
        appAccessID: data && data.AppAccessID ? data.AppAccessID : 0,
        stateMasterID: "0",
      };
      const result = await GetUserStateAssignManage(formdata);
      console.log(result);
      setIsLoadingUnAssignStateList(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.UserStateAssignManage) {
          const mappedData = result.responseData.UserStateAssignManage.map((data) => {
            return { ...data, IsChecked: false };
          });
          setUnAssignStateList(mappedData);
        } else {
          setUnAssignStateList([]);
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

  const getSelectedRowData = () => {
    const selectedNodes = gridApiUnAssign.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  const resetUnAssignedStateList = (result, updateAssignedStateList) => {
    console.log(result);
    debugger;
    if (result.responseData) {
      const responseAssignedIds = result.responseData.UserStateID ? result.responseData.UserStateID.split(",") : [];
      console.log(responseAssignedIds);

      let assignedIds = [];
      if (responseAssignedIds.length > 0) {
        assignedIds = responseAssignedIds.reduce((assignmentIdList, data) => {
          const splitData = data.split("|");
          if (splitData.length > 0 && splitData[0] && splitData[1]) {
            assignmentIdList.push({
              StateMasterID: splitData[0],
              userStateID: splitData[1],
            });
          }
          return assignmentIdList;
        }, []);
      }

      if (assignedIds.length > 0) {
        console.log(assignedIds, "assignedIds");
        const filteredAssignedList = unAssignStateList.reduce((assignedList, data) => {
          const resultData = assignedIds.find((x) => x.StateMasterID.toString() === data.StateMasterID.toString());

          if (resultData) {
            assignedList.push({
              StateMasterID: data.StateMasterID,
              StateMasterName: data.StateMasterName,
              IsNewlyAdded: true,
            });
          }
          return assignedList;
        }, []);

        updateAssignedStateList(filteredAssignedList);
      }

      let updatedUnAssignedList = unAssignStateList.filter(function (value) {
        return assignedIds.length === 0 || !assignedIds.some((x) => x.StateMasterID.toString() === value.StateMasterID.toString());
      });
      const unAssignedIds = result.responseData.userStateID ? result.responseData.userStateID.split(",") : [];
      if (unAssignedIds.length > 0) {
        updatedUnAssignedList = updatedUnAssignedList.map((data) => {
          if (unAssignedIds.includes(data.StateMasterID.toString())) {
            data.FailedAssigned = true;
            data.IsChecked = false;
          }
          return { ...data };
        });
      }
      setUnAssignStateList([]);

      setUnAssignStateList(updatedUnAssignedList);

      if (assignedIds.length > 0)
        setAlertMessage({
          type: "success",
          message: result.responseMessage,
        });
      else if (unAssignedIds.length > 0)
        setAlertMessage({
          type: "success",
          message: "Already Assigned",
        });
    } else {
      setAlertMessage({
        type: "success",
        message: result.responseMessage,
      });
    }
  };

  const handleSave = async (e, updateAssignedStateList) => {
    try {
      console.log(selectedRowData, "selectedRowData");
      if (e) e.preventDefault();
      const checkedItem = getSelectedRowData();

      if (checkedItem.length === 0) {
        setAlertMessage({
          type: "error",
          message: "Please select atleast one state.",
        });
        return;
      }
      const accessIds = checkedItem
        .map((data) => {
          return data.StateMasterID;
        })
        .join(",");
      setBtnLoaderActive(true);

      const formdata = {
        viewMode: "ASSIGN",
        userStateID: "",
        appAccessID: selectedRowData && selectedRowData.AppAccessID ? selectedRowData.AppAccessID : 0,
        stateMasterID: accessIds,
      };

      const result = await GetUserStateAssignManage(formdata);
      console.log(result, "result");
      setBtnLoaderActive(false);
      if (result.responseCode === 1) {
        console.log(result.responseData);
        resetUnAssignedStateList(result, updateAssignedStateList);
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
    getUnAssignedStateListData,
    unAssignStateList,
    isLoadingUnAssignStateList,
    onGridReadyUnAssign,
    searchTextUnAssigendState,
    onSearchUnAssignedState,
    handleSave,
    btnLoaderActive,
    setSelectedRowData,
  };
}

export default UnAssignStateListModalLogic;
