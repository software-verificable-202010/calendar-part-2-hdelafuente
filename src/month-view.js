/* eslint-disable no-undefined */
/* eslint-disable init-declarations */
const electron = require('electron');
const { ipcRenderer } = electron;
const vars = require('./month-view-const');
var mysql = require('mysql');
var moment = require('moment');
var api = require('./db/db');
const { okStatus } = require('./month-view-const');

function addEventListeners() {
  if (vars.nextMonthButton === null || vars.nextMonthButton === undefined ||
    vars.prevMonthButton === null || vars.prevMonthButton === undefined ||
    vars.closeEventButton === null || vars.closeEventButton === undefined ||
    vars.weekViewButton === null) {
      return vars.errorStatus;
    }
  vars.nextMonthButton.addEventListener('click', () => { getNextMonth() });
  vars.prevMonthButton.addEventListener('click', () => { getPreviousMonth() });
  vars.closeEventButton.addEventListener('click', () => { closeEventDetails() });
  vars.weekViewButton.addEventListener('click', () => {
    goToView(vars.pathToWeekView);
  })
  return okStatus;
}


function goToView(path) {
    ipcRenderer.send('view:week', {
        path: path,
        today: vars.today,
        currentMonth: vars.currentMonth,
        currentYear: vars.currentYear
    });
    return vars.okStatus;
}


/*
* Navigation Functions
*/
function getNextMonth() {
    vars.currentYear =
        vars.currentMonth === vars.decemberNumber ? vars.currentYear + 1 : vars.currentYear;
    vars.currentMonth = (vars.currentMonth + 1) % (vars.decemberNumber + 1);
    showCalendar(vars.currentMonth, vars.currentYear);
    return vars.okStatus;
}

function getPreviousMonth() {
    vars.currentYear =
        vars.currentMonth === vars.januaryNumber ? vars.currentYear - 1 : vars.currentYear;
    vars.currentMonth =
        vars.currentMonth === vars.januaryNumber ? vars.decemberNumber : vars.currentMonth - 1;
    showCalendar(vars.currentMonth, vars.currentYear);
    return vars.okStatus;
}

function addWeekendBackground(domElement, dayIterator) {
    if (dayIterator % 7 === 0 || dayIterator % 6 === 0) {
        domElement.classList.add('weekend-bg');
    }
}

function showCalendar(month, year) {
  /*
  * Insert week day short name into the header
  * of the table conatining the calendar
  */
  let calendarTableHead = document.getElementById('calendar-head');
  let calendarTableBody = document.getElementById('calendar-body');
  if (calendarTableBody === undefined || calendarTableHead === undefined) {
    return vars.errorStatus;
  }
  fillCalendarTableHead(calendarTableHead);
  fillCalendarTableBody(calendarTableBody, month, year);
  insertEventInCell(api.db, month, 1);
  return vars.okStatus;
}

function fillCalendarTableHead(calendarTableHead) {
  if (calendarTableHead === null) {
    return vars.errorStatus;
  }
    calendarTableHead.innerHTML = ''; // clear the head for navigation
    let weekDaysRowElement = document.createElement('tr');
    if (vars.weekViewButton === undefined) {
      return vars.errorStatus;
    }

    for (let day = 0; day < vars.daysShortNames.length; day++) {
        const insertHeaderElement = document.createElement('th');
        if (insertHeaderElement === undefined) {
          return vars.errorStatus;
        }
        const dayNameText = document.createTextNode(vars.daysShortNames[day]);
        insertHeaderElement.appendChild(dayNameText);
        if (vars.daysShortNames[day] === 'Sun' || vars.daysShortNames[day] === 'Sat') {
            insertHeaderElement.classList.add('weekend-bg');
        }
        weekDaysRowElement.appendChild(insertHeaderElement);
    }
    calendarTableHead.appendChild(weekDaysRowElement);
    return vars.okStatus;
}

