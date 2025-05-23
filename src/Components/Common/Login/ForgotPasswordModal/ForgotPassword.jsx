import { React, useState } from "react";
import { Loader } from "Framework/Components/Widgets";
import { Modal } from "Framework/Components/Layout";
import { RiUser3Fill } from "react-icons/ri";
import { AiTwotoneLock } from "react-icons/ai";
import { MdOutlineRefresh, MdOutlineVerified } from "react-icons/md";
import { GrDocumentLocked } from "react-icons/gr";
import { FaKey, FaInfoCircle } from "react-icons/fa";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { TiTick } from "react-icons/ti";
import PropTypes from "prop-types";
import classNames from "classnames";
import BizClass from "./ForgotPassword.module.scss";
import ForgotPasswordLogics from "./Logic/Logic";

function ForgotPasswordModal({ showfunc }) {
  const {
    formValues,
    updateState,
    validationFormError,
    inputState,
    btnLoaderActive,
    handleSubmit,
    resendOTPForGotPassword,
    captchaCodeforgot,
    createCaptchaforgot,
    isLoadingPage,
  } = ForgotPasswordLogics();
  const [revealNewPassword, setRevealNewPassword] = useState(false);
  const toggleNewPassword = () => {
    setRevealNewPassword(!revealNewPassword);
  };

  const [revealConfirmPassword, setRevealConfirmPassword] = useState(false);
  const toggleConfirmPassword = () => {
    setRevealConfirmPassword(!revealConfirmPassword);
  };

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [applyDivcss, setapplyDivcss] = useState("");

  const handleIconHoverNewPass = () => {
    setPopupVisible(true);
    setapplyDivcss("1");
  };

  const handleIconUnhoverNewPass = () => {
    setPopupVisible(false);
    setapplyDivcss("");
  };

  const handleIconHoverConfirmPass = () => {
    setPopupVisible(true);
    setapplyDivcss("2");
  };

  const handleIconUnhoverConfirmPass = () => {
    setPopupVisible(false);
    setapplyDivcss("");
  };
  return (
    <>
      {isPopupVisible && (
        <div className={applyDivcss === "1" ? BizClass.PasswordPolicyDiv : applyDivcss === "2" ? BizClass.PasswordPolicyOtherDiv : ""}>
          <h1 style={{ fontSize: "18px", textDecoration: "underline", paddingBottom: "8px" }}>Password Policy</h1>
          <p>1. The length of password should be of exact 8 characters.</p>
          <p style={{ paddingBottom: "5px" }}>
            2. The password shall be case sensitive and should contain at least one each of the following characters with no space:
            <br />
          </p>
          <p style={{ paddingLeft: "10px" }}>
            1. Uppercase: A to Z
            <br />
            2. Lowercase: a to z
            <br />
            3. Digit: 0 to 9
            <br />
            4. Non-Alphanumeric: Special characters @ # $ % & * / \
          </p>
        </div>
      )}
      <Modal varient="center" show={showfunc} right="0" width="35vw" height="75vh">
        <Modal.Body>
          {isLoadingPage ? <Loader /> : null}
          <div className={BizClass.InputBox}>
            <div className={BizClass.ForgotCenterCss}>
              {inputState === "UN" ? (
                <>
                  <AiTwotoneLock className={BizClass.ForgotBoxIcon} /> <br />{" "}
                </>
              ) : inputState === "VR" ? (
                <>
                  <MdOutlineVerified className={BizClass.ForgotBoxIcon} /> <br />{" "}
                </>
              ) : inputState === "RP" ? (
                <>
                  <GrDocumentLocked className={BizClass.ForgotBoxIcon} /> <br />{" "}
                </>
              ) : inputState === "RPS" ? (
                <>
                  <TiTick className={BizClass.ForgotBoxIcon} /> <br />{" "}
                </>
              ) : null}
              <span>
                {inputState === "UN"
                  ? "Forgot Your Password"
                  : inputState === "VR"
                  ? "Verification Required"
                  : inputState === "RP"
                  ? "Create New Password"
                  : inputState === "RPS"
                  ? "Password Changed"
                  : null}
              </span>{" "}
              <br />
              <p>
                {" "}
                {inputState === "UN"
                  ? "Enter your user name and we will send 6 digit OTP on your registered mobile number to reset your password."
                  : inputState === "VR"
                  ? "Please enter the 6 digit OTP sent on your registered mobile number to complete the verifcation."
                  : inputState === "RPS"
                  ? "Your Password has been changed successfully, now you can log in with new created password."
                  : null}
              </p>
            </div>
            <div className={BizClass.InputGroup}>
              {inputState === "UN" ? (
                <>
                  <div className={BizClass.LabelBox}>
                    <label>UserName</label>
                  </div>
                  <div className={classNames(BizClass.InputGroupBox, validationFormError["txtUsername"] ? BizClass.InputGroupBoxError : null)}>
                    <div className={BizClass.SubInputGroup}>
                      <RiUser3Fill className={BizClass.BoxIcon} />
                      <input
                        type="text"
                        name="txtUsername"
                        value={formValues.txtUsername}
                        onChange={(e) => updateState(e.target.name, e.target.value)}
                        placeholder="User Name"
                        autoComplete="off"
                      />
                    </div>
                    <span>{validationFormError["txtUsername"]}</span>
                  </div>
                  <div className={BizClass.captchaCss}>
                    <div id="captchaforgot" />
                    <label />
                    <MdOutlineRefresh className={BizClass.RefreshCaptchaBoxIcon} onClick={() => createCaptchaforgot()} />
                  </div>
                  <div className={BizClass.captchaInput}>
                    <input
                      type="text"
                      name="txtCaptchaValForgotPass"
                      maxLength="10"
                      value={formValues.txtCaptchaValForgotPass}
                      onChange={(e) => updateState(e.target.name, e.target.value)}
                      placeholder="Enter The Captcha"
                      autoComplete="off"
                    />
                  </div>
                  <span className={BizClass.captchaErrorTextCss}>{validationFormError["txtCaptchaValForgotPass"]}</span>
                </>
              ) : null}
              {inputState === "VR" ? (
                <>
                  <div className={BizClass.LabelBox}>
                    <label>OTP</label>
                    <p aria-hidden="true" onClick={() => resendOTPForGotPassword()}>
                      Resend OTP
                    </p>
                  </div>
                  <div className={BizClass.InputGroupBox}>
                    <div className={BizClass.SubInputGroup}>
                      <FaKey className={BizClass.BoxIcon} />
                      <input
                        type="text"
                        name="txtOTP"
                        value={formValues.txtOTP}
                        onChange={(e) => updateState(e.target.name, e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter OTP"
                        autoComplete="off"
                        maxLength={6}
                      />
                    </div>
                    <span>{validationFormError["txtOTP"]}</span>
                  </div>
                </>
              ) : null}
              {inputState === "RP" ? (
                <>
                  <div className={BizClass.LabelBox}>
                    <label>New Password</label>
                    <p>
                      <FaInfoCircle onMouseOver={() => handleIconHoverNewPass()} onMouseOut={() => handleIconUnhoverNewPass()} />
                    </p>
                  </div>
                  <div className={BizClass.InputGroupBox}>
                    <div className={BizClass.SubInputGroup}>
                      <AiTwotoneLock className={BizClass.BoxIcon} />
                      <input
                        type={revealNewPassword ? "text" : "password"}
                        name="txtNewPassword"
                        value={formValues.txtNewPassword}
                        onChange={(e) => updateState(e.target.name, e.target.value)}
                        placeholder="Enter New Password"
                        autoComplete="off"
                      />
                      {revealNewPassword ? (
                        <VscEyeClosed className={BizClass.PassBoxIconClosed} onClick={() => toggleNewPassword()} />
                      ) : (
                        <VscEye className={BizClass.PassBoxIcon} onClick={() => toggleNewPassword()} />
                      )}
                    </div>
                    <span>{validationFormError["txtNewPassword"]}</span>
                  </div>
                  <div className={BizClass.LabelBox}>
                    <label>Confirm Password</label>
                    <p>
                      <FaInfoCircle onMouseOver={() => handleIconHoverConfirmPass()} onMouseOut={() => handleIconUnhoverConfirmPass()} />
                    </p>
                  </div>
                  <div className={BizClass.InputGroupBox}>
                    <div className={BizClass.SubInputGroup}>
                      <AiTwotoneLock className={BizClass.BoxIcon} />
                      <input
                        type={revealConfirmPassword ? "text" : "password"}
                        name="txtConfirmPassword"
                        value={formValues.txtConfirmPassword}
                        onChange={(e) => updateState(e.target.name, e.target.value)}
                        placeholder="Enter Confirm Password"
                        autoComplete="off"
                      />
                      {revealConfirmPassword ? (
                        <VscEyeClosed className={BizClass.PassBoxIconClosed} onClick={() => toggleConfirmPassword()} />
                      ) : (
                        <VscEye className={BizClass.PassBoxIcon} onClick={() => toggleConfirmPassword()} />
                      )}
                    </div>
                    <span>{validationFormError["txtConfirmPassword"]}</span>
                  </div>
                </>
              ) : null}
            </div>
            {inputState !== "RPS" ? (
              <button
                type="button"
                className={classNames(BizClass.ButtonWithLoader, btnLoaderActive ? BizClass.loading : null)}
                onClick={() => handleSubmit(captchaCodeforgot)}
              >
                <span className={BizClass.ButtonText}>Submit</span>
                <span className={BizClass.ButtonLoader} />
              </button>
            ) : null}
          </div>

          <br />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ForgotPasswordModal;

ForgotPasswordModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
};
