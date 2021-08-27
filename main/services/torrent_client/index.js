const makeTorrentClient = require("./lib");

module.exports = function (config) {
  let torrentClient;

  return {
    start() {
      torrentClient = makeTorrentClient(config);
    },
    stop() {},
  };
};
