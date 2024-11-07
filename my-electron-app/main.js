const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { exec } = require('child_process');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 294,
    height: 554,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'), // Use preload script to expose only what’s needed
    nodeIntegration: false, // Disable Node.js in the renderer
    contextIsolation: true  // Isolate the context to prevent malicious code execution
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools();
};
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('ping-command', async (event) => {
  return new Promise((resolve, reject) => {
    exec('ping 8.8.8.8', (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
});

ipcMain.handle('ping-new', async () => {
  return new Promise((resolve, reject) => {
    exec('powershell.exe -File .\\powershell\\ping.ps1', 
      (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
});
