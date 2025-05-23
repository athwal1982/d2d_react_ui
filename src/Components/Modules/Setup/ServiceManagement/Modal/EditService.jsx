import React, { useState } from "react";
import { Form, Modal } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { PropTypes } from "prop-types";
import { updateServiceData } from "../Service/Method";

function EditService({ toggleEditServiceModal, selectedService, updateEditService, setAlertMessage }) {
  const [btnloaderActive, setBtnloaderActive] = useState(false);
  const [formValues, setFormValues] = useState({
    txtServiceName: selectedService && selectedService.ServiceName ? selectedService.ServiceName : "",
    // A txtDocumentRequired: selectedService && selectedService.DocumentRequired === "Y",
  });

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const [formValidationError, setFormValidationError] = useState({});

  const handleValidation = () => {
    const errors = {};

    let formIsValid = true;
    if (!formValues.txtServiceName || typeof formValues.txtServiceName === "undefined") {
      formIsValid = false;
      errors["txtServiceName"] = "Service Name is required!";
    }

    setFormValidationError(errors);
    return formIsValid;
  };

  const handleSave = async (e) => {
    try {
      if (e) e.preventDefault();
      if (!handleValidation()) {
        return;
      }
      debugger;

      setBtnloaderActive(true);
      const formData = {
        serviceTypeID: selectedService && selectedService.ServiceTypeID ? selectedService.ServiceTypeID : 0,
        serviceName: formValues.txtServiceName ? formValues.txtServiceName : "",
        documentRequired: "Y",
      };
      const result = await updateServiceData(formData);
      setBtnloaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        selectedService.ServiceName = formValues.txtServiceName ? formValues.txtServiceName : "";
        selectedService.DocumentRequired = "Y";
        updateEditService(selectedService);
        toggleEditServiceModal();
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

  return (
    <Modal varient="center" title="Edit Service" show={toggleEditServiceModal} right="0">
      <Modal.Body>
        <Form>
          <Form.Group column="1" controlwidth="680px">
            <Form.InputGroup label="Service Name" req="true" errorMsg={formValidationError["txtServiceName"]}>
              <Form.InputControl
                control="input"
                type="text"
                name="txtServiceName"
                maxLength="150"
                autoComplete="off"
                value={formValues.txtServiceName}
                onChange={(e) => updateState(e.target.name, e.target.value)}
              />
            </Form.InputGroup>
            {/* <Form.InputGroup label="Document Required" req="true" Col="1" htmlFor="DocumentRequired_Check">
              <Form.InputControl
                checked={formValues.txtDocumentRequired}
                name="txtDocumentRequired"
                control="switch"
                onChange={(e) => updateState(e.target.name, !formValues.txtDocumentRequired)}
                id="DocumentRequired_Check"
              />
            </Form.InputGroup> */}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button varient="secondary" onClick={(e) => handleSave(e)} trigger={btnloaderActive ? "true" : "false"}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditService;
EditService.propTypes = {
  toggleEditServiceModal: PropTypes.func.isRequired,
  selectedService: PropTypes.object,
  updateEditService: PropTypes.func.isRequired,
  setAlertMessage: PropTypes.func.isRequired,
};
