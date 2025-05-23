import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useState, useEffect } from "react";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { getDashBoardInsuranceCompData } from "../Service/Method";

function InsuranceCompLogics() {
  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");

  const [isLoadingPageDataInsuranceComp, setIsLoadingPageDataInsuranceComp] = useState(false);

  const [satatusCountInsuranceComp, setSatatusCount] = useState({});
  const [isLoadingChartSatatusCountData, setIsLoadingChartSatatusCountData] = useState(false);
  const [totalSatatusCountInsuranceComp, settotalSatatusCount] = useState(0);
  const getChartSatatusCountDataInsuranceComp = async (pfilterID, pLoginID, pMasterName) => {
    try {
      setIsLoadingChartSatatusCountData(true);
      const formdata = {
        filterID: pfilterID,
        filterID1: 0,
        filterID2: "",
        userID: pLoginID,
        masterName: pMasterName,
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDashBoardInsuranceCompData(formdata);
      console.log(result);
      setIsLoadingChartSatatusCountData(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.dashboard && result.response.responseData.dashboard.length > 0) {
          setSatatusCount(result.response.responseData.dashboard);
          let totalStsCnt = 0;

          const jsonStatusCnt = { Open: "0", InProgress: "0", ResolvedGrievance: "0", ResolvedInformation: "0", ReOpen: "0" };

          result.response.responseData.dashboard.forEach((v) => {
            if (v.TicketStatus === "Open") {
              jsonStatusCnt.Open = v.Total;
            }
            if (v.TicketStatus === "In-Progress") {
              jsonStatusCnt.InProgress = v.Total;
            }
            if (v.TicketStatus === "Re-Open") {
              jsonStatusCnt.ReOpen = v.Total;
            }
            if (v.TicketStatus === "Resolved(Grievance)") {
              jsonStatusCnt.ResolvedGrievance = v.Total;
            }
            if (v.TicketStatus === "Resolved(Information)") {
              jsonStatusCnt.ResolvedInformation = v.Total;
            }
            totalStsCnt += v.Total;
          });
          settotalSatatusCount(totalStsCnt);
          setSatatusCount([jsonStatusCnt]);
        } else {
          setSatatusCount([]);
          settotalSatatusCount(0);
        }
      } else {
        setSatatusCount([]);
        settotalSatatusCount(0);
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: " Something went Wrong! Error Code :442",
      });
    }
  };

  const [state4InsuranceComp, setstate4] = useState({});
  const [isLoadingChartCategoryWiseData, setIsLoadingChartCategoryWiseData] = useState(false);
  const getChartCategoryWiseDataInsuranceComp = async (pfilterID, pLoginID, pMasterName) => {
    try {
      setIsLoadingChartCategoryWiseData(true);
      const formdata = {
        filterID: pfilterID,
        filterID1: 0,
        filterID2: "",
        userID: pLoginID,
        masterName: pMasterName,
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDashBoardInsuranceCompData(formdata);
      setIsLoadingChartCategoryWiseData(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.dashboard && result.response.responseData.dashboard.length > 0) {
          const pCategoryWise = [];
          const pcategories = [];
          result.response.responseData.dashboard.forEach((v) => {
            pcategories.push(v.SupportTicketTypeName);
            pCategoryWise.push(v.CategoryWise);
          });
          const jsonstate4 = {
            series: pCategoryWise,
            options: {
              chart: {
                type: "pie",
                toolbar: {
                  export: {
                    csv: {
                      filename: "Ticket Category Wise(Grievence)",
                    },
                    svg: {
                      filename: "Ticket Category Wise(Grievence)",
                    },
                    png: {
                      filename: "Ticket Category Wise(Grievence)",
                    },
                  },
                },
              },
              labels: pcategories,
              stroke: {
                colors: ["#fff"],
              },
              fill: {
                opacity: 0.8,
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200,
                    },
                    legend: {
                      position: "bottom",
                    },
                  },
                },
              ],
            },
          };
          setstate4(jsonstate4);
          console.log(state4InsuranceComp);
        } else {
          setstate4({});
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
        message: " Something went Wrong! Error Code :442",
      });
    }
  };

  const [state3InsuranceComp, setstate3] = useState({});
  const [isLoadingChartInsuranceCompanyData, setIsLoadingChartInsuranceCompanyData] = useState(false);
  const getChartInsuranceCompanyDataInsuranceComp = async (pfilterID, pLoginID, pMasterName) => {
    try {
      setIsLoadingChartInsuranceCompanyData(true);
      const formdata = {
        filterID: pfilterID,
        filterID1: 0,
        filterID2: "",
        userID: pLoginID,
        masterName: pMasterName,
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDashBoardInsuranceCompData(formdata);
      setIsLoadingChartInsuranceCompanyData(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.dashboard && result.response.responseData.dashboard.length > 0) {
          const pcategories = [];
          const popenData = [];
          const pcloseData = [];
          result.response.responseData.dashboard.forEach((v) => {
            pcategories.push(v.InsuranceMasterName);
            popenData.push(v.openTicket);
            pcloseData.push(v.closeTicket);
          });
          const josnstate3 = {
            series: [
              {
                name: "Open",
                data: popenData,
              },
              {
                name: "Resolved",
                data: pcloseData,
              },
            ],
            options: {
              chart: {
                type: "bar",
                height: 430,
                stacked: true,
                toolbar: {
                  export: {
                    csv: {
                      filename: "Tickets by Insurance Companies",
                    },
                    svg: {
                      filename: "Tickets by Insurance Companies",
                    },
                    png: {
                      filename: "Tickets by Insurance Companies",
                    },
                  },
                },
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                  dataLabels: {
                    position: "top",
                  },
                },
              },
              dataLabels: {
                enabled: true,
                offsetX: -6,
                style: {
                  fontSize: "12px",
                  colors: ["#fff"],
                },
              },
              stroke: {
                show: true,
                width: -1,
                colors: ["#fff"],
              },
              tooltip: {
                shared: true,
                intersect: false,
              },
              xaxis: {
                categories: pcategories,
              },
            },
          };
          setstate3(josnstate3);
          console.log(state3InsuranceComp);
        } else {
          setstate3({});
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
        message: " Something went Wrong! Error Code :442",
      });
    }
  };

  const [stateInsuranceComp, setstate] = useState({});
  const [isLoadingChartDailyTicketsActivityData, setIsLoadingChartDailyTicketsActivityData] = useState(false);
  const getChartDailyTicketsActivityDataInsuranceComp = async (pfilterID, pLoginID, pMasterName) => {
    try {
      setIsLoadingChartDailyTicketsActivityData(true);
      const formdata = {
        filterID: pfilterID,
        filterID1: 0,
        filterID2: "",
        userID: pLoginID,
        masterName: pMasterName,
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDashBoardInsuranceCompData(formdata);
      setIsLoadingChartDailyTicketsActivityData(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.dashboard && result.response.responseData.dashboard.length > 0) {
          const pCateogires = [];
          const pseriesOpen = { name: "", data: [] };
          const pseriesInProgress = { name: "", data: [] };
          const pseriesReOpen = { name: "", data: [] };
          const pseriesResolved = { name: "", data: [] };

          result.response.responseData.dashboard.forEach((v) => {
            pCateogires.push(v.Duration);
            pseriesOpen.name = "Open";
            pseriesOpen.data.push(v.Opens);

            pseriesInProgress.name = "In-Progess";
            pseriesInProgress.data.push(v.InProgress);

            pseriesReOpen.name = "Re-Open";
            pseriesReOpen.data.push(v.Reopen);

            pseriesResolved.name = "Resolved";
            pseriesResolved.data.push(v.Resolved);
          });
          const josnstate = {
            series: [pseriesOpen, pseriesInProgress, pseriesReOpen, pseriesResolved],
            options: {
              chart: {
                type: "bar",
                height: 350,
                stacked: true,
                toolbar: {
                  export: {
                    csv: {
                      filename: "Daily Tickets Activity",
                    },
                    svg: {
                      filename: "Daily Tickets Activity",
                    },
                    png: {
                      filename: "Daily Tickets Activity",
                    },
                  },
                },
                zoom: {
                  enabled: true,
                },
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: "100%",
                  endingShape: "rounded",
                },
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
              },
              xaxis: {
                categories: pCateogires,
              },
              yaxis: {
                title: {
                  text: "",
                },
              },
              fill: {
                opacity: 1,
              },
            },
          };
          setstate(josnstate);
          console.log(stateInsuranceComp);
        } else {
          setstate({});
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
        message: " Something went Wrong! Error Code :442",
      });
    }
  };

  const [state2InsuranceComp, setstate2] = useState({});
  const [isLoadingChartLastMonthData, setIsLoadingChartLastMonthData] = useState(false);
  const getChartLastMonthDataInsuranceComp = async (pfilterID, pLoginID, pMasterName) => {
    try {
      setIsLoadingChartLastMonthData(true);
      const formdata = {
        filterID: pfilterID,
        filterID1: 0,
        filterID2: "",
        userID: pLoginID,
        masterName: pMasterName,
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getDashBoardInsuranceCompData(formdata);
      setIsLoadingChartLastMonthData(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.dashboard && result.response.responseData.dashboard.length > 0) {
          const pCateogires = [];
          const pseriesOpen = { name: "", data: [] };
          const pseriesResolved = { name: "", data: [] };

          result.response.responseData.dashboard.forEach((v) => {
            pCateogires.push(v.Duration);
            pseriesOpen.name = "Open";
            pseriesOpen.data.push(v.Opens);

            pseriesResolved.name = "Resolved";
            pseriesResolved.data.push(v.Resolved);
          });
          const josnstate2 = {
            series: [pseriesOpen, pseriesResolved],
            options: {
              chart: {
                height: 350,
                type: "line",
                toolbar: {
                  export: {
                    csv: {
                      filename: "Tickets Open And Resolved",
                    },
                    svg: {
                      filename: "Tickets Open And Resolved",
                    },
                    png: {
                      filename: "Tickets Open And Resolved",
                    },
                  },
                },
                zoom: {
                  enabled: false,
                },
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                width: [5, 7, 5],
                curve: "straight",
                dashArray: [0, 8, 5],
              },
              markers: {
                size: 0,
                hover: {
                  sizeOffset: 6,
                },
              },
              xaxis: {
                categories: pCateogires,
              },
              grid: {
                borderColor: "#f1f1f1",
              },
            },
          };
          setstate2(josnstate2);
          console.log(state2InsuranceComp);
        } else {
          setstate2({});
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
        message: " Something went Wrong! Error Code :442",
      });
    }
  };

  useEffect(() => {
    setIsLoadingPageDataInsuranceComp(true);
    const timeOutHandler = setTimeout(() => {
      setIsLoadingPageDataInsuranceComp(false);
    }, 1000);
    getChartSatatusCountDataInsuranceComp(1, userData && userData.LoginID ? userData.LoginID : 0, "BYMAIN");
    getChartCategoryWiseDataInsuranceComp(2, userData && userData.LoginID ? userData.LoginID : 0, "BYCTZ");
    getChartInsuranceCompanyDataInsuranceComp(1, userData && userData.LoginID ? userData.LoginID : 0, "BYINS");
    getChartDailyTicketsActivityDataInsuranceComp(1, userData && userData.LoginID ? userData.LoginID : 0, "BYSTS");
    getChartLastMonthDataInsuranceComp(2, userData && userData.LoginID ? userData.LoginID : 0, "BYDUR");

    return () => clearTimeout(timeOutHandler);
  }, []);

  return {
    isLoadingChartCategoryWiseData,
    isLoadingChartInsuranceCompanyData,
    stateInsuranceComp,
    state2InsuranceComp,
    // Anil state3InsuranceComp,
    state4InsuranceComp,
    isLoadingChartDailyTicketsActivityData,
    isLoadingChartLastMonthData,
    setIsLoadingPageDataInsuranceComp,
    satatusCountInsuranceComp,
    isLoadingChartSatatusCountData,
    isLoadingPageDataInsuranceComp,
    totalSatatusCountInsuranceComp,
  };
}

export default InsuranceCompLogics;
