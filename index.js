const {app, BrowserWindow, globalShortcut, Tray, Menu, dialog} = require('electron')
const com = require('child_process')
const fs = require('fs')
const {autoUpdater} = require("electron-updater")
autoUpdater.checkForUpdatesAndNotify()
let date = new Date()
let minute = date.getMinutes()
let milli = date.getMilliseconds()
let hour = date.getHours()
let win, alert, i, lastKey, keyInt, settings;
let type = "png"
let tray = null;
let set = ["clipboard", "mail", "message", "preview", "window", "silent", "timer", "select_h", "select_w", "select_x", "select_y"];
let x = [false,false,false,false,false,false,2,false,false,false,false];
app.on('ready', () => {
    const shortCut = globalShortcut.register('CommandOrControl+X', () => {
        shot()
    })
    if (!shortCut) {
        alert = new BrowserWindow({height: 200, width: 450})
        alert.loadFile('alert.html')
        fs.readFile('assets/settings/commandKey.txt', 'utf-8', (err, data) => {
            lastKey = data;
        })
        keyInt = setInterval(readAlert, 1000) 
    }
    const context = Menu.buildFromTemplate([
        {label: "Open Settings", click() {win = new BrowserWindow({height: 475, width: 500}); win.loadFile('index.html');}},
        {label: "Test Screenshot", click() {shot()}, accelerator: "Command+X"},
        {label: "Quit", role: "quit", accelerator: "Command+Q"}
    ])
    tray = new Tray('assets/icons/icon.png')
    tray.setToolTip('Open ScreenShoot')
    tray.setContextMenu(context)
    app.dock.hide()
    win = new BrowserWindow({height: 475, width: 500, maxHeight: 475, maxWidth: 500, minHeight: 475, minWidth: 500});
    win.loadFile('index.html');
    // win.webContents.openDevTools()
})
app.on('will-quit', (event) => {
    dialog.showMessageBox({
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Are you sure you want to quit?                     Your settings will be lost if the app is quit.'
    }, function (response) {
        if (response === 0) {
            globalShortcut.unregisterAll()
            app.quit()
        } else {
            event.preventDefault()
        }
    })
})
app.on('window-all-closed', () => {
    win = null;
    alert = null;
})
fs.readFile('assets/settings/type.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    type = data;
})
function readAlert() {
    fs.readFile('assets/settings/commandKey.txt', 'utf-8', (err, data) => {
        if(err) throw err;
        if (data != lastKey) {
            clearInterval(keyInt);
            win.close()
        }
    })
}
function shot() {
    settings = ''
    for (i = 0; i < 11; i++) {
        if (i === 0 && x[i] === true) {settings = settings + "-c "}
        else if (i === 1 && x[i] === true) {settings = settings + "-M "}
        else if (i === 2 && x[i] === true) {settings = settings + '-I '}
        else if (i === 3 && x[i] === true) {settings = settings + '-P '}
        else if (i === 4 && x[i] === true) {settings = settings + '-W '}
        else if (i === 5 && x[i] === true) {settings = settings + '-x '}
        else if (i === 6 && x[i] != 0) {settings = settings + '-T' + x[i] + ' '}
        else if (i === 7 && x[i] != false) {settings = settings + '-R' + x[i] + ','}
        else if (i === 8 && x[i] != false) {settings = settings + x[i] + ','}
        else if (i === 9 && x[i] != false) {settings = settings  + x[i] + ','}
        else if (i === 10 && x[i] != false) {settings = settings + x[i]}
        console.log(settings)
        console.log(x[i])
    }
    com.exec('cd; cd Desktop/; screencapture ' + settings + ' ' + hour + '.' + minute + '.' + milli + '.' + type + '', (error, stdout) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log('screenshot')
        console.log(`output: ${stdout}`);
    });
}
fs.writeFile('assets/settings/settings.json', '['+x+']' ,(err)=>{if (err) throw err;});
fs.readFile('assets/settings/settings.json', 'utf-8', (err, data) => {
    if (err) throw err;
    x = data;
})
console.log(x)