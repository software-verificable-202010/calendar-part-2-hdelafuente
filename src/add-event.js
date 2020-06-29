const electron = require("electron");
const datepicker = require("js-datepicker");
const moment = require("moment");
const mysql = require("mysql");
// eslint-disable-next-line no-unused-vars
const picker = datepicker("#datepicker");
const { ipcRenderer } = electron;
const form = document.querySelector("form");
form.addEventListener("submit", addEvent);
let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "calendar",
});
fillUserSelect();

// Event fields are collected and sent to index.js
function addEvent(e) {
    e.preventDefault();
    const startHour = document.querySelector("#event-start-hour").value;
    const endHour = document.querySelector("#event-end-hour").value;
    const startMinutes = document.querySelector("#event-start-minute").value;
    const endMinutes = document.querySelector("#event-end-minute").value;
    const title = document.querySelector("#event-title").value;
    const date = moment(document.querySelector("#datepicker").value).format("YYYY-MM-DD");
    const hourSeparator = ":";
    const miliseconds = "00";
    // Checking that every filed is valid, description is optional
    if (
        isValidHourRange(startHour, endHour) &&
        isValidMinuteField(startMinutes) &&
        isValidMinuteField(endMinutes) &&
        isValidTitle(title) &&
        isValidDate(date)
    ) {
        const event = {
            title: title,
            description: document.querySelector("#event-description")
                .value,
            date: date,
            start_time: startHour + hourSeparator + startMinutes + hourSeparator + miliseconds,
            end_time: endHour + hourSeparator + endMinutes + hourSeparator + miliseconds
        };
        ipcRenderer.send("event:add", event);
    } else {
        ipcRenderer.send("event:add", { error: "Invalid field" });
    }
}

function isValidHourRange(startHour, endHour) {
    return startHour < endHour;
}

function isValidMinuteField(minutes) {
    return minutes !== "" && minutes < 59;
}

function isValidTitle(title) {
    return title !== "";
}

function isValidDate(date) {
    return date !== "Invalid date";
}

function fillUserSelect() {
    let query = `select * from users`;
    let selectObject = document.getElementById("select-invited-user");
    db.query(query, (err, result) => {
        if (err) throw err;
        result.map((user) => {
            let optionElement = document.createElement("option");
            optionElement.value = user.id;
            optionElement.innerHTML = user.name;
            selectObject.appendChild(optionElement);
        })
    });
}

module.exports = {
  isValidDate,
  isValidHourRange,
  isValidMinuteField,
  isValidTitle
}