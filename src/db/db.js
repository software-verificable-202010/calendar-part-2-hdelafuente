/* eslint-disable no-underscore-dangle */
const electron = require("electron");
var mysql = require("mysql");
const { ipcRenderer } = electron;
const pathToMonthView = "src/views/month-view.html";
let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "calendar",
});

module.exports.login = (username) => {
  db.connect()
  let query = `select * from users where username='${username}'`;
  db.query(query, (err, result) => {
    if (err) throw err;
    goToView(pathToMonthView, result[0]);
  });
}

function goToView(path, user) {
  ipcRenderer.send("event:login", {
    path: path,
    user: user
  });
}

module.exports.getUserEvents = (user_id) => {
  db.connect();
  let query = `select * from events where user_id=${user_id}`;
  let dbResult = db.query(query, (err, result) => {
    if (err) throw err;
    return result
  });
  return dbResult;
}

module.exports.createEvent = (db, event, user_id) => {
  db.connect();
  let querySentence = `insert into events(title, description, date, start_time, end_time, user_id) values (
    '${event.title}',
    '${event.description}',
    '${event.date}',
    '${event.start_time}',
    '${event.end_time}', 
    ${user_id})`;
  console.log(querySentence);
  db.query(querySentence, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
  return {
    code: 1,
    msg: "OK"
  }
}