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
  const playButtonElement = document.createElement("span");
  playButtonElement.className = "play-button";
  playButtonElement.title = "Lejátszás TV-én (ÚJ)";
  playButtonElement.innerText = `▶`;
  playButtonElement.style.position = "absolute";
  playButtonElement.style.left = "60px";
  playButtonElement.style.cursor = "pointer";
  playButtonElement.onclick = function (event) {
    event.preventDefault();
    event.stopPropagation();

    const torrentFileId = extractTorrentFileId(
      parentElement.querySelector("a")
    );
    sendDownloadTorrentFile(torrentFileId);
  };

  parentElement.append(playButtonElement);
};

const isUsingLegacyUI = () => {
  const legacySpecSelector = ".lista_all";
  return !!document.querySelector(legacySpecSelector);
};

const addPlayButtonToLegacyUI = () => {
  document
    .querySelectorAll(".tabla_szoveg a > nobr")
    .forEach((element) => renderPlayButton(element));
};

const addPlayButtonToNewUI = () => {
  setTimeout(() => {
    const torrentList = document.getElementsByTagName("tor-browse-list");
    if (torrentList.length) {
      document
        .querySelectorAll("tor-torrent-release a.mat-caption")
        .forEach((element) => renderPlayButton(element.parentElement));

      const observer = new MutationObserver(function (mutations) {
        mutations.forEach(({ type, target, addedNodes }) => {
          if (
            type === "childList" &&
            target.classList.contains("container") &&
            addedNodes.length === 1
          ) {
            const [torrentRow] = addedNodes;
            renderPlayButton(torrentRow.querySelector("a").parentElement);
          }
        });
      });

      observer.observe(torrentList[0], {
        childList: true,
        subtree: true,
      });
    }
  }, 2000);
};

const addPlayButton = isUsingLegacyUI
  ? addPlayButtonToLegacyUI
  : addPlayButtonToNewUI;

window.addEventListener("DOMContentLoaded", addPlayButton);
