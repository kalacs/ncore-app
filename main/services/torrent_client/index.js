const { app, webContents } = require("electron");
const makeTorrentClient = require("./lib");

module.exports = function (config) {
  let torrentClient;
  let clientStatInterval;

  return {
    start() {
      torrentClient = makeTorrentClient(config);

      app.whenReady().then(() => {
        const [currentWebContents] = webContents.getAllWebContents();
        clientStatInterval = setInterval(() => {
          currentWebContents.send(
            "torrent-client-service/state",
            torrentClient.getClientStat()
          );
        }, 1000);
      });
    },
    stop() {
      clearInterval(clientStatInterval);
    },
    getTorrentFileFolder() {
      return torrentClient.getTorrentFileFolder();
    },
    pauseAllSeedableTorrent() {
      return torrentClient.pauseAllSeedableTorrent();
    },
    resumeAllSeedableTorrent() {
      return torrentClient.resumeAllSeedableTorrent();
    },
    addTorrent(fileName) {
      return torrentClient.addTorrent(fileName);
    },
  };
};
