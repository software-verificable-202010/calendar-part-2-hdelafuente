const moment = require('moment');
const weekView = require('./week-view');

let monthViewButton = document.querySelector("#month-view-btn");
const pathToMonthView = "src/views/month-view.html";
const monthStringWidth = 2;
let today = moment(new Date());
let currentMonth = weekView.pad(parseInt(today.format("MM")) + 1, monthStringWidth, '0');
let currentYear = today.format("YYYY");
let daysShortNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let daysNames = ["Hour", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let oneAM = 1;
let elevenPM = 24;

module.exports = {
  monthViewButton,
  pathToMonthView,
  monthStringWidth,
  today,
  currentMonth,
  currentYear,
  daysShortNames,
  daysNames,
  oneAM,
  elevenPM
}
