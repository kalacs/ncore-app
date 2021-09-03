const { mkdir, stat } = require("fs");
const { promisify } = require("util");
const mkdirPromise = promisify(mkdir);
const statPromise = promisify(stat);

const mkdirIfNotExists = (dirPath) =>
  statPromise(dirPath)
    .catch(({ code, path }) => {
      if (code === "ENOENT") {
        return mkdirPromise(path, { recursive: true });
      }
    })
    .catch((err) => Promise.reject(err));

module.exports = { mkdirIfNotExists };
