const { app, BrowserWindow, Menu, webContents } = require("electron");
const path = require("path");
const registerDLNAService = require("./main/services/dlna");
const registerTorrentClientService = require("./main/services/torrent_client");
const registerNCoreAPIService = require("./main/services/ncore_api");
const registerAuthenticationService = require("./main/services/authentication");
const { toggleSettingsWindow } = require("./renderer/settings");

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const torrentClientConfig = {
  downloadFolder: path.join(
    ...[app.getPath("downloads"), "ncore-app", "downloads"]
  ),
  torrentFolder: path.join(
    ...[app.getPath("downloads"), "ncore-app", "torrent-files"]
  ),
  streamServer: {
    network: {
      interface: "en0",
    },
  },
};
const dlnaService = registerDLNAService();
const torrentClientService = registerTorrentClientService({ dlnaService });
const ncoreAPIService = registerNCoreAPIService({ torrentClientService });
const authenticationService = registerAuthenticationService();

dlnaService.start();
torrentClientService.start(torrentClientConfig);
authenticationService
  .start()
  .then(({ username, password }) =>
    ncoreAPIService.start({ username, password })
  );

let mainWindow;
let settingsWindow;

const createWindows = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./renderer/preload.js"),
    },
  });

  mainWindow.loadURL("https://ncore.pro");
  mainWindow.on("close", () => {
    mainWindow = null;
  });

  settingsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "./renderer/settings/preload.js"),
    },
  });
  settingsWindow.loadFile(
    path.join(__dirname, "./renderer/settings/index.html")
  );
  settingsWindow.on("close", () => {
    settingsWindow = null;
  });
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindows);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", async () => {
  await Promise.all([
    dlnaService.stop(),
    torrentClientService.stop(),
    ncoreAPIService.stop(),
    authenticationService.stop(),
  ]);

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows();
  }
});

const isMac = process.platform === "darwin";

const template = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    label: "Developer",
    submenu: [
      {
        label: "Settings",
        accelerator: "CommandOrControl+Shift+S",
        click() {
          toggleSettingsWindow(settingsWindow);
        },
      },
      {
        label: "Debug",
        accelerator: "Command+Shift+D",
        click() {},
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
