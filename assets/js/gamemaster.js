const { ipcRenderer } = require('electron')

let loadBtn;
let gameMasterContentFrame;
let gameMasterContentImg;
let gameMasterContentImgSizeLbl;

let scaleDecreaseBtn;
let scaleResetBtn;
let scaleIncreaseBtn;

let originalImageWidth;
let originalImageHeight;

let currentScale;

let loadedMaps = [];

function noMapLoadedAlert() {
  alert('Please load a map first', 'No map loaded');
}

function updateList(resultItem) {
  var newItem = document.createElement('li');
  newItem.className = 'list-group-item clickableListGroup1';
  newItem.setAttribute('cursor', 'pointer');

  var itemImage = document.createElement('img');
  itemImage.src = resultItem['filePath'];
  itemImage.className = 'img-circle media-object pull-left'
  itemImage.setAttribute('width', '30px');
  itemImage.setAttribute('height', '30px');

  var itemCloseBtn = document.createElement('div');
  itemCloseBtn.className = 'icon icon-cancel-circled pull-right'

  var itemDescDiv = document.createElement('div');
  itemDescDiv.className = 'media-body';
  itemDescDiv.innerHTML = '<strong>' + resultItem['baseName'] + '</strong><p>' + resultItem['filePath'] + '</p>'

  newItem.appendChild(itemCloseBtn);
  newItem.appendChild(itemImage);
  newItem.appendChild(itemDescDiv);

  loadedMapsList.appendChild(newItem);
  loadedMaps.push(resultItem);
}

function getEntities() {
  gameMasterContentDiv = document.getElementById('gameMasterContentDiv');
  gameMasterContentImg = document.getElementById('gameMasterContentImg');
  loadBtn = document.getElementById('loadFileBtn');
  scaleDecreaseBtn = document.getElementById('scaleDecreaseBtn');
  scaleResetBtn = document.getElementById('scaleResetBtn');
  scaleIncreaseBtn = document.getElementById('scaleIncreaseBtn');
  gameMasterContentImgSizeLbl = document.getElementById('gameMasterContentImgSizeLbl');
  gameMasterContentImgTint = document.getElementById('gameMasterContentImgTint');
  loadedMapsList = document.getElementById('loadedMapsList');
}

function scaleImage() {
  var imageWidth = Math.ceil(originalImageWidth / 100 * currentScale);
  var imageHeigth = Math.ceil(originalImageHeight / 100 * currentScale);
  gameMasterContentImg.setAttribute('width', imageWidth / 2);
  gameMasterContentImg.setAttribute('height', imageHeigth / 2);
  gameMasterContentImgSizeLbl.innerHTML = 'original: ' + originalImageWidth + 'x' + originalImageHeight + 'px | scaled: ' + imageWidth + 'x' + imageHeigth + 'px (' + currentScale + '%)' ;
  gameMasterContentImgTint.setAttribute('width', imageWidth);
  gameMasterContentImgTint.setAttribute('height', imageHeigth);
  ipcRenderer.send('SCALE_PLAYER_IMAGE', imageWidth + ';' + imageHeigth);
}

function GameMasterInit() {
  getEntities();

  loadBtn.addEventListener('click', (event) => {
    ipcRenderer.send('OPEN_FILE_BTN_CLICK', true);
  });

  loadSessionBtn.addEventListener('click', (event) => {
    alert('not implemented <yet>');
  });

  ipcRenderer.on('OPEN_MAP', (event, result) => {
    gameMasterContentDiv.removeChild(gameMasterContentImg);
    gameMasterContentImg = document.createElement('img');
    gameMasterContentDiv.appendChild(gameMasterContentImg);
    gameMasterContentImg.src = result;
    var resultItem = new Array();
    var path = require('path');
    resultItem['baseName'] = path.basename(result[0]);
    resultItem['filePath'] = result;
    console.log(loadedMaps);
    setTimeout(() => {
      originalImageWidth = gameMasterContentImg.clientWidth;
      originalImageHeight = gameMasterContentImg.clientHeight;
      currentScale = 100;
      scaleImage();
      updateList(resultItem);
    }, 10);
  });

  scaleDecreaseBtn.addEventListener('click', (event) => {
    if(gameMasterContentImg.src) {
      if(currentScale > 10) {
        currentScale = currentScale - 10;
        scaleImage();
      }
    } else {
      noMapLoadedAlert();
    }
  });

  scaleResetBtn.addEventListener('click', (event) => {
    if(gameMasterContentImg.src) {
      currentScale = 100;
      scaleImage();
    } else {
      noMapLoadedAlert();
    }  });

  scaleIncreaseBtn.addEventListener('click', (event) => {
    if(gameMasterContentImg.src) {
      currentScale = currentScale + 10;
      scaleImage();
    } else {
      noMapLoadedAlert();
    }  });

  ipcRenderer.send('GAME_MASTER_READY', true);
}

document.addEventListener('DOMContentLoaded', GameMasterInit);