function fillCalendarTableBody(calendarTableBody, month, year) {
    if (calendarTableBody === null) {
      return vars.errorStatus;
    }
    let firstDay = new Date(year, month).getDay() === 0 ? 7 : new Date(year, month).getDay();
    let maxDayAmount = 32;
    let daysInMonth = maxDayAmount - new Date(year, month, maxDayAmount).getDate();
    calendarTableBody.innerHTML = ''; // clear the table for month navigation
    vars.monthAndYear.innerHTML = vars.months[month] + ' ' + year;
    let maxColumnsNumber = 8;
    let maxRowsNumber = 7;
    let date = 1;
    for (let i = 0; i < maxRowsNumber; i++) {
        let weekRow = document.createElement('tr');
        for (let j = 1; j < maxColumnsNumber; j++) {
            let dayCell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                let dayNumber = document.createTextNode('');
                addWeekendBackground(dayCell, j);
                dayCell.appendChild(dayNumber);
                weekRow.appendChild(dayCell);
            } else if (date > daysInMonth) { break; } else {
                let dayNumber = document.createTextNode(date.toString());
                let dayCellId = moment(new Date(vars.currentYear, vars.currentMonth, date)).format('YYYY-MM-DD');
                dayCell.setAttribute('id', dayCellId);
                addWeekendBackground(dayCell, j);
                if (
                    date === vars.today.getDate() &&
                    year === vars.today.getFullYear() &&
                    month === vars.today.getMonth()
                ) { dayCell.classList.add('today-bg'); } // color today's date
                dayCell.appendChild(dayNumber);
                weekRow.appendChild(dayCell);
                date++;
            }
        }
        calendarTableBody.appendChild(weekRow);
    }
  return vars.okStatus;
}


function insertEventInCell(db, monthNumber, user_id) {
  let querySentence = `select * from events where user_id=${user_id}`;
  db.query(querySentence, (err, results) => {
    if (err) throw err;
    console.log('results:', results);
    results.map((event) => {
      console.log(vars.formatDate(event.date));
      let formattedDate = vars.formatDate(event.date);
      let dayCell = document.getElementById(formattedDate);
      console.log(dayCell);
      let spanElement = document.createElement('span');
      spanElement.classList.add('badge');
      spanElement.classList.add('badge-pill');
      spanElement.classList.add('badge-dark');
      spanElement.addEventListener('click', () => { showEventDetails(event, vars.eventDetailsElements) });
      spanElement.innerHTML = '!';
      dayCell.appendChild(spanElement);
    });
  });
}

function showEventDetails(event, elements) {
    let deleteButton = createDeleteButton(event.id);
    if (elements.containerElement === null ||
        elements.eventDetailsHeader === null ||
        elements.eventDetailsText === null ||
        elements.eventDetailsFooter === null ||
        elements.eventDetailsBodyElement === null) {
          return vars.errorStatus;
        }
    elements.containerElement.removeAttribute('hidden');
    elements.eventDetailsHeader.innerHTML = '';
    elements.eventDetailsHeader.appendChild(document.createTextNode(moment(event.date).format('YYYY-MM-DD')));
    elements.eventDetailsTitle.innerHTML = '';
    elements.eventDetailsTitle.appendChild(document.createTextNode(event.title));
    elements.eventDetailsText.innerHTML = '';
    elements.eventDetailsText.appendChild(document.createTextNode(event.description));
    elements.eventDetailsFooter.innerHTML = '';
    elements.eventDetailsFooter.appendChild(document.createTextNode(event.start_time + ' - ' + event.end_time));
    elements.eventDetailsBodyElement.appendChild(deleteButton);
    return vars.okStatus;
}

function createDeleteButton(event_id) {
    let deleteButton = document.createElement('button');
    deleteButton.id = 'delete-event-btn';
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-outline-danger');
    deleteButton.classList.add('btn-sm');
    let buttonIcon = document.createElement('i');
    buttonIcon.classList.add('fas');
    buttonIcon.classList.add('fa-trash');
    deleteButton.appendChild(buttonIcon);
    deleteButton.addEventListener('click', () => { deleteEvent(event_id) })
    return deleteButton;
}

function closeEventDetails() {
    let deleteEventButton = document.getElementById('delete-event-btn');
    let eventDetailsCard = document.getElementById('event-details-container');
    if (eventDetailsCard === null || deleteEventButton === null) {
      return vars.errorStatus;
    }
    deleteEventButton.remove();
    eventDetailsCard.setAttribute('hidden', true);
    return vars.okStatus;
}

function deleteEvent(event_id) {
    api.deleteEvent(event_id);
    location.reload();
}

addEventListeners();
showCalendar(vars.currentMonth, vars.currentYear);

module.exports = {
  getNextMonth,
  getPreviousMonth,
  fillCalendarTableHead,
  fillCalendarTableBody,
  showCalendar,
  showEventDetails,
  closeEventDetails,
  insertEventInCell
}