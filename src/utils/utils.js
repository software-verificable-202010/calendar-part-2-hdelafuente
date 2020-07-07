/* eslint-disable no-param-reassign */
function pad(n, width, z) {
  z = z || '0';
  n = String(n);
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function formatDate(date) {
  let month = date.getMonth();
  let year = date.getFullYear();
  let day = date.getDate();
  let dateString = `${year}-${pad(month, 2, '0')}-${pad(day, 2, '0')}`;
  return dateString;
}

module.exports = {
  pad,
  formatDate
}