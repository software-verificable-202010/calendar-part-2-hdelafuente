const login = require('../src/login');
const api = require('../src/db/db');

test('[login] fo successfull login', async () => {
  let userNameField = document.createElement('input');
  userNameField.setAttribute('value', 'hugo');
  await login.doLogin(userNameField);
})