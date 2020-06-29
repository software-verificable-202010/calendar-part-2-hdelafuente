const pathToWeekView = "src/views/week-view.html";

let nextMonthButton = document.querySelector("#next-btn");
let prevMonthButton = document.querySelector("#prev-btn");
let closeEventButton = document.getElementById("hide-event");
let weekViewButton = document.querySelector("#week-view-btn");

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let okStatus = 0;
let errorStatus = 1;


let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

let daysShortNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let monthAndYear = document.getElementById("monthAndYear");
let januaryNumber = 0;
let decemberNumber = 11;


module.exports = {
  nextMonthButton,
  prevMonthButton,
  closeEventButton,
  weekViewButton,
  pathToWeekView,
  today,
  currentMonth,
  currentYear,
  okStatus,
  errorStatus,
  months,
  daysShortNames,
  monthAndYear,
  januaryNumber,
  decemberNumber,
  weekViewButton
}