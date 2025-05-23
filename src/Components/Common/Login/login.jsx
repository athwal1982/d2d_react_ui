import React, { useState } from "react";
import { Loader } from "Framework/Components/Widgets";
import { RiUser3Fill } from "react-icons/ri";
import { AiTwotoneLock } from "react-icons/ai";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import classNames from "classnames";
import { MdOutlineRefresh } from "react-icons/md";
import BizClass from "./login.module.scss";
import AddLoginLogics from "./Logic/Logic";
import ForgotPasswordModal from "./ForgotPasswordModal/ForgotPassword";

function Login() {
  const {
    formValues,
    updateState,
    handleLogin,
    SearchByHandleKeyDown,
    showHideLogin,
    isLoadingPage,
    captchaCode,
    createCaptcha,
    forgotPasswordModal,
    selectedUserData,
    toggleForgotPasswordModal,
    btnLoaderActive,
  } = AddLoginLogics();
  const [revealPassword, setRevealPassword] = useState(false);

  const togglePassword = () => {
    setRevealPassword(!revealPassword);
  };

  return showHideLogin === true ? (
    <>
      {forgotPasswordModal ? <ForgotPasswordModal showfunc={toggleForgotPasswordModal} selectedUserData={selectedUserData} /> : null}
      <div className={BizClass.Box}>
        <div className={BizClass.CenterBox}>
          <div className={BizClass.MainBox}>
            <div className={BizClass.BannerBox}>
              <img src={`${process.env.PUBLIC_URL}logo.png`} alt="Logo" />
            </div>
            <div className={BizClass.Separator} />
            <div className={BizClass.ContentBox}>
              <div className={BizClass.ClientLogo}>
                <div className={BizClass.ClientText}>
                  <p>DOOR STEP DELIVERY</p>
                </div>
              </div>
              <form className={BizClass.SubBox}>
                <h3>Welcome</h3>
                <p>Please Log in to your Account</p>
                <div className={BizClass.InputBox}>
                  <div className={BizClass.InputGroup}>
                    <label>UserName</label>
                    <RiUser3Fill className={BizClass.BoxIcon} />
                    <input
                      type="text"
                      name="txtLoginId"
                      maxLength="10"
                      value={formValues.txtLoginId}
                      onChange={(e) => updateState(e.target.name, e.target.value)}
                      placeholder="Login ID"
                      autoComplete="off"
                    />
                  </div>
                  <div className={BizClass.InputGroup}>
                    <label>Password</label>
                    <AiTwotoneLock className={BizClass.BoxIcon} />
                    <input
                      type={revealPassword ? "text" : "password"}
                      name="txtPassword"
                      value={formValues.txtPassword}
                      onKeyDown={(e) => SearchByHandleKeyDown(e)}
                      onChange={(e) => updateState(e.target.name, e.target.value)}
                      placeholder="6+ strong character"
                      autoComplete="off"
                    />
                    {revealPassword ? (
                      <VscEyeClosed className={BizClass.PassBoxIconClosed} onClick={() => togglePassword()} />
                    ) : (
                      <VscEye className={BizClass.PassBoxIcon} onClick={() => togglePassword()} />
                    )}
                  </div>
                  <div className={BizClass.captchaCss}>
                    <div id="captcha" />
                    <label />
                    <MdOutlineRefresh className={BizClass.RefreshCaptchaBoxIcon} onClick={() => createCaptcha()} />
                  </div>
                  <div className={BizClass.captchaInput}>
                    <input
                      type="text"
                      name="txtCaptchaVal"
                      maxLength="10"
                      value={formValues.txtCaptchaVal}
                      onChange={(e) => updateState(e.target.name, e.target.value)}
                      placeholder="Enter The Captcha"
                      autoComplete="off"
                    />
                  </div>
                  {/* <button type="button" onClick={() => handleLogin(captchaCode)}>
                    Login
                  </button> */}
                  <button
                    type="button"
                    className={classNames(BizClass.ButtonWithLoader, btnLoaderActive ? BizClass.loading : null)}
                    onClick={() => handleLogin(captchaCode)}
                  >
                    Login
                    <span className={BizClass.ButtonLoader} />
                  </button>
                  <span aria-hidden="true" className={BizClass.forgotpassCss} onClick={() => toggleForgotPasswordModal()}>
                    {" "}
                    Forgot Your Passord ?
                  </span>
                </div>
              </form>
            </div>
          </div>
          <div className={BizClass.FooterBox}>
            <h4>© 2024 Door Step Delivery. All rights reserved.</h4>
          </div>
        </div>
      </div>
    </>
  ) : isLoadingPage ? (
    <Loader />
  ) : null;
}

export default Login;
