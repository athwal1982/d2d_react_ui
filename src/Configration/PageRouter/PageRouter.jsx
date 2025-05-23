import React from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "Components/Common/Welcome/Welcome";
import Login from "Components/Common/Login/login";
import HomePage from "Components/Common/Home/index";
import UserManagementPage from "Components/Modules/Setup/UserManagement";
import MenuManagementPage from "Components/Modules/Setup/MenuManagement";
import ProfileManagementPage from "Components/Modules/Setup/ProfileManagement";
import ServiceManagement from "Components/Modules/Setup/ServiceManagement/ServiceManagement";
import SlotManagement from "Components/Modules/Setup/SlotManagement/SlotManagement";
import AccessRightsPage from "Components/Modules/Setup/AccessRights";
import MenuToUser from "Components/Modules/Setup/MenuToUser";
import D2DService from "Components/Modules/D2DService/D2DService";
import CreateService from "Components/Modules/D2DService/Modal/CreateService";
import TicketHistory from "Components/Modules/Reports/TicketHistory/TicketHistory";
import GrievanceReport from "Components/Modules/Reports/GrievanceReport/GrievanceReport";
import ServiceReport from "Components/Modules/Reports/ServiceReport/ServiceReport";
import DepartmentWiseReport from "Components/Modules/Reports/DepartmentWiseReport/DepartmentWiseReport";
import UserWiseTicket from "Components/Modules/Reports/UserWiseTicket/UserWiseTicket";
import AppointmentHistory from "Components/Modules/Reports/AppointmentHistory/AppointmentHistory";
import CumulativeStatus from "Components/Modules/Reports/CumulativeStatus/CumulativeStatus";
import VLEPerformance from "Components/Modules/Reports/VLEPerformance/VLEPerformance";
import ServiceRequest from "Components/Modules/Reports/ServiceRequest/ServiceRequest";
import SRComplete from "Components/Modules/Reports/SRComplete/SRComplete";
import ServiceDiscard from "Components/Modules/Reports/ServiceDiscard/ServiceDiscard";
import Complaint from "Components/Modules/Reports/Complaint/Complaint";
import AgeingDepartmentWise from "Components/Modules/Reports/AgeingDepartmentWise/AgeingDepartmentWise";
import AgeingVLEWise from "Components/Modules/Reports/AgeingVLEWise/AgeingVLEWise";
import ServiceActivity from "Components/Common/ServiceActivity/ServiceActivity";
import ServiceSuccess from "Components/Common/ServiceActivity/ServiceSuccess";
import Complaints from "Components/Modules/Complaints/Complaints";
import Page from "./Page/Page";
import PageAuthenticator from "./PageAuthenticator/PageAuthenticator";

function PageRouter() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<PageAuthenticator />} />

        <Route exact path="/login" element={<Login />} />
        <Route exact path="/welcome" element={<Page component={<Welcome />} title="Home" />} />
        <Route exact path="/ServiceActivity" element={<ServiceActivity />} />
        <Route exact path="/ServiceSuccess" element={<ServiceSuccess />} />
        <Route exact path="/home" element={<Page component={<HomePage />} title="Dashboard" />} />
        <Route exact path="/UserManagement" element={<Page component={<UserManagementPage />} title="User Management" />} />

        <Route exact path="/MenuManagement" element={<Page component={<MenuManagementPage />} title="Menu Management" />} />

        <Route exact path="/ProfileManagement" element={<Page component={<ProfileManagementPage />} title="Profile Management" />} />

        <Route exact path="/ServiceManagement" element={<Page component={<ServiceManagement />} title="Service Management" />} />
        <Route exact path="/SlotManagement" element={<Page component={<SlotManagement />} title="Slot Management" />} />
        <Route exact path="/ServiceRequest" element={<Page component={<ServiceRequest />} title="Service Request" />} />
        <Route exact path="/SRComplete" element={<Page component={<SRComplete />} title="SR Complete" />} />

        <Route exact path="/AcessRights" element={<Page component={<AccessRightsPage />} title="Access Rights" />} />

        <Route exact path="/MenuToUserManagment" element={<Page component={<MenuToUser />} title="Menu To User" />} />
        <Route exact path="/D2DService" element={<Page component={<D2DService />} title="D2D Service" />} />
        <Route exact path="/Complaints" element={<Page component={<Complaints />} title="Complaint List" />} />
        <Route exact path="/CreateService" element={<Page component={<CreateService />} title="Create Service" />} />
        <Route exact path="/GrievanceReport" element={<Page component={<GrievanceReport />} title="Grievance Report" />} />
        <Route exact path="/ServiceReport" element={<Page component={<ServiceReport />} title="Service Consolidated" />} />
        <Route exact path="/DepartmentWiseReport" element={<Page component={<DepartmentWiseReport />} title="Department Wise" />} />
        <Route exact path="/TicketHistory" element={<Page component={<TicketHistory />} title="Ticket History" />} />
        <Route exact path="/UserWiseTicket" element={<Page component={<UserWiseTicket />} title="User Wise Ticket" />} />
        <Route exact path="/AppointmentHistory" element={<Page component={<AppointmentHistory />} title="Appointment History" />} />
        <Route exact path="/CumulativeStatus" element={<Page component={<CumulativeStatus />} title="Cumulative Status" />} />
        <Route exact path="/VLEPerformance" element={<Page component={<VLEPerformance />} title="VLE Performance" />} />
        <Route exact path="/ServiceDiscard" element={<Page component={<ServiceDiscard />} title="Service Discard" />} />
        <Route exact path="/Complaint" element={<Page component={<Complaint />} title="Complaint" />} />
        <Route exact path="/AgeingDepartmentWise" element={<Page component={<AgeingDepartmentWise />} title="Ageing Department Wise" />} />
        <Route exact path="/AgeingVLEWise" element={<Page component={<AgeingVLEWise />} title="Ageing VLE Wise" />} />
      </Routes>
    </Router>
  );
}

export default PageRouter;
