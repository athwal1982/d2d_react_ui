import { React, useState, useEffect, useRef } from "react";
import { Loader } from "Framework/Components/Widgets";
import { dateFormatDDMMYY } from "Configration/Utilities/dateformat";
import { BsThreeDots } from "react-icons/bs";
import { RiFileList3Line } from "react-icons/ri";
import { MdAssignment } from "react-icons/md";
import { PropTypes } from "prop-types";
import { getApplicantDetailsData } from "../Service/Method";
import BizClass from "../D2DServcie.module.scss";
import AssignedDocumentList from "./AssignedDocumentList";
import VLEMapping from "./VLEMapping";

function ApplicantDetails({ toggleApplicantDetailsModal, selectedApplicant, setAlertMessage }) {
  const [applicantData, setApplicantData] = useState();
  const [isLoadingApplicantData, setIsLoadingApplicantData] = useState(false);

  const getApplicantDetailsListData = async (message) => {
    try {
      const formdata = {
        viewMode: "MOBILE",
        mobileNumber: selectedApplicant && selectedApplicant.ApplicantContactNumber ? selectedApplicant.ApplicantContactNumber : "",
        appointmentNo: "",
      };
      debugger;
      setIsLoadingApplicantData(true);
      const result = await getApplicantDetailsData(formdata);
      setIsLoadingApplicantData(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          if (Object.keys(result.response.responseData).length > 0) {
            setApplicantData(result.response.responseData);
          } else {
            setApplicantData();
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      } else if (result.response.responseCode !== 1) {
        if (message) {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: "Something went Wrong! Error Code : 442",
      });
    }
  };

  const [documentList, setDocumentList] = useState([]);
  const [openDocumentModal, setOpenDocumentModal] = useState(false);
  const toggleDocumentListClick = (data) => {
    debugger;
    if (data) {
      setDocumentList(data.document ? data.document : []);
    }
    setOpenDocumentModal(!openDocumentModal);
  };

  const [openVLEAssignModal, setOpenVLEAssignModal] = useState(false);
  const [selectedApplointment, setSelectedApplointment] = useState();
  const toggleVLEAssignClick = (data) => {
    debugger;
    setSelectedApplointment(data);
    setOpenVLEAssignModal(!openVLEAssignModal);
  };

  useEffect(() => {
    getApplicantDetailsListData();
  }, []);

  return (
    <>
      {openDocumentModal && <AssignedDocumentList toggleDocumentListClick={toggleDocumentListClick} documentList={documentList} />}
      {openVLEAssignModal && (
        <VLEMapping
          toggleVLEAssignClick={toggleVLEAssignClick}
          selectedApplicant={selectedApplicant}
          selectedApplointment={selectedApplointment}
          setAlertMessage={setAlertMessage}
        />
      )}
      <div className={BizClass.PageDiv}>
        <div className={BizClass.EnquiryMainSection}>
          <div className={BizClass.HeaderTop}>
            <h2>Applicant Name : {selectedApplicant && selectedApplicant.ApplicantName ? selectedApplicant.ApplicantName : ""}</h2>
            <button type="button" onClick={toggleApplicantDetailsModal}>
              Close
            </button>
          </div>
          <div className={BizClass.EnQuiryPopupPage}>
            <div className={BizClass.MainSection}>
              {isLoadingApplicantData ? <Loader /> : null}
              {
                applicantData && Object.keys(applicantData).length > 0 ? (
                  applicantData.appointment.length > 0 ? (
                    applicantData.appointment.map((data, i) => {
                      return (
                        <button type="button" key={i} className={BizClass.DataCard}>
                          <div style={{ "text-align": "right" }}>
                            <ApplicantCard data={data} toggleDocumentListClick={toggleDocumentListClick} toggleVLEAssignClick={toggleVLEAssignClick} />
                          </div>
                          <h4>
                            <span>
                              {data && data.AppointmentNo ? data.AppointmentNo : ""} ({data && data.AppointmentStatus ? data.AppointmentStatus : ""})
                            </span>
                          </h4>

                          <div className={BizClass.Details}>
                            <p> Date : {data && data.AppointmentDate ? dateFormatDDMMYY(data.AppointmentDate.split("T")[0]) : ""}</p>
                            <p> Slot : {data && data.AppointmentSlot ? data.AppointmentSlot : ""}</p>
                          </div>
                          <div className={BizClass.Details}>
                            <p>Location Type : {data && data.Location ? data.Location : ""}</p>
                            <p>Village/Ward : {data && data.Village ? data.Village : ""}</p>
                          </div>
                          <div className={BizClass.DataTabs}>
                            <div>
                              <p>
                                {data && data.Address ? data.Address : ""} {data && data.LandMark ? `, ${data.LandMark}` : ""} <br /> Pincode :{" "}
                                {data && data.PinCode ? data.PinCode : ""}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <SkaletonForm />
                  )
                ) : null
                // <SkeletonDtboxData />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplicantDetails;

function SkaletonForm() {
  return (
    <div className={BizClass.SkaletonForm}>
      <div className={BizClass.InformationSkaleton}>
        <Skaleton />
        <Skaleton />
        <Skaleton />
        <Skaleton />
        <Skaleton />
        <Skaleton />
      </div>
      <div className={BizClass.TicketSkaleton} />
    </div>
  );
}

function Skaleton() {
  return (
    <div className={BizClass.Data}>
      <span className={BizClass.Id} />
      <span className={BizClass.Contents} />
    </div>
  );
}

function ApplicantCard({ data, toggleDocumentListClick, toggleVLEAssignClick }) {
  const ref = useRef();
  const [isModalOpen, setModalOpen] = useState(false);

  function useOnClickOutside(ref, handler) {
    useEffect(() => {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref, handler]);
  }

  useOnClickOutside(ref, () => {
    setModalOpen(false);
  });

  const onClick = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div ref={ref} className={BizClass.Applicant_MCBox}>
      <div className={BizClass.Applicant_Icon_Container}>
        <BsThreeDots className={BizClass.Biz_Icon} onClick={() => onClick()} />
        {isModalOpen && (
          <div className={BizClass.DynBiz_ContextMenu}>
            <button type="button" className={BizClass.DynBiz_ContextMenu_list} onClick={() => toggleDocumentListClick(data)}>
              <RiFileList3Line />
              <span>Documents</span>
            </button>
            <button type="button" className={BizClass.DynBiz_ContextMenu_list} onClick={() => toggleVLEAssignClick(data)}>
              <MdAssignment />
              <span>VLE Assign</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

ApplicantDetails.propTypes = {
  toggleApplicantDetailsModal: PropTypes.func.isRequired,
  setAlertMessage: PropTypes.func.isRequired,
  selectedApplicant: PropTypes.object,
};

ApplicantCard.propTypes = {
  data: PropTypes.object,
  toggleDocumentListClick: PropTypes.func.isRequired,
  toggleVLEAssignClick: PropTypes.func.isRequired,
};
