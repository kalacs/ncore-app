const { pipeline } = require("stream");
const { ipcMain } = require("electron");
const createNcoreApi = require("ncore-api");
const { createWriteStream } = require("fs");
const path = require("path");
const debug = require("debug")("ncore-app:ncore-api-service");

module.exports = function ({ torrentClientService }) {
  let service;

  ipcMain.on(
    "ncore-api-service/download-torrent-file",
    async (_, torrentFileId) => {
      try {
        const stream = await service.getTorrentFile(torrentFileId);
        const torrentFolder = await torrentClientService.getTorrentFileFolder();
        const fileName = await new Promise((resolve, reject) => {
          torrentClientService.pauseAllSeedableTorrent();
          stream.on("response", function (response) {
            const pattern = /filename="(.*)"/gm;
            const filenameHeader = response.headers["content-disposition"];
            const [, fileName] = pattern.exec(filenameHeader);

            pipeline(
              stream,
              createWriteStream(path.join(torrentFolder, fileName)),
              (err) => {
                if (err) reject(err);
                resolve(fileName);
              }
            );
          });
        });

        const torrentInfo = await torrentClientService.addTorrent(fileName);
        debug(torrentInfo);
        ipcMain.emit("torrent-client-service/torrent-added", torrentInfo);
      } catch (error) {
        debug(error);
        torrentClientService.resumeAllSeedableTorrent();
      }
    }
  );

  return {
    start(config) {
      return createNcoreApi(config).then((result) => {
        service = result;
        return service;
      });
    },
    async stop() {},
  };
};
