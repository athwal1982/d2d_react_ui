import { React } from "react";
import success from "Framework/Assets/Images/success.png";
import { getSessionStorage } from "../Login/Auth/auth";
import "./ServiceSuccess.scss";

function ServiceSuccess() {
  const servicesuccessData = getSessionStorage("servicesuccess");

  return (
    <div className="ServiceSuccessPage__Div">
      <div className="ServiceSuccessPage__ContentBox">
        <h2>Success!</h2>
        <p>
          {servicesuccessData && servicesuccessData === "CA"
            ? "Appointment Created Successfully!"
            : servicesuccessData === "CC"
            ? "Complaint Lodged Successfully"
            : ""}
        </p>
        <p>Please Close The Tab</p>
      </div>
      <img src={success} alt="Success" />
    </div>
  );
}
export default ServiceSuccess;
