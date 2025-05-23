import React, { useState } from "react";
import { Form, Modal } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { PropTypes } from "prop-types";
import { updateAgentVisitingFeesData } from "../Service/Method";

function AddEditVisitingFee({ toggelAddEditVistingFeeClick, selectedState, setAlertMessage }) {
  const [btnloaderActive, setBtnloaderActive] = useState(false);
  const [formValues, setFormValues] = useState({
    txtVistingFee: selectedState && selectedState.AgentVisitingFees ? selectedState.AgentVisitingFees : "",
  });

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const [formValidationError, setFormValidationError] = useState({});

  const handleValidation = () => {
    const errors = {};

    let formIsValid = true;
    if (!formValues.txtVistingFee || typeof formValues.txtVistingFee === "undefined") {
      formIsValid = false;
      errors["txtVistingFee"] = "Visiting Fee is required!";
    }

    setFormValidationError(errors);
    return formIsValid;
  };

  const handleSave = async (e) => {
    debugger;
    try {
      if (e) e.preventDefault();
      if (!handleValidation()) {
        return;
      }
      setBtnloaderActive(true);
      const formdata = {
        stateMasterID: selectedState && selectedState.StateMasterID ? selectedState.StateMasterID : 0,
        agentVisitingFees: formValues && formValues.txtVistingFee ? formValues.txtVistingFee : 0,
      };

      const result = await updateAgentVisitingFeesData(formdata);
      setBtnloaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        selectedState.AgentVisitingFees = formValues && formValues.txtVistingFee ? formValues.txtVistingFee : 0;
        toggelAddEditVistingFeeClick();
      } else {
        setAlertMessage({
          type: "warning",
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
    <Modal
      varient="center"
      title={`${selectedState && selectedState.AgentVisitingFees ? "Update Visting Fee" : "Add Visting Fee"} (${
        selectedState && selectedState.StateMasterName ? selectedState.StateMasterName : ""
      })`}
      show={toggelAddEditVistingFeeClick}
      right="0"
    >
      <Modal.Body>
        <Form>
          <Form.Group column="1" controlwidth="320px">
            <Form.InputGroup label="Visiting Fee" req="true" errorMsg={formValidationError["txtVistingFee"]}>
              <Form.InputControl
                control="input"
                type="text"
                name="txtVistingFee"
                autoComplete="off"
                value={formValues.txtVistingFee}
                onChange={(e) =>
                  updateState(
                    e.target.name,
                    e.target.value
                      .replace(/(^[\d]{10})[\d]/g, "$1")
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1")
                      .replace(/(\.[\d]{2})./g, "$1"),
                  )
                }
              />
            </Form.InputGroup>
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

export default AddEditVisitingFee;
AddEditVisitingFee.propTypes = {
  toggelAddEditVistingFeeClick: PropTypes.func.isRequired,
  selectedState: PropTypes.object,
  setAlertMessage: PropTypes.func.isRequired,
};
