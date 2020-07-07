/* eslint-disable no-underscore-dangle */
const electron = require("electron");
var mysql = require("mysql");
const { ipcRenderer } = electron;
const pathToMonthView = "src/views/month-view.html";
const randomNames = [
  "hugo",
  "raimundo",
  "pedro",
  "carlos",
  "sofia",
  "antonia",
  "javiera",
  "maria",
  "carolina",
  "alfonso",
  "mariano",
  "ignacia",
  "beto",
  "lucas",
  "pablo",
  "valentina",
  "rodrigo",
  "tomas",
  "mauro"
]

const randomLastNames = [
  " de la fuente",
  " marin",
  " bulnes",
  " montero",
  " dominguez",
  " tellez",
  " grand",
  " correa",
  " barrera",
  " vasquez",
  " rojas",
  " ramirez",
  " concha",
  " sanchez",
  " garcia",
  " merino",
  " canales"
]

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "calendar",
});

function checkConnection(db) {
  if (db.state === 'disconnected') {
    db.connect((err, result) => {
      if (err) console.log(err);
      else console.log(result);
    });
  }
  return 0;
}

function login (username) {
  let query = `select * from users where username='${username}'`;
  db.query(query, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      registerUser(username);
    } else goToView(pathToMonthView, result[0]);
    return 0;
  });
}

/* New users are registered when the db doesn't have a matching row
 * Also, new users will have a random name
*/
function registerUser(username) {
  let newUserName = randomNames[Math.floor(Math.random() * randomNames.length)];
  let newUserLastName = randomLastNames[Math.floor(Math.random() * randomLastNames.length)];
  let query = `insert into users(username, name) values('${username}', '${newUserName + newUserLastName}')`;
  db.query(query, (err, result) => {
    if (err) throw err;
    return result;
  })

  db.query(`select * from users where username='${username}'`, (err, result) => {
    if (err) throw err;
    // goToView(pathToMonthView, result[0]);
  })
}


function goToView(path, user) {
  if (ipcRenderer === undefined) return 1;
  ipcRenderer.send("event:login", {
    path: path,
    user: user,
  });
}

function getUserEvents (user_id) {
  var events = [];
  if (db.state === 'disconnected') {
    db.connect((err, result) => {
      if (err) console.log(err);
      else console.log(result);
    });
  }
  let query = `select * from events where user_id=${user_id}`;
  db.query(query, (err, result) => {
    if (err) throw err;
    for (const event of result) {
      events.append(event);
    }
  });
  console.log('Holaaaa', events);
  return events;
}

module.exports.createEvent = (event, user_id) => {
  if (db.state === 'disconnected') {
    db.connect((err, result) => {
      if (err) console.log(err);
      else console.log(result);
    });
  }
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

module.exports.deleteEvent = (event_id) => {
  let query = `delete from events where id = ${event_id}`;
  db.query(query, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
  return {
    code: 1,
    msg: "Ok"
  };
}

module.exports.getAllUsers = () => {
  let query = `select * from users`;
  let usersList = db.query(query, (err, result) => {
    if (err) throw err;
    return result
  });
  return usersList;
}

module.exports = {
  db,
  login,
  registerUser,
  getUserEvents,
  checkConnection
}