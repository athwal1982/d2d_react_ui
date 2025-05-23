import React, { useState } from "react";
import { Form, Modal } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { PropTypes } from "prop-types";
import { serviceTypeDocumentAssignManageData } from "../Service/Method";

function ServiceFeePopUp({ toggelServiceFeeClick, selectedState, selectedService, documentTypeIDs, updateAssignedServiceDocumentList, setAlertMessage }) {
  const [btnloaderActive, setBtnloaderActive] = useState(false);
  const [formValues, setFormValues] = useState({
    txtServiceFee: "",
    // A txtPaymentCode: "",
  });

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const [formValidationError, setFormValidationError] = useState({});

  const handleValidation = () => {
    const errors = {};

    let formIsValid = true;
    if (!formValues.txtServiceFee || typeof formValues.txtServiceFee === "undefined") {
      formIsValid = false;
      errors["txtServiceFee"] = "Service Fee is required!";
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
        viewMode: "ASSIGN",
        stateServiceAssignID: 0,
        serviceTypeID: selectedService && selectedService.ServiceTypeID ? selectedService.ServiceTypeID : 0,
        stateCode: selectedState && selectedState.StateCode ? selectedState.StateCode.toString() : "0",
        serviceFees: formValues && formValues.txtServiceFee ? formValues.txtServiceFee : 0,
        documentTypeID: documentTypeIDs,
      };

      const result = await serviceTypeDocumentAssignManageData(formdata);
      setBtnloaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        if (result.response.responseData) {
          updateAssignedServiceDocumentList(result.response.responseData, formValues && formValues.txtServiceFee ? formValues.txtServiceFee : 0);
        }
        toggelServiceFeeClick();
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
    <Modal varient="center" title="Add Service Fee" show={toggelServiceFeeClick} right="0">
      <Modal.Body>
        <Form>
          <Form.Group column="1" controlwidth="320px">
            <Form.InputGroup label="Service Fee" req="true" errorMsg={formValidationError["txtServiceFee"]}>
              <Form.InputControl
                control="input"
                type="text"
                name="txtServiceFee"
                autoComplete="off"
                value={formValues.txtServiceFee}
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
            {/* <Form.InputGroup label="Payment Code">
              <Form.InputControl
                control="input"
                type="text"
                name="txtPaymentCode"
                autoComplete="off"
                value={formValues.txtPaymentCode}
                onChange={(e) => updateState(e.target.name, e.target.value)}
                disabled={true}
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

export default ServiceFeePopUp;
ServiceFeePopUp.propTypes = {
  toggelServiceFeeClick: PropTypes.func.isRequired,
  selectedService: PropTypes.object,
  selectedState: PropTypes.object,
  documentTypeIDs: PropTypes.array,
  updateAssignedServiceDocumentList: PropTypes.func.isRequired,
  setAlertMessage: PropTypes.func.isRequired,
};
