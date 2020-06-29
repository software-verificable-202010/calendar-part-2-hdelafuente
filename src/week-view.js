/* eslint-disable no-param-reassign */
const electron = require("electron");
const { ipcRenderer } = electron;
const vars = require('./week-view-const');
let hourRange = hourRangeContructor(vars.oneAM, vars.elevenPM);
let dateRange = dateRangeConstructor(vars.today, vars.currentMonth, vars.currentYear);

/*
 * Week calendar constructors (table body, head, etc...)
*/
function addNavigationEventListeners() {
  let nextWeek = document.querySelector("#next-week");
  let previousWeek = document.querySelector("#previous-week");

  if (nextWeek === null || previousWeek === null) {
    return 1;
  }
  nextWeek.addEventListener("click", () => {
    goToNextWeek();
  })
  previousWeek.addEventListener("click", () => {
    goToPreviousWeek();
  })
  return 0;
}


function goToNextWeek() {
  vars.today.set('date', parseInt(vars.today.format("D")) + 7);
  console.log(vars.today);
  dateRange = dateRangeConstructor(vars.today);
  console.log(dateRange);
  showWeek();
}

function goToPreviousWeek() {
  vars.today = vars.today.subtract(7, 'days');
  console.log(vars.today);
  dateRange = dateRangeConstructor(vars.today);
  console.log(dateRange);
  showWeek();
}

function dateRangeConstructor(today) {
  let week = [];
  let monday = today.isoWeekday("Monday");
  week.push(monday.format("YYYY-MM-DD"));
  for (let i = 1; i < 7; i++) {
    const dateString = monday.add(1, "days");
    week.push(dateString.format("YYYY-MM-DD"));
  }
  return week;
}

function showWeek() {
  addNavigationEventListeners();
  let monthAndYear = document.querySelector("#monthAndYear");
  let weekTableHead = document.querySelector("#week-table-head");
  let weekTableBody = document.querySelector("#week-table-body");
  cleanHaderInnerHtml(monthAndYear, weekTableHead, weekTableBody);
  fillTableHead(weekTableHead, dateRange);
  fillTableBody(weekTableBody);
}


function cleanHaderInnerHtml(monthAndYear, tableHead, tableBody) {
  monthAndYear.innerHTML = "";
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";
}

function fillTableHead(weekTableHead, dateRange) {
  let weekDaysRowElement = document.createElement("tr");
  vars.daysNames.map((day, i) => {
    const insertHeaderElement = document.createElement("th");
    const dayNameText = document.createTextNode(day);
    insertHeaderElement.appendChild(dayNameText);
    if (day !== "Hour") {
      const dayDateText = document.createTextNode(dateRange[i - 1]);
      const lineBreak = document.createElement("br");
      insertHeaderElement.appendChild(lineBreak);
      insertHeaderElement.appendChild(dayDateText);
    }
    if (day === "Sunday" || day === "Saturday") {
      insertHeaderElement.classList.add("weekend-bg");
    }
    weekDaysRowElement.appendChild(insertHeaderElement);
  })
  weekTableHead.appendChild(weekDaysRowElement);
}

function fillTableBody(weekTableBody) {
  hourRange.map((hour) => {
    const tableRowElement = document.createElement("tr");
    const hourColumn = document.createElement("th");
    hourColumn.classList.add("th-hour-col");
    const hourEnd = ":00"
    const hourText = document.createTextNode(hour + hourEnd);
    hourColumn.appendChild(hourText);
    tableRowElement.appendChild(hourColumn);
    vars.daysShortNames.map((day) => {
      const temporalElement = document.createElement("td");
      // TODO: Add element id using dateRange and hourText
      if (day === "Sun" || day === "Sat") {
        temporalElement.classList.add("weekend-bg");
      }
      // TODO: Insert events
      tableRowElement.appendChild(temporalElement);
    });
    weekTableBody.appendChild(tableRowElement);
  });
}

function hourRangeContructor(lower, upper) {
  let range = [];
  for (let i = lower; i < upper; i++) {
    range.push(i);
  }
  return range;
}

function pad(n, width, z) {
  z = z || '0';
  n = String(n);
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


/*
* Events from ipcRenderer
*/
ipcRenderer.on("view:week", function (e, props) {
  vars.today = props.today;
  vars.currentMonth = props.currentMonth;
  vars.currentYear = props.currentYear;
})


// App event in which the week view is shown
function goToView(path) {
  ipcRenderer.send("view:week", {
    path: path,
    today: vars.today,
    currentMonth: vars.currentMonth,
    currentYear: vars.currentYear
  });
}

function addEventListeners() {
  vars.monthViewButton.addEventListener("click", () => {
    goToView(vars.pathToMonthView);
  })
}

addEventListeners();
showWeek();

module.exports = {
  hourRangeContructor,
  addNavigationEventListeners,
  goToView,
  pad
}