
const { shell, ipcMain, electron, dialog, app, BrowserWindow } = require('electron');

let mainWindow
let revealWindow

function createMainWindows() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        //frame: false,
        draggable: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            plugins: true
        }
    });

    mainWindow.loadFile('gamemaster.html');
    mainWindow.on('closed', () => {
      mainWindow = null;
      app.quit();
    });

    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
    });

    revealWindow = new BrowserWindow({
        width: 800,
        height: 600,
        //frame: false,
        //fullscreen: true,
        show: false,
        draggable: true,
        webPreferences: {
            nodeIntegration: true,
            plugins: true,
            parent: mainWindow,

        }
    })
    revealWindow.loadFile('players.html');
    revealWindow.on('closed', () => {
      revealWindow = null;
      app.quit();
    });

    revealWindow.on('ready-to-show', () => {
      revealWindow.show();
    });

}

function openFile() {
  var result = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    title: 'Open Map',
    filters: [
          { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] },
          //{ name: 'PDF', extensions: ['pdf'] }
    ]
  });
  if(result) {
    mainWindow.webContents.send('OPEN_MAP', result);
    revealWindow.webContents.send('OPEN_MAP', result);
  } else {
    console.log("file open canceled")
  }

}

function prepareApp() {
  app.on('ready', createMainWindows);
  app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') app.quit()
  });

  app.on('activate', () => {
      if (win === null) {
          createMainWindows()
      }
  });
}

ipcMain.on('OPEN_FILE_BTN_CLICK', (event) => {
  openFile();
});

ipcMain.on('SCALE_PLAYER_IMAGE', (event, resolution) => {
  revealWindow.webContents.send('SCALE_PLAYER_IMAGE', resolution);
});

ipcMain.on('OPEN_MAP', (event, filePath) => {
  revealWindow.webContents.send('OPEN_MAP', filePath);
});

(async () => {
  await prepareApp();
  app.emit('start');
})();
