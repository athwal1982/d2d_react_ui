import React, { useState } from "react";
import { Form, Modal } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { PropTypes } from "prop-types";
import { appointmentFeesUpdateData } from "../Service/Method";

function EditServiceFeePopup({ toggleEditServiceFee, assignedServiceDocumentList, setAlertMessage }) {
  const [btnloaderActive, setBtnloaderActive] = useState(false);
  const [formValues, setFormValues] = useState({
    txtServiceFee:
      assignedServiceDocumentList && assignedServiceDocumentList.length > 0 && assignedServiceDocumentList[0].ServiceFees
        ? assignedServiceDocumentList[0].ServiceFees
        : "",
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
        appointmentFeesMasterID:
          assignedServiceDocumentList && assignedServiceDocumentList.length > 0 && assignedServiceDocumentList[0].AppointmentFeesMasterID
            ? assignedServiceDocumentList[0].AppointmentFeesMasterID
            : 0,
        serviceFees: formValues && formValues.txtServiceFee ? formValues.txtServiceFee : 0,
      };

      const result = await appointmentFeesUpdateData(formdata);
      setBtnloaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });
        if (result.response.responseData) {
          assignedServiceDocumentList[0].ServiceFees = formValues && formValues.txtServiceFee ? formValues.txtServiceFee : 0;
          toggleEditServiceFee();
        }
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
    <Modal varient="center" title="Edit Service Fee" show={toggleEditServiceFee} right="0">
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
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditServiceFeePopup;
EditServiceFeePopup.propTypes = {
  toggleEditServiceFee: PropTypes.func.isRequired,
  assignedServiceDocumentList: PropTypes.array,
  setAlertMessage: PropTypes.func.isRequired,
};
