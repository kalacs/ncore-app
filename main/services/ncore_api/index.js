const createNcoreApi = require("ncore-api");

module.exports = function (config) {
  return {
    start() {
      return createNcoreApi(config);
    },
    stop() {},
  };
};
