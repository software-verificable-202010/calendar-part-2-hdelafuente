const datepicker = require('js-datepicker');
// eslint-disable-next-line no-unused-vars
const picker = datepicker('#datepicker');
const addEventView = require('./add-event');
// const { ipcRenderer } = electron;
const utils = require('./utils/utils');
const form = document.getElementById('add-event-form');
form.addEventListener('submit', () => { addEventView.addEvent() });

const startHour = document.querySelector('#event-start-hour');
const endHour = document.querySelector('#event-end-hour');
const startMinutes = document.querySelector('#event-start-minute');
const endMinutes = document.querySelector('#event-end-minute');
const title = document.querySelector('#event-title');
const date = utils.formatDate(document.querySelector('#datepicker').value);
const description = document.querySelector('#event-description');
const hourSeparator = ':';
const miliseconds = '00';

module.exports = {
  form,
  startHour,
  endHour,
  startMinutes,
  endMinutes,
  title,
  date,
  hourSeparator,
  miliseconds,
  description
}