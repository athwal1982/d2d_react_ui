import moment from "moment";

export const dateFormat = (date) => {
  try {
    const d = new Date(date);
    const convertedDate = moment(d).format("MMM, DD YYYY");
    return convertedDate;
  } catch {
    return "";
  }
};

export const dateFormatDefault = (date) => {
  try {
    const d = new Date(date);
    const convertedDate = moment(d).format("MM/DD/YYYY");
    return convertedDate;
  } catch {
    return "";
  }
};
export const dateFormatDDMMYY = (date) => {
  try {
    const d = new Date(date);
    const convertedDate = moment(d).format("DD-MM-YYYY");
    return convertedDate;
  } catch {
    return "";
  }
};

export const daysdifference = (firstDate, secondDate) => {
  const startDay = new Date(firstDate);
  const endDay = new Date(secondDate);

  const millisBetween = startDay.getTime() - endDay.getTime();

  const days = millisBetween / (1000 * 3600 * 24);

  return Math.round(Math.abs(days));
};

export const tConvert = (time) => {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) {
    time = time.slice(1);
    time[5] = +time[0] < 12 ? " AM" : " PM";
    time[0] = +time[0] % 12 || 12;
  }
  return time.join("");
};

export const dateToCompanyFormat = (date) => {
  try {
    const format = "yyyy-MM-dd".toUpperCase();
    const d = new Date(date);
    const convertedDate = moment(d).format(format);
    return convertedDate;
  } catch {
    return "";
  }
};

export const dateToSpecificFormat = (date, format) => {
  try {
    const d = new Date(date);
    const convertedDate = moment(d).format(format);
    return convertedDate;
  } catch {
    return null;
  }
};

export const Convert24FourHourAndMinute = (timeString) => {
  const [hour, minute] = timeString.split(":");
  const formattedHour = Number(hour);
  return `${formattedHour}:${minute}`;
};
export const getCurrentDateTimeTick = () => {
  const DateTime = new Date();
  // A get current date
  // A adjust 0 before single digit date
  const curdate = `0${DateTime.getDate()}`.slice(-2);
  // A get current month
  const curmonth = `0${DateTime.getMonth() + 1}`.slice(-2);
  // A get current year
  const curyear = DateTime.getFullYear();
  // A get current hours
  const curhours = DateTime.getHours();
  // A get current minutes
  const curminutes = DateTime.getMinutes();
  // A  get current seconds
  const curseconds = DateTime.getSeconds();

  const varunique = curyear + curmonth + curdate + curhours + curminutes + curseconds;
  return varunique;
};
