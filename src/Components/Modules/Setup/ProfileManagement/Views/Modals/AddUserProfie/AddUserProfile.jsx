import React from "react";
import { Form, Modal } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import PropTypes from "prop-types";
import AddUserProfileLogics from "./Logic/Logic";

function AddUserProfile({ showfunc, updateProfileMgmt }) {
  const { formValues, updateState, handleSave, btnloaderActive, formValidationError } = AddUserProfileLogics();

  return (
    <Modal onSubmit={(e) => handleSave(e, updateProfileMgmt, showfunc)} varient="center" title="Add User Profile" show={showfunc} right="0">
      <Modal.Body>
        <Form>
          <Form.Group column="1" controlwidth="280px">
            <Form.InputGroup label="Profile Name" errorMsg={formValidationError["txtProfileName"]}>
              <Form.InputControl
                control="input"
                type="text"
                name="txtProfileName"
                maxLength="100"
                autoComplete="off"
                value={formValues.txtProfileName}
                onChange={(e) => updateState(e.target.name, e.target.value)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="Profile Description" errorMsg="">
              <Form.InputControl
                control="input"
                type="text"
                name="txtProfileDescription"
                maxLength="100"
                autoComplete="off"
                value={formValues.txtProfileDescription}
                onChange={(e) => updateState(e.target.name, e.target.value)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="Active Status" LabelReq="false" Col="1" htmlFor="ActiveStatus_Check">
              <Form.InputControl
                checked={formValues.txtActiveStatus}
                name="txtActiveStatus"
                control="switch"
                onChange={(e) => updateState(e.target.name, !formValues.txtActiveStatus)}
                id="ActiveStatus_Check"
              />
            </Form.InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" varient="secondary" trigger={btnloaderActive}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddUserProfile;

AddUserProfile.propTypes = {
  showfunc: PropTypes.func.isRequired,
  updateProfileMgmt: PropTypes.func.isRequired,
};
