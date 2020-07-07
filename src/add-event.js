const electron = require('electron');
const mysql = require('mysql');
const vars = require('./add-event-const');
const { ipcRenderer } = electron;

let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'calendar',
});

fillUserSelect();

// Event fields are collected and sent to index.js
function addEvent() {
    // Checking that every filed is valid, description is optional
    if (
        isValidHourRange(vars.startHour.value, vars.endHour.value) &&
        isValidMinuteField(vars.startMinutes.value) &&
        isValidMinuteField(vars.endMinutes.value) &&
        isValidTitle(vars.title.value) &&
        isValidDate(vars.date.value)
    ) {
        const event = {
            title: vars.title,
            description: vars.description,
            date: vars.date,
            start_time: vars.startHour + vars.hourSeparator + vars.startMinutes + vars.hourSeparator + vars.miliseconds,
            end_time: vars.endHour + vars.hourSeparator + vars.endMinutes + vars.hourSeparator + vars.miliseconds
        };
        ipcRenderer.send('event:add', event);
    } else {
        ipcRenderer.send('event:add', { error: 'Invalid field' });
    }
}

function isValidHourRange(startHour, endHour) {
    return startHour < endHour;
}

function isValidMinuteField(minutes) {
    return minutes !== '' && minutes < 59;
}

function isValidTitle(title) {
    return title !== '';
}

function isValidDate(date) {
    return date !== 'Invalid date';
}

function fillUserSelect() {
    let query = `select * from users`;
    let selectObject = document.getElementById('select-invited-user');
    db.query(query, (err, result) => {
        if (err) throw err;
        result.map((user) => {
            let optionElement = document.createElement('option');
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
  isValidTitle,
  addEvent
}