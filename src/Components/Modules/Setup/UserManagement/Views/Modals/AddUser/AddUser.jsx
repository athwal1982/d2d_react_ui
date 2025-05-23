import { React, useState } from "react";
import { Form, Modal } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import { FaInfoCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import BizClass from "./AddUser.module.scss";
import AddUserLogics from "./Logic/Logics";

function AddUser({ showfunc, updateUserData }) {
  const { formValues, updateState, handleSave, btnLoaderActive, formValidationError, userType, isLoadingUserType } = AddUserLogics();

  const [isPopupVisible, setPopupVisible] = useState(false);
  const handleIconHoverPass = () => {
    setPopupVisible(true);
  };

  const handleIconUnhoverPass = () => {
    setPopupVisible(false);
  };

  return (
    <>
      {isPopupVisible && (
        <div className={BizClass.PasswordPolicyDiv}>
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
      <Modal onSubmit={(e) => handleSave(e, updateUserData)} varient="center" title="Add User" show={showfunc} right="0">
        <Modal.Body>
          <Form>
            <Form.Group column={2} controlwidth="280px">
              <Form.InputGroup label="Display Name" errorMsg={formValidationError["txtDisplayName"]} req="true">
                <Form.InputControl
                  control="input"
                  type="text"
                  maxLength="20"
                  autoComplete="off"
                  value={formValues.txtDisplayName}
                  name="txtDisplayName"
                  onChange={(e) => updateState("txtDisplayName", e.target.value)}
                />
              </Form.InputGroup>
              <Form.InputGroup label="Login Name" errorMsg={formValidationError["txtLoginName"]} req="true">
                <Form.InputControl
                  control="input"
                  type="text"
                  maxLength="10"
                  autoComplete="off"
                  value={formValues.txtLoginName}
                  name="txtLoginName"
                  onChange={(e) => updateState("txtLoginName", e.target.value)}
                />
              </Form.InputGroup>
              <Form.InputGroup label="Password" errorMsg={formValidationError["txtPassword"]} req="true">
                <Form.InputControl
                  control="input"
                  type="password"
                  autoComplete="new-password"
                  value={formValues.txtPassword}
                  name="txtPassword"
                  onChange={(e) => updateState("txtPassword", e.target.value)}
                />
                <FaInfoCircle onMouseOver={() => handleIconHoverPass()} onMouseOut={() => handleIconUnhoverPass()} />
              </Form.InputGroup>
              <Form.InputGroup label="Email ID" errorMsg={formValidationError["txtEmailID"]} req="false">
                <Form.InputControl
                  control="input"
                  type="text"
                  autoComplete="off"
                  value={formValues.txtEmailID}
                  name="txtEmailID"
                  onChange={(e) => updateState("txtEmailID", e.target.value)}
                />
              </Form.InputGroup>
              <Form.InputGroup label="Mobile No" errorMsg={formValidationError["txtMobileNo"]} req="true">
                <Form.InputControl
                  control="input"
                  type="text"
                  minLength="10"
                  maxLength="10"
                  autoComplete="off"
                  value={formValues.txtMobileNo}
                  name="txtMobileNo"
                  onChange={(e) => updateState("txtMobileNo", e.target.value)}
                />
              </Form.InputGroup>
              <Form.InputGroup label="User Type" errorMsg={formValidationError["txtUserType"]} req="true">
                <Form.InputControl
                  control="select"
                  name="txtUserType"
                  loader={isLoadingUserType ? <Loader /> : null}
                  onChange={(e) => updateState("txtUserType", e)}
                  value={formValues.txtUserType}
                  options={userType}
                  getOptionLabel={(option) => `${option.AppAccessName}`}
                  getOptionValue={(option) => `${option}`}
                />
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

export default AddUser;

AddUser.propTypes = {
  showfunc: PropTypes.func.isRequired,
  referenceTypeOptions: PropTypes.array,
  updateUserData: PropTypes.func.isRequired,
};
