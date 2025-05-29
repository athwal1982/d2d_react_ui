import React from "react";
import Chart from "react-apexcharts";
import { Loader } from "Framework/Components/Widgets";
import { PageBar } from "Framework/Components/Layout";
import BizClass from "./Home.module.scss";
import HomeLogics from "../Logic/Logic";
import ResetPasswordModal from "../../../Modules/Setup/UserManagement/Views/Modals/ResetPasswordModal/ResetPasswordModal";

function Home() {
  const {
    state2,
    state,
    satatusCount,
    isLoadingPageData,
    resetPasswordModal,
    toggleResetPasswordModal,
    selectedUserData,
    stateAppointmentsByState,
    updateSearchFormState,
    searchFormValues,
    yearList,
    monthList,
    stateHeaderColumn,
  } = HomeLogics();

  return (
    <>
      {resetPasswordModal ? <ResetPasswordModal showfunc={toggleResetPasswordModal} selectedUserData={selectedUserData} /> : null}
      <div className={BizClass.Box}>
        <PageBar style={{ background: "#0d63ad", borderRadius: "6px" }}>
          <PageBar.Select
            control="select"
            label="Year"
            name="txtYearFilter"
            getOptionLabel={(option) => `${option.label}`}
            value={searchFormValues.txtYearFilter}
            getOptionValue={(option) => `${option}`}
            options={yearList}
            onChange={(e) => updateSearchFormState("txtYearFilter", e)}
          />
          <PageBar.Select
            control="select"
            label="Month"
            name="txtMonthFilter"
            getOptionLabel={(option) => `${option.label}`}
            value={searchFormValues.txtMonthFilter}
            getOptionValue={(option) => `${option}`}
            options={monthList}
            onChange={(e) => updateSearchFormState("txtMonthFilter", e)}
          />
        </PageBar>
        {isLoadingPageData ? <Loader /> : null}
        <div className={BizClass.SummaryBoard}>
          {satatusCount && satatusCount.length > 0 ? (
            satatusCount.map((x) => {
              return (
                <div className={BizClass.ScoreBoard}>
                  <span>{x.STATUS}</span>
                  <span>{x.Total}</span>
                </div>
              );
            })
          ) : (
            <>
              <div className={BizClass.ScoreBoard}>
                <span>Registered</span>
                <span>0</span>
              </div>
              <div className={BizClass.ScoreBoard}>
                <span>Pending</span>
                <span>0</span>
              </div>
              <div className={BizClass.ScoreBoard}>
                <span>Scheduled</span>
                <span>0</span>
              </div>
              <div className={BizClass.ScoreBoard}>
                <span>Re-Scheduled</span>
                <span>0</span>
              </div>
              <div className={BizClass.ScoreBoard}>
                <span>Appointment</span>
                <span>0</span>
              </div>
              {/* <div className={BizClass.ScoreBoard}>
                <span>Cancel</span>
                <span>0</span>
              </div> */}
            </>
          )}
        </div>
        <div className={BizClass.ChartBoxTable}>
          <div className={BizClass.ChartTable}>
            <div className={BizClass.ChartHeadBoxTable}>
              <h4>Appointments by States</h4>
            </div>
            <table className={BizClass.table_bordered}>
              <thead>
                <tr>{stateHeaderColumn && stateHeaderColumn.length > 0 && stateHeaderColumn.map((val) => <th>{val}</th>)}</tr>
              </thead>
              <tbody>
                {stateAppointmentsByState &&
                  stateAppointmentsByState.length > 0 &&
                  stateAppointmentsByState.map((row, index) => (
                    <tr key={index}>
                      <td>{row.Status}</td>
                      {stateHeaderColumn && stateHeaderColumn.length > 0 && stateHeaderColumn.map((myval, i) => (i === 0 ? null : <td>{row[`${myval}`]}</td>))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={BizClass.ChartBox}>
          <div className={BizClass.Chart}>
            <div className={BizClass.ChartHeadBox}>
              <h4>Appointments Pending & Scheduled</h4>
              <ul style={{ display: "none" }}>
                <li>Year</li>
                <li>Month</li>
                <li className={BizClass.active}>Week</li>
              </ul>
            </div>
            {Object.keys(state2).length === 0 ? null : <Chart options={state2.options} series={state2.series} type="line" height={280} />}
          </div>
          <div className={BizClass.Chart}>
            <div className={BizClass.ChartHeadBox}>
              <h4>Daily Appointments Activity</h4>
              <ul style={{ display: "none" }}>
                <li>Year</li>
                <li>Month</li>
                <li className={BizClass.active}>Week</li>
              </ul>
            </div>
            {Object.keys(state).length === 0 ? null : <Chart options={state.options} series={state.series} type="bar" height={260} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
