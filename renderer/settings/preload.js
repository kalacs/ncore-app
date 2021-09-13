const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const dlnaRow = document.querySelector("tbody tr");
  const indicator = dlnaRow.querySelector("td span");
  const details = dlnaRow.querySelector("td > p");

  ipcRenderer.on("dlna-service/healthcheck", (_, media) => {
    indicator.classList.remove("has-text-danger");
    indicator.classList.remove("has-text-success");
    details.textContent = "";

    if (media) {
      indicator.classList.add("has-text-success");
      details.textContent = `${media.name} (${media.host})`;
    } else {
      indicator.classList.add("has-text-danger");
    }
  });
});
