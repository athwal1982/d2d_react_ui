import React, { useState } from "react";
import { Form, Modal } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { PropTypes } from "prop-types";
import { addServiceData } from "../Service/Method";

function AddService({ toggleAddServiceModal, updateAddService, setAlertMessage }) {
  const [btnloaderActive, setBtnloaderActive] = useState(false);
  const [formValues, setFormValues] = useState({
    txtServiceName: "",
    // A txtDocumentRequired: false,
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
        serviceName: formValues.txtServiceName ? formValues.txtServiceName : "",
        documentRequired: formValues.txtDocumentRequired === true ? "Y" : "N",
      };
      const result = await addServiceData(formData);
      setBtnloaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });

        const addNewDocument = [
          {
            ServiceTypeID: result.response.responseData.ServiceTypeID ? result.response.responseData.ServiceTypeID : 0,
            ServiceName: formValues.txtServiceName ? formValues.txtServiceName : "",
            DocumentRequired: "Y",
            IsNewlyAdded: true,
          },
        ];
        updateAddService(addNewDocument);
        toggleAddServiceModal();
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
    <Modal varient="center" title="Add Service" show={toggleAddServiceModal} right="0">
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
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddService;
AddService.propTypes = {
  toggleAddServiceModal: PropTypes.func.isRequired,
  updateAddService: PropTypes.func.isRequired,
  setAlertMessage: PropTypes.func.isRequired,
};
