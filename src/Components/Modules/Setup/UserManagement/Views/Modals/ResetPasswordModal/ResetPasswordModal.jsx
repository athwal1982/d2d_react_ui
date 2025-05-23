import { React, useState } from "react";
import { Form, Modal } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { FaInfoCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import BizClass from "../../UserManagement.module.scss";
import ResetPasswordLogics from "./Logic/Logic";

function ResetPasswordModal({ showfunc, selectedUserData }) {
  const { btnLoaderActive, formValues, formValidationError, updateState, handleSave } = ResetPasswordLogics();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [applyDivcss, setapplyDivcss] = useState("");

  const handleIconHoverOldPass = () => {
    setPopupVisible(true);
    setapplyDivcss("3");
  };

  const handleIconUnhoverOldPass = () => {
    setPopupVisible(false);
    setapplyDivcss("");
  };
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
        <div
          className={
            applyDivcss === "1"
              ? BizClass.PasswordPolicyDiv
              : applyDivcss === "2"
              ? BizClass.PasswordPolicyOtherDiv
              : applyDivcss === "3"
              ? BizClass.PasswordPolicyOldDiv
              : ""
          }
        >
          <h1 style={{ fontSize: "18px", textDecoration: "underline", paddingBottom: "8px" }}>Password Policy</h1>
          <p>1. The length of password should be minimum 8 characters or maximum 16 characters.</p>
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
      <Modal varient="center" title="Reset Password" show={showfunc} right="0" onSubmit={(e) => handleSave(e, showfunc, selectedUserData)}>
        <Modal.Body>
          <Form>
            <Form.Group controlwidth="280px">
              <Form.InputGroup label="Old Password" errorMsg={formValidationError["txtOldPassword"]}>
                <Form.InputControl
                  control="input"
                  type="password"
                  autoComplete="off"
                  value={formValues.txtOldPassword}
                  name="txtOldPassword"
                  req="true"
                  onChange={(e) => updateState("txtOldPassword", e.target.value)}
                />
                <FaInfoCircle onMouseOver={() => handleIconHoverOldPass()} onMouseOut={() => handleIconUnhoverOldPass()} />
              </Form.InputGroup>
              <Form.InputGroup label="New Password" errorMsg={formValidationError["txtNewPassword"]}>
                <Form.InputControl
                  control="input"
                  type="password"
                  autoComplete="off"
                  value={formValues.txtNewPassword}
                  name="txtNewPassword"
                  req="true"
                  onChange={(e) => updateState("txtNewPassword", e.target.value)}
                />
                <FaInfoCircle onMouseOver={() => handleIconHoverNewPass()} onMouseOut={() => handleIconUnhoverNewPass()} />
              </Form.InputGroup>
              <Form.InputGroup label="Confirm Password" errorMsg={formValidationError["txtConfirmPassword"]}>
                <Form.InputControl
                  control="input"
                  type="password"
                  autoComplete="off"
                  value={formValues.txtConfirmPassword}
                  name="txtConfirmPassword"
                  req="true"
                  onChange={(e) => updateState("txtConfirmPassword", e.target.value)}
                />
                <FaInfoCircle onMouseOver={() => handleIconHoverConfirmPass()} onMouseOut={() => handleIconUnhoverConfirmPass()} />
              </Form.InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" varient="secondary" trigger={btnLoaderActive}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ResetPasswordModal;

ResetPasswordModal.propTypes = {
  showfunc: PropTypes.func.isRequired,
  selectedUserData: PropTypes.object,
};
