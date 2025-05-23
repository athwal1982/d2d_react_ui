import React, { useState } from "react";
import { Form, Modal } from "Framework/Components/Layout";
import { Button } from "Framework/Components/Widgets";
import { PropTypes } from "prop-types";
import { addDocumentData } from "../Service/Method";

function AddDocument({ toggleAddDocumentModal, updateAddDocument, setAlertMessage }) {
  const [btnloaderActive, setBtnloaderActive] = useState(false);
  const [formValues, setFormValues] = useState({
    txtDocumentName: "",
  });

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const [formValidationError, setFormValidationError] = useState({});

  const handleValidation = () => {
    const errors = {};

    let formIsValid = true;
    if (!formValues.txtDocumentName || typeof formValues.txtDocumentName === "undefined") {
      formIsValid = false;
      errors["txtDocumentName"] = "Document Name is required!";
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
        documentName: formValues.txtDocumentName ? formValues.txtDocumentName : "",
      };
      const result = await addDocumentData(formData);
      setBtnloaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });

        const addNewDocument = [
          {
            DocumentTypeID: result.response.responseData.DocumentTypeID ? result.response.responseData.DocumentTypeID : 0,
            DocumentName: formValues.txtDocumentName ? formValues.txtDocumentName : "",
            IsNewlyAdded: true,
          },
        ];
        updateAddDocument(addNewDocument);
        toggleAddDocumentModal();
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
    <Modal varient="center" title="Add Document" show={toggleAddDocumentModal} right="0">
      <Modal.Body>
        <Form>
          <Form.Group column="1" controlwidth="880px">
            <Form.InputGroup label="Document Name" req="true" errorMsg={formValidationError["txtDocumentName"]}>
              <Form.InputControl
                control="input"
                type="text"
                name="txtDocumentName"
                maxLength="300"
                autoComplete="off"
                value={formValues.txtDocumentName}
                onChange={(e) => updateState(e.target.name, e.target.value)}
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

export default AddDocument;
AddDocument.propTypes = {
  toggleAddDocumentModal: PropTypes.func.isRequired,
  updateAddDocument: PropTypes.func.isRequired,
  setAlertMessage: PropTypes.func.isRequired,
};
