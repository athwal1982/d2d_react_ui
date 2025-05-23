import { useState, useEffect } from "react";
import { getSessionStorage } from "Components/Common/Login/Auth/auth";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { getDashBoardReportData } from "../Service/Method";

function HomeLogics() {
  const setAlertMessage = AlertMessage();
  const userData = getSessionStorage("user");

  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState({});
  const toggleResetPasswordModal = () => {
    setResetPasswordModal(!resetPasswordModal);
    setSelectedUserData({ AppAccessID: userData.LoginID });
  };

  const BindTableHeader = (jsondata) => {
    const columnSet = [];
    jsondata.forEach((rowHash) => {
      Object.keys(rowHash).forEach((key) => {
        if (!columnSet.includes(key)) {
          // Checking if the key is already in the array
          columnSet.push(key);
        }
      });
    });
    return columnSet;
  };

  const [isLoadingPageData, setIsLoadingPageData] = useState(false);
  const [state2, setstate2] = useState({});

  const [state, setstate] = useState({});
  const [satatusCount, setsatatusCount] = useState({});
  const [stateAppointmentsByState, setstateAppointmentsByState] = useState([]);
  const [stateHeaderColumn, setstateHeaderColumn] = useState([]);
  const getChartDashboardData = async (formattedStartDate, formattedEndDate) => {
    debugger;
    try {
      const formdata = {
        viewMode: "",
        requestorMobileNo: "",
        statusID: 1,
        fromdate: formattedStartDate,
        toDate: formattedEndDate,
        userID: userData && userData.LoginID ? userData.LoginID : 0,
        stateID: 0,
      };
      debugger;
      setIsLoadingPageData(true);
      const result = await getDashBoardReportData(formdata);
      setIsLoadingPageData(false);
      if (result.response.responseCode === 1) {
        if (result.response.responseData) {
          // A Header Counter
          if (result.response.responseData.dashbard) {
            setsatatusCount(result.response.responseData.dashbard);
          } else {
            setsatatusCount([]);
          }
          // A Chart for Appointments by States
          if (result.response.responseData.records) {
            // Initialize an empty object to hold the results
            const resultconverted = {};

            // Loop through each state data
            result.response.responseData.records.forEach((state) => {
              Object.keys(state).forEach((key) => {
                // Skip StateMasterName key as it's already used as column headers
                if (key !== "StateMasterName" && key !== "StateCode") {
                  // Initialize the result object for each metric if it doesn't exist
                  if (!resultconverted[key]) {
                    resultconverted[key] = {};
                  }
                  // Add the value for each state under the metric
                  resultconverted[key][state.StateMasterName] = state[key];
                }
              });
            });

            // Convert the result object to a more user-friendly format
            const finalResult = Object.keys(resultconverted).map((key) => {
              const obj = { Status: key };
              Object.keys(resultconverted[key]).forEach((state) => {
                obj[state] = resultconverted[key][state];
              });
              return obj;
            });
            const columns = BindTableHeader(finalResult);
            setstateHeaderColumn(columns);
            setstateAppointmentsByState(finalResult);
          } else {
            setstateAppointmentsByState([]);
          }
          // A Chart for Appointments Pending & Scheduled
          if (result.response.responseData.records1) {
            const pCateogires = [];
            const pseriesPending = { name: "", data: [] };
            const pseriesScheduled = { name: "", data: [] };

            result.response.responseData.records1.forEach((v) => {
              pCateogires.push(v.InsertDateTime);
              pseriesPending.name = "Pending";
              pseriesPending.data.push(v.Pending);

              pseriesScheduled.name = "Scheduled";
              pseriesScheduled.data.push(v.Scheduled);
            });

            const josnstate2 = {
              series: [pseriesPending, pseriesScheduled],
              options: {
                chart: {
                  height: 350,
                  type: "line",
                  toolbar: {
                    export: {
                      csv: {
                        filename: "Appointments Pending And Scheduled",
                      },
                      svg: {
                        filename: "Appointments Pending And Scheduled",
                      },
                      png: {
                        filename: "Appointments Pending And Scheduled",
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
          } else {
            setstate2({});
          }
          // A Chart for Daily Appointments Activity
          if (result.response.responseData.records1) {
            const pCateogires = [];
            const pseriesPending = { name: "", data: [] };
            const pseriesScheduled = { name: "", data: [] };
            const pseriesRescheduled = { name: "", data: [] };

            result.response.responseData.records1.forEach((v) => {
              pCateogires.push(v.InsertDateTime);
              pseriesPending.name = "Pending";
              pseriesPending.data.push(v.Pending);

              pseriesScheduled.name = "Scheduled";
              pseriesScheduled.data.push(v.Scheduled);

              pseriesRescheduled.name = "Re-Scheduled";
              pseriesRescheduled.data.push(v.ReScheduled);
            });

            const josnstate = {
              series: [pseriesPending, pseriesScheduled, pseriesRescheduled],
              options: {
                chart: {
                  type: "bar",
                  height: 350,
                  stacked: true,
                  toolbar: {
                    export: {
                      csv: {
                        filename: "Daily Appointments Activity",
                      },
                      svg: {
                        filename: "Daily Appointments Activity",
                      },
                      png: {
                        filename: "Daily Appointments Activity",
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
          } else {
            setstate({});
          }
        } else {
          setstate({});
          setstate2({});
          setstateAppointmentsByState([]);
          setsatatusCount([]);
        }
      } else if (result.response.responseCode !== 1) {
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

  const [monthList] = useState([
    { label: "Jan", value: 1 },
    { label: "Feb", value: 2 },
    { label: "Mar", value: 3 },
    { label: "Apr", value: 4 },
    { label: "May", value: 5 },
    { label: "Jun", value: 6 },
    { label: "Jul", value: 7 },
    { label: "Aug", value: 8 },
    { label: "Sep", value: 9 },
    { label: "Oct", value: 10 },
    { label: "Nov", value: 11 },
    { label: "Dec", value: 12 },
  ]);
  const [yearList, setYearList] = useState([]);

  const ClearFormData = () => {};

  const [searchFormValues, setSearchFormValues] = useState({
    txtYearFilter: null,
    txtMonthFilter: null,
    txtInsuranceCompany: null,
  });
  const updateSearchFormState = (name, value) => {
    debugger;
    setSearchFormValues({ ...searchFormValues, [name]: value });

    if (name === "txtMonthFilter") {
      if (searchFormValues.txtYearFilter === null) {
        setAlertMessage({
          type: "error",
          message: "Please select a year before choosing a month.",
        });
        return;
      }
    }

    if (name === "txtMonthFilter") {
      setSearchFormValues({
        ...searchFormValues,
        txtMonthFilter: value,
      });
      if (value) {
        const year = searchFormValues.txtYearFilter.value;
        const month = value.value;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(
          2,
          "0",
        )}`;
        const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
        getChartDashboardData(formattedStartDate, formattedEndDate);
      }
    }
    if (name === "txtYearFilter") {
      setSearchFormValues({
        ...searchFormValues,
        txtYearFilter: value,
      });

      if (value) {
        if (searchFormValues.txtMonthFilter !== null) {
          const month = searchFormValues.txtMonthFilter.value;
          const year = value.value;
          const startDate = new Date(year, month - 1, 1);
          const endDate = new Date(year, month, 0);
          const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(
            2,
            "0",
          )}`;
          const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
          getChartDashboardData(formattedStartDate, formattedEndDate);
        }
      } else {
        ClearFormData();
      }
    }
  };

  useEffect(() => {
    debugger;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    for (let i = 0; i <= monthList.length; i += 1) {
      if (monthList[i].value === currentMonth) {
        setSearchFormValues({
          ...searchFormValues,
          txtYearFilter: { label: currentYear.toString(), value: currentYear.toString() },
          txtMonthFilter: { label: monthList[i].label, value: monthList[i].value },
        });
        break;
      }
    }

    const yearArray = [];
    for (let i = 2023; i <= currentYear; i += 1) {
      yearArray.push({ label: i.toString(), value: i.toString() });
    }
    setYearList(yearArray.sort().reverse());
    const pYear = { label: currentYear.toString(), value: currentYear.toString() };
    const pMonth = { label: monthList[currentMonth - 1].label, value: monthList[currentMonth - 1].value };
    const year = pYear.value;
    const month = pMonth.value;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(
      2,
      "0",
    )}`;
    const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
    getChartDashboardData(formattedStartDate, formattedEndDate);

    if (userData) {
      debugger;
      if (userData.FirstTimeLogin === "Y") {
        toggleResetPasswordModal();
      }
    }
  }, []);

  return {
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
  };
}

export default HomeLogics;
