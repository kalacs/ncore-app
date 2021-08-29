const renderPlayButton = (parentElement) => {
  const playButtonElement = document.createElement("a");
  playButtonElement.className = "play-button";
  playButtonElement.title = "Lejátszás TV-én (ÚJ)";
  playButtonElement.innerText = `▶`;
  playButtonElement.onclick = function (event) {
    event.preventDefault();
    event.stopPropagation();
    // download torrent
  };

  parentElement.append(playButtonElement);
};

window.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".tabla_szoveg a > nobr")
    .forEach((element) => renderPlayButton(element));
});
