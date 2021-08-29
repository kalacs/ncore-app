const createNcoreApi = require("ncore-api");

module.exports = function () {
  return {
    start(config) {
      return createNcoreApi(config);
    },
    stop() {},
  };
};
