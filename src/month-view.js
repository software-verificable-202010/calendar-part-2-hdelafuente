const api = require("./api/api");
const electron = require("electron");
/*
* Global variables
*/
const { ipcRenderer } = electron;


let db = api.db;
let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let currentMonthEvents = api.getMonthEvents(db, currentMonth);

let weekViewButton = document.querySelector("#week-view-btn");
//weekViewButton.addEventListener("click", showWeekView());

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
showCalendar(currentMonth, currentYear);

let januaryNumber = 0;
let decemberNumber = 11; // Would be 12 but count start at 0


/*
* Navigation Functions
*/
function goToNextMonth() {
    currentYear =
        currentMonth === decemberNumber ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % (decemberNumber + 1);
    showCalendar(currentMonth, currentYear);
}

function goToPreviousMonth() {
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

function addEventsInCell(dayNumber, eventArray) {
    eventArray.forEach(event => {
        console.log(event);
    });
}

/*
* Calendar month view constructor
*/
function showCalendar(month, year) {
    let firstDay = new Date(year, month).getDay();
    let maxDayAmount = 32;
    let daysInMonth = maxDayAmount - new Date(year, month, maxDayAmount).getDate();

    /*
    * Insert week day short name into the header
    * of the table conatining the calendar
    */
    let calendarTableHead = document.getElementById("calendar-head");
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

    /*
    * Insert day number into de table body
    */
    let calendarTableBody = document.getElementById("calendar-body");

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
                addWeekendBackground(dayCell, j);
                addEventsInCell(date, currentMonthEvents);
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

/*
 * Events from ipcRenderer
*/
ipcRenderer.on("event:add", function (e, event) {
    if (event.error) {
        let alertDiv = document.querySelector("#alert-div");
        alertDiv.innerHTML = event.error;
    } else {
        api.createEvent(db, event);
        currentMonthEvents = api.getMonthEvents(db, currentMonth);
    }
})

// Navigate to week view
function showWeekView() {
    ipcRenderer.send("view:week", { path: "src/views/week-view.html" })
}
