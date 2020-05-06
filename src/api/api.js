var mysql = require("mysql");

// As month numbers start as 0 we need to add this to every monthNumber
const monthNumberIncrement = 1;

module.exports.db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "calendar",
});

module.exports.getMonthEvents = function (db, monthNumber) {
    db.connect();
    let eventOutput = [];
    let querySentence = `select * from events where month(date) = ` + (monthNumber + monthNumberIncrement);
    db.query(querySentence, function (err, results) {
        if (err) throw err;
        results.map(function (event) {
            eventOutput.push(event);
        });
    });
    return eventOutput;
};

module.exports.createEvent = function (db, event) {
    db.connect();
    let querySentence = `insert into events (title, description, date, start_time, end_time) values ('` +
        event.title + `','` +
        event.description + `','` +
        event.date + `','` +
        event.start_time + `','` +
        event.end_time + `')`;
    console.log(querySentence);
    db.query(querySentence, function (err, result) {
        if (err) throw err;
        console.log(result);
    })

}