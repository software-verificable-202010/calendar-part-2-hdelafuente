const electron = require("electron");
// var mysql = require("mysql");
var moment = require("moment");
const { ipcRenderer } = electron;
const pathToMonthView = "src/views/month-view.html";
let today = moment();
let currentMonth = today.format("MM");
let currentYear = today.format("YYYY");
let daysShortNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let daysNames = ["Hour", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let oneAM = 1;
let elevenPM = 24;
let hourRange = hourRangeConstructor(oneAM, elevenPM);
let dateRange = dateRangeConstructor(today);

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
    console.log(dateRange);
    let weekDaysRowElement = document.createElement("tr");
    daysNames.map((day, i) => {
        const insertHeaderElement = document.createElement("th");
        const dayNameText = document.createTextNode(day);
        insertHeaderElement.appendChild(dayNameText);
        if (day !== "Hour") {
            const dayDateText = document.createTextNode("(" + dateRange[i - 1] + ")");
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
            if (day === "Sun" || day === "Sat") {
                temporalElement.classList.add("weekend-bg");
            }
            // TODO: Insert events
            tableRowElement.appendChild(temporalElement);
        });
        weekTableBody.appendChild(tableRowElement);
    });
}

function hourRangeConstructor(lower, upper) {
    let range = [];
    for (let i = lower; i < upper; i++) {
        range.push(i);
    }
    return range;
}

function dateRangeConstructor(today) {
    let week = [];

    let monday = today.startOf('week');
    week.push(monday.format("YYYY-MM-DD"));

    for (let i = 1; i < 7; i++) {
        week.push(monday.add(i, 'days').format("YYYY-MM-DD"));
    }
    return week;
}

function goToNextWeek() {
    today = new Date(today.add(7, 'days').format("YYYY-MM-DD"));
    dateRange = dateRangeConstructor(today);
    showWeek();
}

function goToPreviousWeek() {
    today = new Date(today.subtract(7, 'days').format("YYYY-MM-DD"));
    dateRange = dateRangeConstructor(today);
    showWeek();
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