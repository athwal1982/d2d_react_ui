import React from "react";
import { Form, Modal } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import { Button, Loader } from "Framework/Components/Widgets";
import AddRightsLogics from "./Logics/Logics";

function AddRights({ showfunc, updateRightsData }) {
  const { formValues, updateState, handleSave, menuMasterType, isLoadingMenuType, btnLoaderActive, formValidationError } = AddRightsLogics();
  return (
    <Modal onSubmit={(e) => handleSave(e, updateRightsData)} varient="bottom" title="Add Access Rights" show={showfunc} right="0">
      <Modal.Body>
        <Form>
          <Form.Group column="2" controlwidth="280px">
            <Form.InputGroup label="RightAPIURL" errorMsg={formValidationError["txtRightApiUrl"]} req="true" Col="2">
              <Form.InputControl
                control="input"
                type="text"
                autoComplete="off"
                value={formValues.txtRightApiUrl}
                name="txtRightApiUrl"
                onChange={(e) => updateState("txtRightApiUrl", e.target.value)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="Right Name" errorMsg={formValidationError["txtRightName"]} req="true" Col="1">
              <Form.InputControl
                control="input"
                type="text"
                autoComplete="off"
                value={formValues.txtRightName}
                name="txtRightName"
                onChange={(e) => updateState("txtRightName", e.target.value)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="MenuMasterID" errorMsg={formValidationError["txtMenuMaterID"]} req="true" Col="1">
              <Form.InputControl
                control="select"
                name="txtMenuMaterID"
                onChange={(e) => updateState("txtMenuMaterID", e)}
                loader={isLoadingMenuType ? <Loader /> : null}
                value={formValues.txtMenuMaterID}
                options={menuMasterType}
                getOptionLabel={(option) => `${option.MenuName}`}
                getOptionValue={(option) => `${option}`}
              />
            </Form.InputGroup>
            <Form.InputGroup label="ApplyToAdmin" errorMsg="" req="true" Col="1">
              <Form.InputControl
                control="switch"
                checked={formValues.txtApplyToAdmin}
                name="txtApplyToAdmin"
                onChange={(e) => updateState(e.target.name, !formValues.txtApplyToAdmin)}
                id="txtApplyToAdmin"
              />
            </Form.InputGroup>
            <Form.InputGroup label="Right Code" errorMsg={formValidationError["txtRightCode"]} req="true" Col="1">
              <Form.InputControl
                control="input"
                type="text"
                autoComplete="off"
                value={formValues.txtRightCode}
                name="txtRightCode"
                onChange={(e) => updateState("txtRightCode", e.target.value)}
              />
            </Form.InputGroup>
            <Form.InputGroup label="SP Name" errorMsg="" Col="2">
              <Form.InputControl
                control="input"
                type="text"
                autoComplete="off"
                value={formValues.txtSpName}
                name="txtSpName"
                onChange={(e) => updateState("txtSpName", e.target.value)}
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
  );
}

export default AddRights;

AddRights.propTypes = {
  showfunc: PropTypes.func.isRequired,
  updateRightsData: PropTypes.func.isRequired,
};
