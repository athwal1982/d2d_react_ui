import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState } from "react";
import { getUserProfileListData, manageUserProfileAssign } from "../../../../../ProfileManagement/Services/Methods";

function ProfileListModalLogic() {
  const [profileList, setProfileList] = useState([]);
  const [isLoadingProfileList, setIsLoadingProfileList] = useState(false);
  const [filteredProfileList, setFilteredprofileList] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});

  const setAlertMessage = AlertMessage();

  const [profileGridApi, setProfileGridApi] = useState();
  const onProfilerGridReady = (params) => {
    setProfileGridApi(params.api);
  };

  const [searchTextProfile, setSearchTextProfile] = useState("");
  const onSearchProfile = (val) => {
    setSearchTextProfile(val);
    profileGridApi.setQuickFilter(val);
    profileGridApi.refreshCells();
  };

  const getProfileListData = async (pselectedUserData) => {
    try {
      setProfileList([]);
      setFilteredprofileList([]);
      setIsLoadingProfileList(true);
      const formdata = {
        userProfileID: "0",
        viewMode: "Select",
        searchText: "#ALL",
        brHeadTypeID: pselectedUserData && pselectedUserData.BRHeadTypeID ? pselectedUserData.BRHeadTypeID.toString() : "0",
      };
      const result = await getUserProfileListData(formdata);
      setIsLoadingProfileList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.UserProfileMaster) {
          setProfileList(result.response.responseData.UserProfileMaster);
          setFilteredprofileList(result.response.responseData.UserProfileMaster);
        } else {
          setProfileList([]);
          setFilteredprofileList([]);
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

  const getSelectedRowData = () => {
    const selectedNodes = profileGridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    return selectedData;
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async (e, showfunc, updateUserDataList) => {
    try {
      if (e) e.preventDefault();
      const checkedItem = getSelectedRowData();
      if (checkedItem.length === 0) {
        setAlertMessage({
          type: "warning",
          message: "Please select atleast one profile.",
        });
        return;
      }
      if (checkedItem.length > 1) {
        setAlertMessage({
          type: "warning",
          message: "Please select only one profile.",
        });
        return;
      }
      const userProfileIds = checkedItem
        .map((data) => {
          return data.UserProfileID;
        })
        .join(",");

      const userProfileName = checkedItem
        .map((data) => {
          return data.ProfileName;
        })
        .join(",");
      setBtnLoaderActive(true);

      const formdata = {
        action: "ASSIGN",
        profileAssignID: "0",
        userProfileID: userProfileIds.toString(),
        accessID: selectedUser.AppAccessID.toString(),
        userProfileType: "D",
      };

      const result = await manageUserProfileAssign(formdata);

      console.log(result, "result");
      setBtnLoaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        const updatedRow = {
          AppAccessID: selectedUser.AppAccessID,
          UserDisplayName: selectedUser.UserDisplayName,
          CompanyName: selectedUser.CompanyName,
          AppAccessUserName: selectedUser.AppAccessUserName,
          UserCompanyType: selectedUser.UserCompanyType,
          UserMobileNumber: selectedUser.UserMobileNumber,
          EmailAddress: selectedUser.EmailAddress,
          AssignmentFlag: selectedUser.AssignmentFlag,
          UserType: selectedUser.UserType,
          ProfileName: userProfileName,
          ActiveStatus: selectedUser.ActiveStatus,
        };

        updateUserDataList(updatedRow);
        showfunc();
      } else {
        setAlertMessage({
          type: "warning",
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
    profileList,
    filteredProfileList,
    isLoadingProfileList,
    getProfileListData,
    searchTextProfile,
    onProfilerGridReady,
    onSearchProfile,
    setSelectedUser,
    handleSave,
    btnLoaderActive,
  };
}

export default ProfileListModalLogic;
