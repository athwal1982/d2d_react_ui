import React from "react";
// A import Chart from "react-apexcharts";
import { Loader } from "Framework/Components/Widgets";
import BizClass from "./Home.module.scss";
import InsuranceCompLogics from "../Logic/InsuranceCompLogic";

function InsuranceCompHome() {
  const {
    // Anil state3InsuranceComp,
    // Anil state4InsuranceComp,
    // Anil state2InsuranceComp,
    // Anil stateInsuranceComp,
    // Anil satatusCountInsuranceComp,
    isLoadingPageDataInsuranceComp,
    // Anil totalSatatusCountInsuranceComp,
  } = InsuranceCompLogics();

  return (
    <div className={BizClass.Box}>
      {isLoadingPageDataInsuranceComp ? <Loader /> : null}
      {/* <div className={BizClass.SummaryBoard}>
        <div className={BizClass.ScoreBoard}>
          <span>Open</span>
          <span>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].Open : 0}</span>
        </div>
        <div className={BizClass.ScoreBoard}>
          <span>In-Progress</span>
          <span>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].InProgress : 0}</span>
        </div>
        <div className={BizClass.ScoreBoard}>
          <span>Resolved(Grievance)</span>
          <span>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].ResolvedGrievance : 0}</span>
        </div>
        <div className={BizClass.ScoreBoard}>
          <span>Resolved(Information)</span>
          <span>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].ResolvedInformation : 0}</span>
        </div>
        <div className={BizClass.ScoreBoard}>
          <span>Re-Open</span>
          <span>{satatusCountInsuranceComp && satatusCountInsuranceComp.length > 0 ? satatusCountInsuranceComp[0].ReOpen : 0}</span>
        </div>
        <div className={BizClass.ScoreBoard}>
          <span>Total</span>
          <span>{totalSatatusCountInsuranceComp}</span>
        </div>
      </div> */}
      <div className={BizClass.ChartBox}>
        {/* <div className={BizClass.Chart}>
          <div className={BizClass.ChartHeadBox} style={{ display: "none" }}>
            <h4>Tickets by Insurance Companies</h4>
            <ul>
              <li className={BizClass.active}>Chart</li>
            </ul>
          </div>
          {Object.keys(state3InsuranceComp).length === 0 ? null : (
            <Chart options={state3InsuranceComp.options} series={state3InsuranceComp.series} type="bar" height={520} style={{ display: "none" }} />
          )}
        </div> */}
        {/* <div className={BizClass.Chart}>
          <div className={BizClass.ChartHeadBox}>
            <h4>Tickets Open & Resolved</h4>
            <ul style={{ display: "none" }}>
              <li>Year</li>
              <li>Month</li>
              <li className={BizClass.active}>Week</li>
            </ul>
          </div>
          {Object.keys(state2InsuranceComp).length === 0 ? null : (
            <Chart options={state2InsuranceComp.options} series={state2InsuranceComp.series} type="line" height={260} />
          )}
        </div>
        <div className={BizClass.Chart}>
          <div className={BizClass.ChartHeadBox}>
            <h4>Ticket Category Wise(Grievence)</h4>
            <ul>
              <li className={BizClass.active}>Chart</li>
            </ul>
          </div>
          {Object.keys(state4InsuranceComp).length === 0 ? null : (
            <Chart options={state4InsuranceComp.options} series={state4InsuranceComp.series} type="pie" height={300} />
          )}
        </div>
        <div className={BizClass.Chart}>
          <div className={BizClass.ChartHeadBox}>
            <h4>Daily Tickets Activity</h4>
            <ul style={{ display: "none" }}>
              <li>Year</li>
              <li>Month</li>
              <li className={BizClass.active}>Week</li>
            </ul>
          </div>
          {Object.keys(stateInsuranceComp).length === 0 ? null : (
            <Chart options={stateInsuranceComp.options} series={stateInsuranceComp.series} type="bar" height={260} />
          )}
        </div> */}
      </div>
    </div>
  );
}

export default InsuranceCompHome;
