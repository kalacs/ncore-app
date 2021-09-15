const { reject } = require("async");
const { webContents, app } = require("electron");
const { getMainRenderer } = require("../../utils");
const PARAM_USERNAME = "nev";
const PARAM_PASSWORD = "pass";

module.exports = function () {
  let currentWebContents;

  return {
    start() {
      return new Promise((resolve) => {
        app.whenReady().then(() => {
          currentWebContents = getMainRenderer(webContents.getAllWebContents());
          try {
            currentWebContents.debugger.attach("1.1");
          } catch (error) {
            console.log("Debugger attach failed : ", error);
            reject(error);
          }

          currentWebContents.debugger.on("detach", (_, reason) => {
            console.log("Debugger detached due to : ", reason);
          });

          currentWebContents.debugger.on("message", (_, method, params) => {
            if (method === "Network.requestWillBeSent") {
              if (params.request.method === "POST") {
                const data = new URLSearchParams(params.request.postData);
                if (!data.get(PARAM_USERNAME) || !data.get(PARAM_PASSWORD)) {
                  reject(new Error("The login was failed!"));
                }
                resolve({
                  username: data.get(PARAM_USERNAME),
                  password: data.get(PARAM_PASSWORD),
                });
                currentWebContents.debugger.detach();
              }
            }
          });

          currentWebContents.debugger.sendCommand("Network.enable");
        });
      });
    },
    stop() {
      return Promise.resolve(currentWebContents.debugger.detach());
    },
  };
};
