/* eslint-disable no-undef */
const monthView = require('../src/month-view');

test('[showCalendar] return okStatus', () => {
  const status = monthView.showCalendar(1, 2020);
  expect(status).toBe(0);
});

test('[getNextMonth] return okStatus', () => {
  const status = monthView.getNextMonth();
  expect(status).toBe(0);
})

test('[getPreviousMonth] return okStatus', () => {
  const status = monthView.getPreviousMonth();
  expect(status).toBe(0);
})

/**
 * The next tests may fail, because of calls like getElementById
 */

test('[showEventDetails] return okStatus', () => {
  const event = {
    title: 'Title',
    description: 'Description',
    date: '2020-06-09',
    start_time: '12:00:00',
    end_time: '13:00:00',
    user_id: 1
  };

  let eventContainerElement = document.createElement("div");
  eventContainerElement.hidden = true;
  let eventDetailsHeader = document.createElement("div");
  let eventDetailsTitle = document.createElement("h5");
  let eventDetailsText = document.createElement("p");
  let eventDetailsFooter = document.createElement("div");
  let eventDetailsBodyElement = document.createElement("div");

  let eventDetailsElements = {
    containerElement: eventContainerElement,
    eventDetailsHeader: eventDetailsHeader,
    eventDetailsText: eventDetailsText,
    eventDetailsFooter: eventDetailsFooter,
    eventDetailsBodyElement: eventDetailsBodyElement,
    eventDetailsTitle: eventDetailsTitle
  }

  const status = monthView.showEventDetails(event, eventDetailsElements);



  expect(status).toBe(0);
})

test('[closeEventDetails] return okStatus', () => {
  const status = monthView.closeEventDetails();
  expect(status).toBe(1);
})