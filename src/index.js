const { app, BrowserWindow, Notification } = require('electron');
const path = require('path');
const makeDlnaCast = require('./services/dlna.js');
const makeTorrentClient = require("./services/torrent_client.js");
const torrentClientConfig = {};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL('https://ncore.pro');
  mainWindow.webContents.openDevTools();
};

// 1. Start searching for dlna devices
const dlnacast = makeDlnaCast();
dlnacast.startSearch().then((media) => {
  new Notification({ title: 'Search for dlna devices', body: `A device has been found ${media.name}`}).show()
}).catch((error) => {
  new Notification({ title: 'Search for dlna devices', body: 'No device has been found!'}).show()
});

// 2. Start torrent client
const client = makeTorrentClient(torrentClientConfig);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
