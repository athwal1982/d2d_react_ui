import { React, useState, useEffect, useRef } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getCurrentDateTimeTick } from "Configration/Utilities/dateformat";
import { Button } from "Framework/Components/Widgets";
import { Form, Modal } from "Framework/Components/Layout";
import { FaFileDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { PropTypes } from "prop-types";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getDTDSMasterDataBindingDataList } from "../../../D2DService/Service/Method";
import { addBulkStateServiceData } from "../Service/Method";

function ImportServiceData({ showfunc }) {
  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");
  const fileRef = useRef(null);

  const [formValuesImportServiceData, setFormValuesImportServiceData] = useState({
    txtDocumentUpload: null,
    txtState: null,
    // A txtAgentFee: "",
  });

  const downloadExcel = (data, workSheetColumnWidth, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    worksheet["!cols"] = workSheetColumnWidth;
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  const rearrangeAndRenameColumns = (originalData, columnMapping) => {
    return originalData.map((item) => {
      const rearrangedItem = Object.fromEntries(Object.entries(columnMapping).map(([oldColumnName, newColumnName]) => [newColumnName, item[oldColumnName]]));
      return rearrangedItem;
    });
  };
  const downloadExcelFile = async () => {
    const serviceDataFormat = [
      {
        Department: undefined,
        SubDepartmentName: undefined,
        ServiceName: undefined,
        MandatoryDocuments: undefined,
        OptionalDocuments: undefined,
        TimeLine: undefined,
        DepartmentFee: undefined,
        ServiceCharges: undefined,
        GST: undefined,
        Total: undefined,
      },
    ];
    const columnOrder = {
      Department: "Department",
      SubDepartmentName: "Sub Department",
      ServiceName: "Service Name",
      MandatoryDocuments: "Mandatory Documents",
      OptionalDocuments: "Optional Documents",
      DepartmentFee: "Department Fees",
      ServiceCharges: "Service Charges",
      GST: "GST",
      Total: "Total",
      TimeLine: "Time Line",
    };
    const rearrangedData = rearrangeAndRenameColumns(serviceDataFormat, columnOrder);
    const workSheetColumnWidth = [
      { width: 35 },
      { width: 35 },
      { width: 65 },
      { width: 65 },
      { width: 65 },
      { width: 18 },
      { width: 18 },
      { width: 18 },
      { width: 12 },
      { width: 12 },
    ];
    const UniqueDateTimeTick = getCurrentDateTimeTick();
    downloadExcel(rearrangedData, workSheetColumnWidth, `Service_Format${UniqueDateTimeTick}`);
  };

  const fileType = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  const [excelFile, setExcelFile] = useState(null);
  const [formValidationImportServiceDataError, setformValidationImportServiceDataError] = useState({});
  const validateFieldSupportTicket = (name, value) => {
    let errorsMsg = "";
    if (name === "txtDocumentUpload") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "File is required!";
      } else if (value && typeof value !== "undefined") {
        const regex = new RegExp("^[a-zA-Z0-9_.-]*$");
        if (!regex.test(value.name)) {
          errorsMsg = "File name is not in valid format.";
        }
      }
    }
    if (name === "txtState") {
      if (!value || typeof value === "undefined") {
        errorsMsg = "State is required!";
      }
    }
    // A if (name === "txtAgentFee") {
    // A  if (!value || typeof value === "undefined") {
    // A    errorsMsg = "Agent Fee is required!";
    // A  }
    // A }

    return errorsMsg;
  };
  const updateStateImportServiceData = (name, value) => {
    setFormValuesImportServiceData({ ...formValuesImportServiceData, [name]: value });
    setformValidationImportServiceDataError[name] = validateFieldSupportTicket(name, value);
    if (name === "txtDocumentUpload") {
      setExcelFile(null);
      setformValidationImportServiceDataError({});
      const selectedFile = value;
      if (selectedFile) {
        if (selectedFile && fileType.includes(selectedFile.type)) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(selectedFile);
          reader.onload = (e) => {
            setExcelFile(e.target.result);
          };
        } else {
          setExcelFile(null);
        }
      }
    }
  };

  const handleResetFile = async () => {
    fileRef.current.value = null;
    setformValidationImportServiceDataError({});
    setFormValuesImportServiceData({
      ...formValuesImportServiceData,
      txtDocumentUpload: null,
    });
  };

  const handleValidationImportServiceData = () => {
    try {
      const errors = {};
      let formIsValid = true;
      errors["txtDocumentUpload"] = validateFieldSupportTicket("txtDocumentUpload", formValuesImportServiceData.txtDocumentUpload);
      errors["txtState"] = validateFieldSupportTicket("txtState", formValuesImportServiceData.txtState);
      // A errors["txtAgentFee"] = validateFieldSupportTicket("txtAgentFee", formValuesImportServiceData.txtAgentFee);
      if (Object.values(errors).join("").toString()) {
        formIsValid = false;
      }
      setformValidationImportServiceDataError(errors);
      return formIsValid;
    } catch (error) {
      setAlertMessage({
        type: "error",
        message: "Something Went Wrong",
      });
      return false;
    }
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleSave = async () => {
    if (!handleValidationImportServiceData()) {
      return;
    }
    debugger;
    const pAttachment =
      formValuesImportServiceData.txtDocumentUpload && formValuesImportServiceData.txtDocumentUpload ? formValuesImportServiceData.txtDocumentUpload : "";
    if (pAttachment !== "") {
      const valExtension = pAttachment.name.substring(pAttachment.name.lastIndexOf(".")).toLowerCase().slice(1);
      switch (valExtension) {
        case "xlsx":
          break;
        default:
          setAlertMessage({
            type: "error",
            message: "Please select only xlsx extension file.",
          });
          return;
      }
      if (pAttachment.size > 1000000) {
        setAlertMessage({
          type: "error",
          message: "Please upload less than 1MB or 1MB file!",
        });
        return;
      }
    }
    if (excelFile !== null) {
      const workBook = XLSX.read(excelFile, { type: "buffer" });
      const workSheetName = workBook.SheetNames[0];
      const wokrSheet = workBook.Sheets[workSheetName];
      const excelData = XLSX.utils.sheet_to_json(wokrSheet, {
        header: 0,
        defval: "",
      });
      if (excelData && excelData.length > 0) {
        const obj = excelData[0];
        if (!Object.keys(obj).includes("Service Name")) {
          setAlertMessage({
            open: true,
            type: "warning",
            message: "Please do not change the Haeder cloumn Service Name",
          });
          return;
        }
        if (!Object.keys(obj).includes("Mandatory Documents")) {
          setAlertMessage({
            open: true,
            type: "warning",
            message: "Please do not change the Header cloumn Mandatory Documents",
          });
          return;
        }
        if (!Object.keys(obj).includes("Optional Documents")) {
          setAlertMessage({
            open: true,
            type: "warning",
            message: "Please do not change the Haeder cloumn Optional Documents",
          });
          return;
        }
        if (!Object.keys(obj).includes("Time Line")) {
          setAlertMessage({
            open: true,
            type: "warning",
            message: "Please do not change the Haeder cloumn Time Line",
          });
          return;
        }
        if (!Object.keys(obj).includes("Department Fees")) {
          setAlertMessage({
            open: true,
            type: "warning",
            message: "Please do not change the Haeder cloumn Department Fees",
          });
          return;
        }
        const dataForUpload = [];
        const serviceForUpload = [];
        excelData.forEach((val) => {
          dataForUpload.push({
            departmentName: val["Department"],
            subDepartmentName: val["Sub Department"],
            serviceName: val["Service Name"],
            serviceFees: val["Department Fees"],
            vLEServiceCharge: val["Service Charges"],
            vLEGSTCharge: val["GST"],
            vLETotal: val["Total"],
            timeLine: val["Time Line"],
            serviceDocument: val["Mandatory Documents"],
            optionalDocuments: val["Optional Documents"],
          });
        });
        const filterGroupByServiceList = Object.groupBy(dataForUpload, ({ serviceName }) => serviceName);
        if (Object.keys(filterGroupByServiceList).length > 0) {
          const rtnarry = Object.values(filterGroupByServiceList).map((s) => {
            return s;
          });
          rtnarry.forEach((data) => {
            const dataServiceForUpload = {
              departmentName: "",
              subDepartmentName: "",
              serviceName: "",
              serviceFees: "",
              vLEServiceCharge: "",
              vLEGSTCharge: "",
              vLETotal: "",
              timeLine: "",
              serviceDocument: [],
              optionalDocuments: [],
            };
            data.forEach((v) => {
              dataServiceForUpload.departmentName = data[0].departmentName ? data[0].departmentName : "";
              dataServiceForUpload.subDepartmentName = data[0].subDepartmentName ? data[0].subDepartmentName : "";
              dataServiceForUpload.serviceFees = data[0].serviceFees ? data[0].serviceFees : "0";
              dataServiceForUpload.serviceName = data[0].serviceName ? data[0].serviceName : "";
              dataServiceForUpload.vLEServiceCharge = data[0].vLEServiceCharge ? data[0].vLEServiceCharge : "0";
              dataServiceForUpload.vLEGSTCharge = data[0].vLEGSTCharge ? data[0].vLEGSTCharge : "0";
              dataServiceForUpload.vLETotal = data[0].vLETotal ? data[0].vLETotal : "0";
              dataServiceForUpload.timeLine = data[0].timeLine ? data[0].timeLine : "0";
              dataServiceForUpload.serviceDocument.push({ document: v.serviceDocument });
              dataServiceForUpload.optionalDocuments.push({ document: v.optionalDocuments });
            });
            serviceForUpload.push(dataServiceForUpload);
          });

          try {
            const formdata = {
              services: serviceForUpload,
              stateCode:
                formValuesImportServiceData && formValuesImportServiceData.txtState && formValuesImportServiceData.txtState.StateCode
                  ? formValuesImportServiceData.txtState.StateCode
                  : 0,
              // A agentVisitingFees: formValuesImportServiceData.txtAgentFee ? formValuesImportServiceData.txtAgentFee : 0,
            };
            setBtnLoaderActive(true);
            const result = await addBulkStateServiceData(formdata);
            setBtnLoaderActive(false);
            if (result.response.responseCode === 1) {
              showfunc();
              setAlertMessage({
                type: "success",
                message: "Service data imported successfuly,Please get the result excel sheet.",
              });
              const columnOrder = {
                ServiceName: "Service Name",
                error: "Message",
              };
              const mappedData = result.response.responseData.map((value) => {
                return {
                  ServiceName: value.ServiceName,
                  error: value.error,
                };
              });
              const rearrangedData = rearrangeAndRenameColumns(mappedData, columnOrder);
              const workSheetColumnWidth = [{ width: 40 }, { width: 70 }];
              const UniqueDateTimeTick = getCurrentDateTimeTick();
              downloadExcel(rearrangedData, workSheetColumnWidth, `Imoprt_Service_Data_Result${UniqueDateTimeTick}`);
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
              message: error,
            });
          }
        }
      } else {
        setAlertMessage({
          open: true,
          type: "error",
          message: "Please, do not upload a blank file!",
        });
      }
    }
  };

  const [stateList, setStateList] = useState([]);
  const [isLoadingStateList, setIsLoadingStateList] = useState(false);
  const getStateListData = async () => {
    try {
      setStateList([]);
      setIsLoadingStateList(true);
      const formdata = {
        filterID: 0,
        filterID1: userData && userData.LoginID ? userData.LoginID : 0,
        filterID2: "",
        filterID3: "",
        // A masterName: "DTDSSTATE",
        masterName: "GETSTATE",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDTDSMasterDataBindingDataList(formdata);
      setIsLoadingStateList(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
          setStateList(result.response.responseData.masterdatabinding);
        } else {
          setStateList([]);
        }
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
        message: error,
      });
    }
  };

  useEffect(() => {
    getStateListData();
  }, []);

  return (
    <Modal varient="center" title="Import Service Data" show={showfunc} width="45.5vw" height="35.5vh">
      <Modal.Body>
        <Form>
          <Form.Group column={3} controlwidth="290px">
            <Form.InputGroup column={3} label="File" errorMsg={formValidationImportServiceDataError["txtDocumentUpload"]}>
              <Form.InputControl
                control="input"
                type="file"
                accept=".xlsx"
                name="txtDocumentUpload"
                onChange={(e) => updateStateImportServiceData(e.target.name, e.target.files[0])}
                ref={fileRef}
              />
            </Form.InputGroup>
            <Form.InputGroup column={1}>
              <Button type="button" varient="primary" onClick={() => handleResetFile()}>
                {" "}
                Reset File
              </Button>
            </Form.InputGroup>
            <Form.InputGroup column={1}>
              <FaFileDownload style={{ cursor: "pointer" }} title="Download the Service Excel File Format" onClick={() => downloadExcelFile()} />
            </Form.InputGroup>
            <Form.InputGroup label="State" column={3} errorMsg={formValidationImportServiceDataError["txtState"]} req="true">
              <Form.InputControl
                control="select"
                name="txtState"
                value={formValuesImportServiceData.txtState}
                options={stateList}
                isLoading={isLoadingStateList}
                getOptionLabel={(option) => `${option.StateMasterName}`}
                getOptionValue={(option) => `${option}`}
                onChange={(e) => updateStateImportServiceData("txtState", e)}
              />
            </Form.InputGroup>
            {/* <Form.InputGroup label="Agent Fee" req="true" errorMsg={formValidationImportServiceDataError["txtAgentFee"]}>
              <Form.InputControl
                control="input"
                type="text"
                name="txtAgentFee"
                autoComplete="off"
                value={formValuesImportServiceData.txtAgentFee}
                onChange={(e) =>
                  updateStateImportServiceData(
                    e.target.name,
                    e.target.value
                      .replace(/(^[\d]{10})[\d]/g, "$1")
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1")
                      .replace(/(\.[\d]{2})./g, "$1"),
                  )
                }
              />
            </Form.InputGroup> */}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" varient="secondary" trigger={btnLoaderActive} onClick={() => handleSave()}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ImportServiceData;

ImportServiceData.propTypes = {
  showfunc: PropTypes.func.isRequired,
};
