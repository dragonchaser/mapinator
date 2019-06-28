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

function removeClassFromChildren(item, className) {
  for(i = 0; i < item.children.length; i++) {
    item.children[i].classList.remove(className);
  }
}

function updateList(resultItem) {
  removeClassFromChildren(loadedMapsList, 'active');

  var itemArrayPosition = loadedMaps.length;

  var newItem = document.createElement('li');
  newItem.className = 'list-group-item clickableListGroup active';
  newItem.setAttribute('id', 'loadedMap' + itemArrayPosition);
  newItem.setAttribute('onclick', 'changeMap(' + itemArrayPosition + ')');

  var itemImage = document.createElement('img');
  itemImage.src = resultItem['filePath'];
  itemImage.className = 'img-circle media-object pull-left'
  itemImage.setAttribute('width', '30px');
  itemImage.setAttribute('height', '30px');

  var itemCloseBtn = document.createElement('div');
  itemCloseBtn.className = 'icon icon-cancel-circled pull-right'
  itemCloseBtn.setAttribute('onclick', 'removeMapFromList(' + itemArrayPosition + ');')

  var itemDescDiv = document.createElement('div');
  itemDescDiv.className = 'media-body';
  itemDescDiv.innerHTML = '<strong>' + resultItem['baseName'] + '</strong><p>' + resultItem['filePath'] + '</p>'

  newItem.appendChild(itemCloseBtn);
  newItem.appendChild(itemImage);
  newItem.appendChild(itemDescDiv);

  loadedMapsList.appendChild(newItem);
  loadedMaps[itemArrayPosition] = resultItem;
}

function initImage() {
  originalImageWidth = gameMasterContentImg.clientWidth;
  originalImageHeight = gameMasterContentImg.clientHeight;
  currentScale = 100;
  scaleImage();
}

function changeMap(itemArrayPosition) {
  removeClassFromChildren(loadedMapsList, 'active');
  var item = document.getElementById('loadedMap' + itemArrayPosition);
  item.className = item.className + ' active';
  gameMasterContentDiv.removeChild(gameMasterContentImg);
  gameMasterContentImg = document.createElement('img');
  gameMasterContentDiv.appendChild(gameMasterContentImg);
  gameMasterContentImg.src = loadedMaps[itemArrayPosition]['filePath'];
  ipcRenderer.send('OPEN_MAP', loadedMaps[itemArrayPosition]['filePath']);
  setTimeout(() => {
    initImage();
  }, 100);
}

function removeMapFromList(itemArrayPosition) {
  var item = document.getElementById('loadedMap' + itemArrayPosition);
  var resetActive = false;
  if(item.className.includes('active')) {
    resetActive = true;
  }
  if(loadedMapsList.children.length > 1 && resetActive == true) {
    loadedMapsList.children[0].className = loadedMapsList.children[0].className + ' active';
    gameMasterContentDiv.removeChild(gameMasterContentImg);
    gameMasterContentImg = document.createElement('img');
    gameMasterContentDiv.appendChild(gameMasterContentImg);
    gameMasterContentImg.src = loadedMaps[0]['filePath'];
    ipcRenderer.send('OPEN_MAP', loadedMaps[0]['filePath']);
    setTimeout(() => {
      initImage();
    }, 100);
  } else {
    gameMasterContentDiv.removeChild(gameMasterContentImg);
    gameMasterContentImg = document.createElement('img');
    gameMasterContentDiv.appendChild(gameMasterContentImg);
  }
  item.remove();
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
    alert('not implemented <yet>', 'Open session');
  });

  saveSessionBtn.addEventListener('click', (event) => {
    alert('not implemented <yet>', 'Save session');
  })

  rotateLeftBtn.addEventListener('click', (event) => {
    alert('not implemented <yet>', 'Rotate Left');
  });

  rotateRightBtn.addEventListener('click', (event) => {
    alert('not implemented <yet>', 'Rotate Right');
  })

  ipcRenderer.on('OPEN_MAP', (event, result) => {
    gameMasterContentDiv.removeChild(gameMasterContentImg);
    gameMasterContentImg = document.createElement('img');
    gameMasterContentDiv.appendChild(gameMasterContentImg);
    gameMasterContentImg.src = result;
    var resultItem = new Array();
    var path = require('path');
    resultItem['baseName'] = path.basename(result[0]);
    resultItem['filePath'] = result;
    setTimeout(() => {
      initImage();
      updateList(resultItem);
    }, 100);
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
