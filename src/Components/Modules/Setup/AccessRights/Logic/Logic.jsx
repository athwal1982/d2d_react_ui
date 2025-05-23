import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect, useState } from "react";
import { getRightsListData } from "../Services/Methods";

function AccessRightsLogics() {
  const [rightsDataList, setRightsDataList] = useState(false);
  const [filteredRightsDataList, setFilteredRightsDataList] = useState([]);
  const [isLoadingRightsData, setIsLoadingRightsData] = useState(false);
  const setAlertMessage = AlertMessage();

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const [userRightsItemSearch, setUserRightsItemSearch] = useState("");
  const onChangeRightsList = (val) => {
    setUserRightsItemSearch(val);
    gridApi.setQuickFilter(val);
  };

  const getRightsData = async () => {
    try {
      setIsLoadingRightsData(true);
      const result = await getRightsListData();
      console.log(result);
      setIsLoadingRightsData(false);
      if (result.responseCode === 1) {
        if (result.responseData && result.responseData.RightMaster) {
          if (userRightsItemSearch && userRightsItemSearch.toLowerCase().includes("#")) {
            onChangeRightsList("");
          }
          setRightsDataList(result.responseData.RightMaster);
          setFilteredRightsDataList(result.responseData.RightMaster);
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

  const updateRightsData = (newlyAddedRight) => {
    if (gridApi) {
      const rowData = [];
      if (newlyAddedRight && newlyAddedRight.length > 0) {
        newlyAddedRight.forEach((data) => {
          rowData.push(data);
        });
      }
      gridApi.forEachNode((node) => rowData.push(node.data));
      gridApi.setRowData(rowData);
    }
  };

  const getRightsList = () => {
    if (userRightsItemSearch && userRightsItemSearch.length >= 3) {
      getRightsData();
    } else {
      setAlertMessage({
        type: "error",
        message: "Please type at least 3 character.",
      });
    }
  };

  useEffect(() => {
    getRightsData();
  }, []);

  return {
    rightsDataList,
    filteredRightsDataList,
    isLoadingRightsData,
    updateRightsData,
    onGridReady,
    onChangeRightsList,
    getRightsList,
    userRightsItemSearch,
  };
}
export default AccessRightsLogics;
