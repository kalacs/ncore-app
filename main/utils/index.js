const { mkdir, stat } = require("fs");
const { promisify } = require("util");
const mkdirPromise = promisify(mkdir);
const statPromise = promisify(stat);
const MAIN_RENDERER_ID = 1;

const mkdirIfNotExists = (dirPath) =>
  statPromise(dirPath)
    .catch(({ code, path }) => {
      if (code === "ENOENT") {
        return mkdirPromise(path, { recursive: true });
      }
    })
    .catch((err) => Promise.reject(err));

const getMainRenderer = (webContents) =>
  webContents.find(({ id }) => id === MAIN_RENDERER_ID);
module.exports = { mkdirIfNotExists, getMainRenderer };
