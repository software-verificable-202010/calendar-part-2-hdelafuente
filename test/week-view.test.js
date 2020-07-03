/* eslint-disable no-undef */
const weekView = require('../src/week-view');

test('[hourRangeContructor] return hours range list', () => {
  const hourRange = weekView.hourRangeContructor(1, 5);
  expect(hourRange).toStrictEqual([1, 2, 3, 4]);
})

test('[addEventListeners] return okStatus', () => {
  const button = document.createElement('button');
  const status = weekView.addEventListeners(button);
  expect(status).toBe(0);
})

test('[addNavigationEventListeners] return okStatus', () => {
  const status = weekView.addNavigationEventListeners();
  expect(status).toBe(1);
})

test('[pad] retrun zeropadded month', () => {
  const monthStringWidth = 2;
  const currentMonth = 7;
  const month = weekView.pad(currentMonth, monthStringWidth, '0');
  expect(month).toBe('07');
})

test('[whoWeek] return okStatus', () => {
  let monthAndYear = document.createElement('h3');
  let weekTableHead = document.createElement('thead');
  let weekTableBody = document.createElement('tbody');

  let tableElements = {
    monthAndYear: monthAndYear,
    weekTableBody: weekTableBody,
    weekTableHead: weekTableHead
  }
  const status = weekView.showWeek(tableElements);
  expect(status).toBe(0);
})