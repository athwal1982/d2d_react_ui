import React from "react";
import ReactDOM from "react-dom/client";
import "Framework/Assets/Styles/main.scss";
import { LicenseManager } from "ag-grid-enterprise";
import PageRouter from "Configration/PageRouter/PageRouter";
import NotificationProvider from "Framework/Components/Widgets/Notification/NotificationProvider";
import LicenseKeys from "Configration/Utilities/LicenseManager/LicenseKeys.json";
import CentralServiceProvider from "Framework/Utilities/CentralServiceProvider";

LicenseManager.setLicenseKey(LicenseKeys.AgGrid);
CentralServiceProvider();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <NotificationProvider>
    <PageRouter />
  </NotificationProvider>,
);
