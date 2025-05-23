import React, { useState } from "react";
import { Form, Modal } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { PropTypes } from "prop-types";
import { addSlotData } from "../Service/Method";

function AddSlot({ toggleAddSlotModal, selectedState, updateSlotData, setAlertMessage }) {
  console.log(selectedState);
  const [btnloaderActive, setBtnloaderActive] = useState(false);
  const [formValues, setFormValues] = useState({
    txtSlotFrom: "",
    txtSlotDuration: "",
    txtSlotTo: "",
  });

  const [formValidationError, setFormValidationError] = useState({});
  const validateField = (name, value) => {
    let errorsMsg = "";

    if (name === "txtSlotFrom") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Slot From is required!";
      }
    }
    if (name === "txtSlotDuration") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Slot Duration is required!";
      }
    }
    if (name === "txtSlotTo") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "Slot To is required!";
      }
    }
    return errorsMsg;
  };
  const updateState = (name, value) => {
    debugger;
    setFormValues({ ...formValues, [name]: value });
    formValidationError[name] = validateField(name, value);
    if (name === "txtSlotFrom") {
      setFormValues({
        ...formValues,
        txtSlotFrom: value,
        txtSlotDuration: "",
        txtSlotTo: null,
      });
    }
    if (name === "txtSlotDuration") {
      const currentDate = new Date();
      const dt = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
      const t = `${dt} ${formValues.txtSlotFrom.label}`;
      const newDateTime = new Date(t);
      newDateTime.setHours(newDateTime.getHours() + Number(value));
      const newHours = newDateTime.getHours();
      const newMinutes = newDateTime.getMinutes();
      const ReturnTime = `${newHours.toString().length === 1 ? `0${newHours}` : newHours}:${
        newMinutes.toString().length === 1 ? `0${newMinutes}` : newMinutes
      }`;
      console.log(ReturnTime);
      setFormValues({
        ...formValues,
        txtSlotDuration: value,
        txtSlotTo: { label: ReturnTime, value: ReturnTime },
      });
      setFormValidationError({});
    }
  };

  const [slotDropdownDataList] = useState([
    { label: "09:00", value: "09:00" },
    { label: "09:15", value: "09:15" },
    { label: "09:30", value: "09:30" },
    { label: "09:45", value: "09:45" },
    { label: "10:00", value: "10:00" },
    { label: "10:15", value: "10:15" },
    { label: "10:30", value: "10:30" },
    { label: "10:45", value: "10:45" },
    { label: "11:00", value: "11:00" },
    { label: "11:15", value: "11:15" },
    { label: "11:30", value: "11:30" },
    { label: "11:45", value: "11:45" },
    { label: "12:00", value: "12:00" },
    { label: "12:15", value: "12:15" },
    { label: "12:30", value: "12:30" },
    { label: "12:45", value: "12:45" },
    { label: "13:00", value: "13:00" },
    { label: "13:15", value: "13:15" },
    { label: "13:30", value: "13:30" },
    { label: "13:45", value: "13:45" },
    { label: "14:00", value: "14:00" },
    { label: "14:15", value: "14:15" },
    { label: "14:30", value: "14:30" },
    { label: "14:45", value: "14:45" },
    { label: "15:00", value: "15:00" },
    { label: "15:15", value: "15:15" },
    { label: "15:30", value: "15:30" },
    { label: "15:45", value: "15:45" },
    { label: "16:00", value: "16:00" },
    { label: "16:15", value: "16:15" },
    { label: "16:30", value: "16:30" },
    { label: "16:45", value: "16:45" },
    { label: "17:00", value: "17:00" },
    { label: "17:15", value: "17:15" },
    { label: "17:30", value: "17:30" },
    { label: "17:45", value: "17:45" },
    { label: "18:00", value: "18:00" },
    { label: "18:15", value: "18:15" },
    { label: "18:30", value: "18:30" },
    { label: "18:45", value: "18:45" },
    { label: "19:00", value: "19:00" },
    { label: "19:15", value: "19:15" },
    { label: "19:30", value: "19:30" },
    { label: "19:45", value: "19:45" },
    { label: "20:00", value: "20:00" },
  ]);

  const handleValidation = () => {
    try {
      const errors = {};
      let formIsValid = true;

      errors["txtSlotFrom"] = validateField("txtSlotFrom", formValues.txtSlotFrom);
      errors["txtSlotDuration"] = validateField("txtSlotDuration", formValues.txtSlotDuration);
      errors["txtSlotTo"] = validateField("txtSlotTo", formValues.txtSlotTo);

      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      console.log("errors", errors);

      setFormValidationError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
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
        appointmentSlotFrom: formValues.txtSlotFrom && formValues.txtSlotFrom.label ? formValues.txtSlotFrom.label : "",
        appointmentSlotTo: formValues.txtSlotFrom && formValues.txtSlotTo.label ? formValues.txtSlotTo.label : "",
        appointmentDuration: formValues.txtSlotFrom && formValues.txtSlotDuration ? formValues.txtSlotDuration : "",
        stateCode: selectedState && selectedState.StateCode ? selectedState.StateCode : 0,
      };
      const result = await addSlotData(formData);
      setBtnloaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });

        const addNewSlot = [
          {
            AppointmentSlotID: result.response.responseData.AppointmentSlotID ? result.response.responseData.AppointmentSlotID : 0,
            AppointmentSlotTo: formValues.txtSlotFrom && formValues.txtSlotTo.label ? formValues.txtSlotTo.label : "",
            AppointmentSlotFrom: formValues.txtSlotFrom && formValues.txtSlotFrom.label ? formValues.txtSlotFrom.label : "",
            AppointmentDuration: formValues.txtSlotFrom && formValues.txtSlotDuration ? formValues.txtSlotDuration : "",
            StateCode: selectedState && selectedState.StateCode ? selectedState.StateCode : 0,
            IsActive: "YES",
            IsNewlyAdded: true,
          },
        ];
        updateSlotData(addNewSlot);
        toggleAddSlotModal();
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
    <Modal varient="center" title="Add Slot" show={toggleAddSlotModal} right="0">
      <Modal.Body>
        <Form>
          <Form.Group column="1" controlwidth="320px">
            <Form.InputGroup label="From Time" req="true" errorMsg={formValidationError["txtSlotFrom"]}>
              <Form.InputControl
                control="select"
                prefix={false}
                label=""
                type="text"
                name="txtSlotFrom"
                value={formValues.txtSlotFrom}
                options={slotDropdownDataList}
                getOptionLabel={(option) => `${option.label}`}
                getOptionValue={(option) => `${option}`}
                onChange={(e) => updateState("txtSlotFrom", e)}
              />
            </Form.InputGroup>
            <Form.InputGroup req="true" label="Duration(Hours)" errorMsg={formValidationError["txtSlotDuration"]}>
              <Form.InputControl
                control="input"
                type="text"
                name="txtSlotDuration"
                value={formValues.txtSlotDuration}
                autoComplete="off"
                maxLength={1}
                onChange={(e) => updateState("txtSlotDuration", e.target.value.replace(/\D/g, ""))}
              />
            </Form.InputGroup>
            <Form.InputGroup label="To Time" req="true" errorMsg={formValidationError["txtSlotTo"]}>
              <Form.InputControl
                control="select"
                prefix={false}
                label=""
                type="text"
                name="txtSlotTo"
                value={formValues.txtSlotTo}
                options={slotDropdownDataList}
                getOptionLabel={(option) => `${option.label}`}
                getOptionValue={(option) => `${option}`}
                onChange={(e) => updateState("txtSlotTo", e)}
                isDisabled={true}
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

export default AddSlot;
AddSlot.propTypes = {
  toggleAddSlotModal: PropTypes.func.isRequired,
  selectedState: PropTypes.object,
  updateSlotData: PropTypes.func.isRequired,
  setAlertMessage: PropTypes.func.isRequired,
};
