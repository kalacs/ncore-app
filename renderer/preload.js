const { ipcRenderer } = require("electron");

const sendDownloadTorrentFile = (torrentFileId) => {
  ipcRenderer.send("ncore-api-service/download-torrent-file", torrentFileId);
};

const extractTorrentFileId = (element) => {
  const functionString = element.getAttribute("href");
  const pattern = /id=(\d+)/gm;
  return pattern.exec(functionString)[1];
};

const playButtonTemplate = {
  className: "play-button",
  title: "Lejátszás TV-én (ÚJ)",
  innerText: `▶`,
};

const isUsingLegacyUI = () => {
  const legacyOnlySelector = ".lista_all";
  return !!document.querySelector(legacyOnlySelector);
};

const addPlayButtonToLegacyUI = (playButtonTemplate) => {
  const renderPlayButton = (parentElement) => {
    const playButtonElement = document.createElement("a");
    Object.assign(playButtonElement, playButtonTemplate);
    playButtonElement.onclick = function (event) {
      event.preventDefault();
      event.stopPropagation();

      debugger;

      const torrentFileId = extractTorrentFileId(parentElement.parentElement);
      sendDownloadTorrentFile(torrentFileId);
    };

    parentElement.append(playButtonElement);
  };

  document
    .querySelectorAll(".tabla_szoveg a > nobr")
    .forEach((element) => renderPlayButton(element));
};

const addPlayButtonToNewUI = (playButtonTemplate) => {
  const renderPlayButton = (parentElement) => {
    const playButtonElement = document.createElement("span");
    Object.assign(playButtonElement, playButtonTemplate);

    playButtonElement.style.position = "absolute";
    playButtonElement.style.left = "60px";
    playButtonElement.style.cursor = "pointer";

    playButtonElement.onclick = function (event) {
      event.preventDefault();
      event.stopPropagation();

      debugger;

      const torrentFileId = extractTorrentFileId(
        parentElement.querySelector("a")
      );
      sendDownloadTorrentFile(torrentFileId);
    };

    parentElement.append(playButtonElement);
  };

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

window.addEventListener("DOMContentLoaded", () => {
  isUsingLegacyUI()
    ? addPlayButtonToLegacyUI(playButtonTemplate)
    : addPlayButtonToNewUI(playButtonTemplate);
});
