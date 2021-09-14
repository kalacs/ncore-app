const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const dlnaRow = document.querySelector("tbody tr");
  const indicator = dlnaRow.querySelector("td span");
  const details = dlnaRow.querySelector("td > p");
  const buttonElement = document.createElement("button");
  buttonElement.classList.add("button");
  buttonElement.textContent = "Search";
  buttonElement.onclick = function () {
    ipcRenderer.send("dlna-service/start-search");
  };

  ipcRenderer.on("dlna-service/healthcheck", (_, media) => {
    indicator.classList.remove("has-text-danger");
    indicator.classList.remove("has-text-success");
    details.textContent = "";
    details.innerHTML = "";

    if (media) {
      indicator.classList.add("has-text-success");
      details.textContent = `${media.name} (${media.host})`;
    } else {
      indicator.classList.add("has-text-danger");
      details.append(buttonElement);
    }
  });
});
