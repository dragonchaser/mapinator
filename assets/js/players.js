const { ipcRenderer } = require('electron');

let playersContentFrame;
let playersContentDiv;

function scaleImage(resolution) {
  var res = resolution.split(';');
  playersContentImg.setAttribute('width', res[0]);
  playersContentImg.setAttribute('height', res[1]);
}

function getEntities() {
  playersContentDiv = document.getElementById('playersContentDiv');
  playersContentImg = document.getElementById('playersContentImg');
}

function PlayersInit() {
  getEntities();

  ipcRenderer.on('OPEN_MAP', (event, result) => {
    playersContentDiv.removeChild(playersContentImg);
    playersContentImg = document.createElement('img');
    playersContentDiv.appendChild(playersContentImg);
    playersContentImg.src = result;
  });

  ipcRenderer.on('SCALE_PLAYER_IMAGE', (event, resolution) => {
    scaleImage(resolution);
  });

  ipcRenderer.send('PLAYERS_READY_TRUE', true);
}

document.addEventListener('DOMContentLoaded', PlayersInit);
