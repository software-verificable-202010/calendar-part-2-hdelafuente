/* eslint-disable no-param-reassign */
const electron = require("electron");
const moment = require("moment");
const { ipcRenderer } = electron;
const pathToMonthView = "src/views/month-view.html";
const monthStringWidth = 2
let today = moment(new Date());
let currentMonth = pad(parseInt(today.format("MM")) + 1, monthStringWidth, '0');
let currentYear = today.format("YYYY");
let daysShortNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let daysNames = ["Hour", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let oneAM = 1;
let elevenPM = 24;
let hourRange = hourRangeContructor(oneAM, elevenPM);
let dateRange = dateRangeConstructor(today, currentMonth, currentYear);

showWeek();

function showWeek() {
    addNavigationEventListeners();
    let monthAndYear = document.querySelector("#monthAndYear");
    let weekTableHead = document.querySelector("#week-table-head");
    let weekTableBody = document.querySelector("#week-table-body");
    cleanHaderInnerHtml(monthAndYear, weekTableHead, weekTableBody);
    fillTableHead(weekTableHead, dateRange);
    fillTableBody(weekTableBody);
}

/*
 * Week calendar constructors (table body, head, etc...)
*/
function addNavigationEventListeners() {
    let nextWeek = document.querySelector("#next-week");
    let previousWeek = document.querySelector("#previous-week");
    nextWeek.addEventListener("click", () => {
        goToNextWeek();
    })
    previousWeek.addEventListener("click", () => {
        goToPreviousWeek();
    })
}

function cleanHaderInnerHtml(monthAndYear, tableHead, tableBody) {
    monthAndYear.innerHTML = "";
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";
}

function fillTableHead(weekTableHead, dateRange) {
    let weekDaysRowElement = document.createElement("tr");
    daysNames.map((day, i) => {
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
        daysShortNames.map((day) => {
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

function goToNextWeek() {
    today = moment(new Date(today.add(7, 'days')));
    console.log(today);
    dateRange = dateRangeConstructor(today);
    console.log(dateRange);
    showWeek();
}

function goToPreviousWeek() {
    today = moment(new Date(today.subtract(7, 'days')));
    console.log(today);
    dateRange = dateRangeConstructor(today);
    console.log(dateRange);
    showWeek();
}

function hourRangeContructor(lower, upper) {
    let range = [];
    for (let i = lower; i < upper; i++) {
        range.push(i);
    }
    return range;
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

function pad(n, width, z) {
    z = z || '0';
    n = String(n);
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


/*
 * Events from ipcRenderer
*/
ipcRenderer.on("view:week", function (e, props) {
    today = props.today;
    currentMonth = props.currentMonth;
    currentYear = props.currentYear;
    console.log(today, currentMonth, currentYear);
})

let monthViewButton = document.querySelector("#month-view-btn");
monthViewButton.addEventListener("click", () => {
    goToView(pathToMonthView);
})

// App event in which the week view is shown
function goToView(path) {
    ipcRenderer.send("view:week", {
        path: path,
        today: today,
        currentMonth: currentMonth,
        currentYear: currentYear
    });
}