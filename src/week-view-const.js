const moment = require('moment');
const electron = require('electron');
const { ipcRenderer } = electron;

let monthViewButton = document.querySelector('#month-view-btn');
const pathToMonthView = 'src/views/month-view.html';
const monthStringWidth = 2;
let today = moment(new Date());
let currentMonth = today.format('MM');
let currentYear = today.format('YYYY');
let daysShortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
let daysNames = ['Hour', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let oneAM = 1;
let elevenPM = 24;

let monthAndYear = document.querySelector('#monthAndYear');
let weekTableHead = document.querySelector('#week-table-head');
let weekTableBody = document.querySelector('#week-table-body');

let tableElements = {
  monthAndYear: monthAndYear,
  weekTableBody: weekTableBody,
  weekTableHead: weekTableHead
}

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
  elevenPM,
  monthAndYear,
  weekTableBody,
  weekTableHead,
  tableElements
}