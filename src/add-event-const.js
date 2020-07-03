
const electron = require('electron');
const datepicker = require('js-datepicker');
// eslint-disable-next-line no-unused-vars
const picker = datepicker('#datepicker');
const { ipcRenderer } = electron;
const form = document.getElementById('add-event-form');

module.exports = {
  form
}