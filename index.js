/* eslint-disable init-declarations */
/* eslint-disable no-process-env */
/* eslint-disable no-undef */
const electron = require("electron");
const url = require("url");
const path = require("path");
const mysql = require("mysql");

let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "calendar",
});

let user;
let mainWindow;
let mainMenu;
let addEventWindow;

db.connect((err) => {
    if (!err) {
        console.log("err: ", err);
        db.query("CREATE DATABASE IF NOT EXISTS calendar", (err, result) => {
            if (err) throw err;
            console.log("Database created!")
            console.log(result);
        })
        createUserTable(db);
        createEventTable(db);
        createGuestTable(db);
    }

})

function createUserTable(db) {
    let createUserTableQuery = `create table if not exists users (\
        id int not null auto_increment,\
        username varchar(100),\
        name varchar(100),
        primary key (id))`
    db.query(createUserTableQuery, (err, result) => {
        if (err) throw err;
        console.log("Users table created!");
        console.log(result);
    })
}

function createEventTable(db) {
    let createEventTableQuery = `create table if not exists events(
            id int not null auto_increment, 
            title varchar(100), 
            description varchar(200), 
            date date, 
            start_time time, 
            end_time time, 
            user_id int not null, 
            primary key (id), 
            constraint user_id 
                foreign key (user_id) 
                references users(id) 
                on delete cascade
            )`
    db.query(createEventTableQuery, (err, result) => {
        if (err) throw err
        console.log("Event table created");
        console.log(result)
    });
}

function createGuestTable(db) {
    let query = `create table if not exists guests(id int auto_increment primary key, event_id int, guest_id int)`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log("Guest table created")
        console.log(result);
    })
}

const { app, BrowserWindow, Menu, ipcMain } = electron;

process.env.NODE_ENV = "development";

app.on("ready", createWindow);
function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        title: "Calendar",
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "src/views/login.html"),
        protocol: "file:",
        slashes: true,
    }));

    mainWindow.on("closed", function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
}


function createAddEventWindow() {
    addEventWindow = new BrowserWindow({
        width: 500,
        height: 600,
        title: "Add Event",
        webPreferences: {
            nodeIntegration: true
        }
    });


    addEventWindow.loadURL(url.format({
        pathname: path.join(__dirname, "src/views/add-event.html"),
        protocol: "file:",
        slashes: true,
    }));

    addEventWindow.on('close', function () {
        addEventWindow = null;
    })

}

// IPC Event Listener
ipcMain.on("event:login", (e, props) => {
    console.log("props: ", props);
    mainWindow.close();
    user = props.user;

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        title: "Calendar",
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, props.path),
        protocol: "file:",
        slashes: true,
    }));

})

ipcMain.handle("user:get-props", async () => {
    let userObject = await user;
    return userObject;
})

ipcMain.on("event:add", (e, event) => {
    console.log(event);
    mainWindow.webContents.send("event:add", event);
    addEventWindow.close();
})

ipcMain.on("view:week", (e, message) => {
    console.log(message);
    mainWindow.close();

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        title: "Calendar",
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, message.path),
        protocol: "file:",
        slashes: true,
    }));

})

// Create manu template
const mainMenuTemplate = [
    {
        label: "",
    },
    {
        label: "File",
        submenu: [
            {
                label: "Add Event",
                accelerator:
                    process.platform === "darwin" ? "Command+E" : "Ctrl+E",
                click() {
                    createAddEventWindow();
                }
            },
            {
                label: "Quit",
                accelerator:
                    process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
                click() {
                    app.quit();
                },
            },
        ],
    },
    {
        label: "Tools",
        submenu: [
            {
                label: "Reload",
                accelerator:
                    process.platform === "darwin" ? "Command+R" : "Ctrl+R",
                click() {
                    mainWindow.reload();
                },
            },
        ],
    },
];


if (process.env.NODE_ENV !== "production") {
    mainMenuTemplate.push({
        label: "Developer Tools",
        submenu: [
            {
                label: "Toggle DevTools",
                accelerator:
                    process.platform === "darwin" ? "Command+I" : "Ctrl+I",
                click() {
                    mainWindow.toggleDevTools();
                },
            },
        ],
    });
}

app.on("window-all-closed", function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});