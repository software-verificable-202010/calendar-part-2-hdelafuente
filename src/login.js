const api = require("./db/db");

let loginForm = document.querySelector("form");
loginForm.addEventListener("submit", (e) => { doLogin(e) });

function doLogin(e) {
  e.preventDefault();
  let userNameText = document.querySelector("#username-text").value;
  if (userNameText === null) {
    return 1;
  }
  api.login(userNameText);
  return 0;
}

module.exports = {
  doLogin
}