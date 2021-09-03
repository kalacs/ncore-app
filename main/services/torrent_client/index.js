const { app, webContents, ipcMain } = require("electron");
const debug = require("debug")("ncore-app:torrent-client-service");
const { mkdirIfNotExists } = require("../../utils");
const makeTorrentClient = require("./lib");

module.exports = function ({ dlnaService }) {
  let torrentClient;
  let clientStatInterval;

  ipcMain.on(
    "torrent-client-service/torrent-added",
    async function ({ infoHash }) {
      try {
        const serverData = await torrentClient.startStreamServer(infoHash);
        const index = await torrentClient.getMediaFileIndex(infoHash);
        const { host, port } = serverData;
        debug(`${host}:${port}/${index}`);
        ipcMain.emit(
          "dlna-service/play-on-media",
          `http://${host}:${port}/${index}`
        );
      } catch (error) {
        debug(error);
      }
    }
  );

  return {
    start(config) {
      Promise.all([
        mkdirIfNotExists(config.downloadFolder),
        mkdirIfNotExists(config.torrentFolder),
      ]).catch(debug);
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
      return torrentClient.shutdown();
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
