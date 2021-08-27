window.addEventListener('DOMContentLoaded', () => {
  const torrents = [...document.querySelectorAll('.torrent_txt > a').values()].map(({ title }) => title);
  console.log(torrents);
})

