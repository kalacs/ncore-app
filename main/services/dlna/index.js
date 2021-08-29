const { Notification } = require("electron");
const makeDlnaCast = require("./lib");

module.exports = function () {
  let dlnacast;

  return {
    start() {
      dlnacast = makeDlnaCast();
      dlnacast
        .startSearch()
        .then((media) => {
          new Notification({
            title: "Search for dlna devices",
            body: `A device has been found ${media.name}`,
          }).show();
        })
        .catch((error) => {
          new Notification({
            title: "Search for dlna devices",
            body: "No device has been found!",
          }).show();
        });
    },
    stop() {},
  };
};
