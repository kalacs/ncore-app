const { ipcRenderer } = require("electron");

const sendDownloadTorrentFile = (torrentFileId) => {
  ipcRenderer.send("ncore-api-service/download-torrent-file", torrentFileId);
};

const extractTorrentFileId = (element) => {
  const functionString = element.getAttribute("href");
  const pattern = /id=(\d+)/gm;
  return pattern.exec(functionString)[1];
};

const renderPlayButton = (parentElement) => {
  const playButtonElement = document.createElement("a");
  playButtonElement.className = "play-button";
  playButtonElement.title = "Lejátszás TV-én (ÚJ)";
  playButtonElement.innerText = `▶`;
  playButtonElement.onclick = function (event) {
    event.preventDefault();
    event.stopPropagation();

    const torrentFileId = extractTorrentFileId(parentElement.parentElement);
    sendDownloadTorrentFile(torrentFileId);
  };

  parentElement.append(playButtonElement);
};

window.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".tabla_szoveg a > nobr")
    .forEach((element) => renderPlayButton(element));
});
