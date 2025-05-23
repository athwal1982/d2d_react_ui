import { React, useState } from "react";
import { RiPagesLine, RiLockPasswordLine } from "react-icons/ri";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import PropTypes from "prop-types";
import BizClass from "./Header.module.scss";
import ResetPasswordModal from "../../Modules/Setup/UserManagement/Views/Modals/ResetPasswordModal/ResetPasswordModal";

function Header({ pagetitle }) {
  const userData = getSessionStorage("user");
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState({});
  const toggleResetPasswordModal = () => {
    setResetPasswordModal(!resetPasswordModal);
    setSelectedUserData({ AppAccessID: userData.LoginID });
  };

  return (
    <>
      {resetPasswordModal ? <ResetPasswordModal showfunc={toggleResetPasswordModal} selectedUserData={selectedUserData} /> : null}
      <div className={BizClass.Box}>
        <div className={BizClass.PageTitle}>
          {pagetitle && pagetitle === "Dashboard" ? (
            <>
              <RiPagesLine />
              <p>Door Step Delivery</p>
            </>
          ) : (
            <>
              <RiPagesLine />
              <p>{pagetitle}</p>
            </>
          )}
        </div>
        <div className={BizClass.SubBoxDiv}>
          {pagetitle && pagetitle === "Dashboard" ? (
            <div className={BizClass.UserInfo}>
              <p>
                {userData && userData.CompanyName ? userData.CompanyName : ""} : {userData && userData.UserDisplayName ? userData.UserDisplayName : ""}
                &nbsp; <RiLockPasswordLine title="Change Password" style={{ cursor: "pointer" }} onClick={() => toggleResetPasswordModal()} />
              </p>
            </div>
          ) : null}
          <div className={BizClass.TicketTabBox} id="BizHeaderPortal" />
        </div>
      </div>
      {userData && userData.ActivationDays >= 40 && userData.ActivationDays <= 45 ? (
        <div className={BizClass.popup}>Your password is going to expire, please reset the password.</div>
      ) : null}
    </>
  );
}

Header.propTypes = {
  pagetitle: PropTypes.string.isRequired,
};

export default Header;
