const { Notification, ipcMain, webContents } = require("electron");
const debug = require("debug")("ncore-app:dlna-service");
const makeDlnaCast = require("./lib");

module.exports = function () {
  let dlnacast;
  let healthCheckInterval;

  const start = async () => {
    try {
      dlnacast = makeDlnaCast();
      const media = await dlnacast.startSearch();

      new Notification({
        title: "Search for dlna devices",
        body: `A device has been found ${media.name}`,
      }).show();
    } catch (error) {
      new Notification({
        title: "Search for dlna devices",
        body: "No device has been found!",
      }).show();
    }
  };

  const healhCheck = () => {
    const {
      name = "",
      host = "",
      xml = "",
    } = dlnacast.getMedia() || { name: "", host: "", xml: "" };
    return name ? { name, host, xml } : false;
  };

  healthCheckInterval = setInterval(() => {
    const focusedWebContents = webContents.getFocusedWebContents();
    if (focusedWebContents) {
      focusedWebContents.send("dlna-service/healthcheck", healhCheck());
    }
  }, 1000);

  ipcMain.on("dlna-service/play-on-media", function (url) {
    dlnacast.play(url).catch(debug);
  });

  ipcMain.on("dlna-service/start-search", function () {
    start();
  });

  return {
    start,
    stop() {
      clearInterval(healthCheckInterval);
      return dlnacast.shutdown();
    },
    healhCheck,
  };
};
