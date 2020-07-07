const api = require('./db/db');
function doLogin(userNameField) {
  if (userNameField.value === null) {
    return 1;
  }
  api.login(userNameField.value);
  return 0;
}

module.exports = {
  doLogin
}