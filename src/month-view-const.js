const electron = require("electron");
var api = require("./db/db");
const { ipcRenderer } = electron;
const pathToWeekView = "src/views/week-view.html";
const monthView = require("./month-view");

let nextMonthButton = document.querySelector("#next-btn");
let prevMonthButton = document.querySelector("#prev-btn");
let closeEventButton = document.getElementById("hide-event");
let weekViewButton = document.querySelector("#week-view-btn");


let eventContainerElement = document.getElementById("event-details-container");
let eventDetailsHeader = document.getElementById("event-details-header");
let eventDetailsTitle = document.getElementById("event-details-title");
let eventDetailsText = document.getElementById("event-details-text");
let eventDetailsFooter = document.getElementById("event-details-footer");
let eventDetailsBodyElement = document.getElementById("event-details-body");

let eventDetailsElements = {
  eventContainerElement: eventContainerElement,
  eventDetailsHeader: eventDetailsHeader,
  eventDetailsText: eventDetailsText,
  eventDetailsFooter: eventDetailsFooter,
  eventDetailsBodyElement: eventDetailsBodyElement,
  eventDetailsTitle: eventDetailsTitle
}

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

/*
ipcRenderer.on("event:add", (e, event) => {
  if (event.error) {
    let alertDiv = document.querySelector("#alert-div");
    alertDiv.innerHTML = event.error;
  } else {
    createEvent(api.db, event);
    monthView.showCalendar(currentMonth, currentYear);
  }
})
*/

function pad(n, width, z) {
  z = z || '0';
  n = String(n);
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function formatDate(date) {
  let month = date.getMonth();
  let year = date.getFullYear();
  let day = date.getDate();
  let dateString = `${year}-${pad(month, 2, '0')}-${pad(day, 2, '0')}`;
  return dateString;
}

function createEvent(db, event) {
  ipcRenderer.invoke("user:get-props").then((response) => {
    api.createEvent(db, event, response.id);
    monthView.insertEventInCell(db, currentMonth, response.id);
  })
}

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
  formatDate,
  createEvent,
  eventDetailsBodyElement,
  eventContainerElement,
  eventDetailsFooter,
  eventDetailsHeader,
  eventDetailsText,
  eventDetailsTitle,
  eventDetailsElements
}