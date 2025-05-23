import React, { useState, useEffect } from "react";
import Modal from "Framework/Components/Layout/Modal/Modal";
import { Loader } from "Framework/Components/Widgets";
import moment from "moment";
import { PropTypes } from "prop-types";
import { getAppointmentVLEData } from "../Service/Method";
import BizClass from "../D2DServcie.module.scss";

function AssignedVLEDetails({ toggleVLEAssignedDetailsClick, selectedApplointment, setAlertMessage }) {
  const [vledata, setvledata] = useState([]);
  const [isLoadingvledata, setIsLoadingvledata] = useState([]);
  const getAssignedVLEDetailsData = async () => {
    debugger;
    try {
      const formdata = {
        appointmentNo: selectedApplointment.AppointmentNo ? selectedApplointment.AppointmentNo : "",
      };
      setIsLoadingvledata(true);
      const result = await getAppointmentVLEData(formdata);
      setIsLoadingvledata(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData && result.response.responseData.length > 0) {
          setvledata(result.response.responseData);
        } else {
          setvledata([]);
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
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  useEffect(() => {
    getAssignedVLEDetailsData();
  }, [selectedApplointment]);

  return (
    <Modal
      style={{ zIndex: "999999999" }}
      varient="center"
      title="Assigned VLE Details :"
      right={0}
      width="52vw"
      height="90vh"
      show={toggleVLEAssignedDetailsClick}
    >
      <Modal.Body>
        <div className={BizClass.VLESearch}>
          {isLoadingvledata ? <Loader /> : null}
          <div className={BizClass.VLESearchTitle}>
            <h3>Appointment Details</h3>
          </div>
          <button type="button" className={BizClass.VLEDataCard}>
            <div className={BizClass.Details}>
              <p> Appointment No. : {selectedApplointment.AppointmentNo ? selectedApplointment.AppointmentNo : "......................................."}</p>
              <p>
                {" "}
                Appointment Date :{" "}
                {selectedApplointment.AppointmentDate
                  ? moment(selectedApplointment.AppointmentDate).format("DD-MM-YYYY")
                  : "......................................."}
              </p>
            </div>
            <div className={BizClass.Details}>
              <p>
                Appointment Slot :{" "}
                {selectedApplointment.AppointmentSlotFrom && selectedApplointment.AppointmentSlotTo
                  ? `${selectedApplointment.AppointmentSlotFrom} - ${selectedApplointment.AppointmentSlotTo}`
                  : "......................................."}
              </p>
              <p className={BizClass.vleMapAppointentStatus}>
                Status : {selectedApplointment.STATUS ? selectedApplointment.STATUS : "......................................."}
              </p>
            </div>
          </button>
          <br />
          <div className={BizClass.VLESearchTitle}>
            <h3>VLE Details</h3>
          </div>
          <button type="button" className={BizClass.VLEDataCard}>
            <div className={BizClass.Details}>
              <p> VLE Name : {vledata && vledata.length > 0 && vledata[0] ? vledata[0].VLEName : "......................................."}</p>
              <p> Mobile No. : {vledata && vledata.length > 0 && vledata[0] ? vledata[0].ContactNumber : "......................................."}</p>
            </div>
            <div className={BizClass.Details}>
              <p>Email ID : {vledata && vledata.length > 0 && vledata[0] ? vledata[0].EmailID : "......................................."}</p>
              <p>
                Location Type :{" "}
                {vledata && vledata.length > 0 && vledata[0]
                  ? vledata[0].LocationType && vledata[0].LocationType === "U"
                    ? "Urban"
                    : vledata[0].LocationType === "R"
                    ? "Rural"
                    : ""
                  : "......................................."}
              </p>
            </div>
            <div className={BizClass.Details}>
              <p>State : {vledata && vledata.length > 0 && vledata[0] ? vledata[0].StateMasterName : "......................................."}</p>
              <p>District : {vledata && vledata.length > 0 && vledata[0] ? vledata[0].DistrictMasterName : "......................................."}</p>
            </div>
            <div className={BizClass.Details}>
              <p>Sub District : {vledata && vledata.length > 0 && vledata[0] ? vledata[0].subDistName : "......................................."}</p>
              <p>Panchayat : {vledata && vledata.length > 0 && vledata[0] ? vledata[0].panchayat : "......................................."}</p>
            </div>
            <div className={BizClass.Details}>
              <p>
                Nagar Palika/Panchayat :{" "}
                {vledata && vledata.length > 0 && vledata[0] ? vledata[0].nagar_Palika_OR_Panchayat : "......................................."}
              </p>
              <p>Village : {vledata && vledata.length > 0 && vledata[0] ? vledata[0].village : "......................................."}</p>
            </div>
            <div className={BizClass.Details}>
              <p>Ward Name: {vledata && vledata.length > 0 && vledata[0] ? vledata[0].wardName : "......................................."}</p>
              <p>Pincode : {vledata && vledata.length > 0 && vledata[0] ? vledata[0].PinCode : "......................................."}</p>
            </div>
            <div className={BizClass.DataTabs}>
              <div>
                <p>{vledata && vledata.length > 0 && vledata[0] ? vledata[0].VLEAddress : "......................................."}</p>
              </div>
            </div>
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

export default AssignedVLEDetails;

AssignedVLEDetails.propTypes = {
  toggleVLEAssignedDetailsClick: PropTypes.func.isRequired,
  selectedApplointment: PropTypes.object,
  setAlertMessage: PropTypes.func.isRequired,
};
