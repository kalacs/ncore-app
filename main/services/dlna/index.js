const { Notification, ipcMain } = require("electron");
const debug = require("debug")("ncore-app:dlna-service");
const makeDlnaCast = require("./lib");

module.exports = function () {
  let dlnacast;
  ipcMain.on("dlna-service/play-on-media", function (url) {
    dlnacast.play(url).catch(debug);
  });

  return {
    async start() {
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
    },
    stop() {
      return dlnacast.shutdown();
    },
  };
};
