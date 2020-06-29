const weekView = require('../src/week-view');

test('[hourRangeContructor] return hours range list', () => {
  const hourRange = weekView.hourRangeContructor(1, 3);
  expect(hourRange).toBe([1, 2, 3]);
})

test('[addNavigationEventListeners] return okStatus', () => {
  const status = weekView.addNavigationEventListeners();
  expect(status).toBe(0);
})