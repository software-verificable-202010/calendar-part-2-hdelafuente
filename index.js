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

db.connect((err) => {
    if (err) throw err;
    db.query("CREATE SCHEMA IF NOT EXISTS calendar", (err, result) => {
        if (err) throw err;
        console.log("Database created!")
        console.log(result);
    })
    db.query("CREATE TABLE IF NOT EXISTS events (title varchar(200), description varchar(300), date date, start_time time, end_time time)", (err, result) => {
        if (err) throw err
        console.log("Table created");
        console.log(result)
    })

})

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addEventWindow;

// SET ENV
process.env.NODE_ENV = "development";

// Liten for app to be ready
app.on("ready", createWindow);
function createWindow() {
    // Create window
    mainWindow = new BrowserWindow({
        width: 1200, height: 600, title: "Calendar", webPreferences: {
            nodeIntegration: true
        }
    });

    // Load html
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "src/views/month-view.html"),
            protocol: "file:",
            slashes: true,
        })
    );

    mainWindow.on("closed", function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // Main menu
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
}

// Handle create event window
function createAddEventWindow() {
    addEventWindow = new BrowserWindow({
        width: 500, height: 500, title: "Add Event", webPreferences: {
            nodeIntegration: true
        }
    });

    // Load html
    addEventWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "src/views/add-event.html"),
            protocol: "file:",
            slashes: true,
        })
    );
    // Close the new window when event is added
    addEventWindow.on('close', function () {
        addEventWindow = null;
    })

}

// Catch events from ipcMain
ipcMain.on("event:add", function (e, event) {
    console.log(event);
    mainWindow.webContents.send("event:add", event);
    addEventWindow.close();
})

ipcMain.on("view:week", function (e, message) {
    console.log(message);
    mainWindow.close();
    mainWindow = null;

    mainWindow = new BrowserWindow({
        width: 1100, height: 600, title: "Calendar", webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, message.path),
            protocol: "file:",
            slashes: true,
        })
    );

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
                    process.platform == "darwin" ? "Command+E" : "Ctrl+E",
                click() {
                    createAddEventWindow();
                }
            },
            {
                label: "Quit",
                accelerator:
                    process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
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
                    process.platform == "darwin" ? "Command+R" : "Ctrl+R",
                click() {
                    mainWindow.reload();
                },
            },
        ],
    },
];

// Add developer tools option if in dev
if (process.env.NODE_ENV !== "production") {
    mainMenuTemplate.push({
        label: "Developer Tools",
        submenu: [
            {
                label: "Toggle DevTools",
                accelerator:
                    process.platform == "darwin" ? "Command+I" : "Ctrl+I",
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
