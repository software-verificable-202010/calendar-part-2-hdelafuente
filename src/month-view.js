/* eslint-disable init-declarations */
const electron = require("electron");
var mysql = require("mysql");
var moment = require("moment");
var api = require("./db/db");
/*
* Constants for this component
*/
const { ipcRenderer } = electron;
const pathToWeekView = "src/views/week-view.html";

let user;
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

/*
 * Events from ipcRenderer
*/
ipcRenderer.on("event:add", (e, event) => {
    if (event.error) {
        let alertDiv = document.querySelector("#alert-div");
        alertDiv.innerHTML = event.error;
    } else {
        createEvent(db, event);
        showCalendar(currentMonth, currentYear);
    }
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

let weekViewButton = document.querySelector("#week-view-btn");
weekViewButton.addEventListener("click", () => {
    goToView(pathToWeekView);
})

ipcRenderer.invoke("user:get-props").then((response) => {
    user = response;
})

let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "calendar",
});

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
* Navigation Functions
*/
function getNextMonth() {
    currentYear =
        currentMonth === decemberNumber ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % (decemberNumber + 1);
    showCalendar(currentMonth, currentYear);
}

function getPreviousMonth() {
    currentYear =
        currentMonth === januaryNumber ? currentYear - 1 : currentYear;
    currentMonth =
        currentMonth === januaryNumber ? decemberNumber : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function addWeekendBackground(domElement, dayIterator) {
    if (dayIterator % 7 === 0 || dayIterator % 6 === 0) {
        domElement.classList.add("weekend-bg");
    }
}

function fillCalendarTableHead(calendarTableHead) {
    calendarTableHead.innerHTML = ""; // clear the head for month navigation
    let weekDaysRowElement = document.createElement("tr");

    for (let day = 0; day < daysShortNames.length; day++) {
        const insertHeaderElement = document.createElement("th");
        const dayNameText = document.createTextNode(daysShortNames[day]);
        insertHeaderElement.appendChild(dayNameText);
        if (daysShortNames[day] === "Sun" || daysShortNames[day] === "Sat") {
            insertHeaderElement.classList.add("weekend-bg");
        }
        weekDaysRowElement.appendChild(insertHeaderElement);
    }

    calendarTableHead.appendChild(weekDaysRowElement);
}

function fillCalendarTableBody(calendarTableBody, month, year) {
    let firstDay = new Date(year, month).getDay() === 0 ? 7 : new Date(year, month).getDay();
    let maxDayAmount = 32;
    let daysInMonth = maxDayAmount - new Date(year, month, maxDayAmount).getDate();
    calendarTableBody.innerHTML = ""; // clear the table for month navigation

    monthAndYear.innerHTML = months[month] + " " + year;

    let maxColumnsNumber = 8;
    let maxRowsNumber = 7;

    let date = 1;
    for (let i = 0; i < maxRowsNumber; i++) {
        let weekRow = document.createElement("tr");
        for (let j = 1; j < maxColumnsNumber; j++) {
            let dayCell = document.createElement("td");
            if (i === 0 && j < firstDay) {
                let dayNumber = document.createTextNode("");
                addWeekendBackground(dayCell, j);
                dayCell.appendChild(dayNumber);
                weekRow.appendChild(dayCell);
            } else if (date > daysInMonth) {
                break;
            } else {
                let dayNumber = document.createTextNode(date.toString());

                let dayCellId = moment(new Date(currentYear, currentMonth, date)).format("YYYY-MM-DD");
                dayCell.setAttribute('id', dayCellId);
                addWeekendBackground(dayCell, j);
                if (
                    date === today.getDate() &&
                    year === today.getFullYear() &&
                    month === today.getMonth()
                ) {
                    dayCell.classList.add("today-bg");
                } // color today's date
                dayCell.appendChild(dayNumber);
                weekRow.appendChild(dayCell);
                date++;
            }
        }
        calendarTableBody.appendChild(weekRow);
    }
}


function showCalendar(month, year) {
    /*
    * Insert week day short name into the header
    * of the table conatining the calendar
    */
    let calendarTableHead = document.getElementById("calendar-head");
    fillCalendarTableHead(calendarTableHead);

    let calendarTableBody = document.getElementById("calendar-body");
    fillCalendarTableBody(calendarTableBody, month, year);
    console.log("user: ", user);
    insertEventInCell(db, currentMonth, 1);

}
/*
 * Event insertion, creation
 */
function showEventDetails(event_id) {
    console.log(event_id);
}
function insertEventInCell(db, monthNumber, user_id) {
    db.connect();
    let querySentence = `select * from events where month(date)=${monthNumber + 1} and user_id=${user_id}`;
    db.query(querySentence, (err, results) => {
        if (err) throw err;
        results.map((event) => {
            let formattedDate = moment(event.date).format("YYYY-MM-DD").toString();
            let dayCell = document.getElementById(formattedDate);
            let spanElement = document.createElement("span");
            spanElement.classList.add("badge");
            spanElement.classList.add("badge-pill");
            spanElement.classList.add("badge-dark");
            spanElement.addEventListener("click", () => { showEventDetails(event) });
            spanElement.innerHTML = "!";
            dayCell.appendChild(spanElement);
        });
    });
}

function createEvent(db, event) {
    let response = api.createEvent(db, event);
    console.log(response);
    return response;
}

let nextMonthButton = document.querySelector("#next-btn");
nextMonthButton.addEventListener("click", () => { getNextMonth() });
let prevMonthButton = document.querySelector("#prev-btn");
prevMonthButton.addEventListener("click", () => { getPreviousMonth() });
showCalendar(currentMonth, currentYear);