/* eslint-disable no-undef */
const addEvent = require('../src/add-event');

test('[isValidHourRange] return true', () => {
  const result = addEvent.isValidHourRange(12, 13);
  expect(result).toBe(true);
})

test('[isValidHourMinuteField] return true', () => {
  const result = addEvent.isValidMinuteField(58);
  expect(result).toBe(true);
})

test('[isValidTitle] return true', () => {
  const result = addEvent.isValidTitle('Title example');
  expect(result).toBe(true);
})