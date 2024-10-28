const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { exec } = require('child_process');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
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

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// const { printHello } = require('./test.js');
// printHello()


// IPC handler for the ping command
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


ipcMain.handle('get-drives', async (event, mode, index, property) => {
  console.log(`Mode: ${mode}, Index: ${index}, Property: ${property}`); 
  
  let psCommand;
  if (mode === "all") {
    // Format the output to match "(C:) - Local Disk"
    psCommand = `Get-Volume | Where-Object { $_.FileSystemLabel -ne 'System Reserved' } | ForEach-Object { if ($_.FileSystemLabel -eq '') { $_.FileSystemLabel = 'Local Disk' } '($($_.DriveLetter):\\) - $($_.FileSystemLabel)' }`;
  } else if (index >= 0) {
    // Get a specific drive property, you can modify this if you want to format it too
    psCommand = `Get-Volume | Select-Object -Index ${index} | ForEach-Object { if ($_.FileSystemLabel -eq '') { $_.FileSystemLabel = 'Local Disk' } '($($_.DriveLetter):\\) - $($_.FileSystemLabel)' }`;
  } else {
    return "Invalid parameters.";
  }

  console.log(`Running command: ${psCommand}`); // Log the command

  return new Promise((resolve, reject) => {
    exec(`powershell.exe -ExecutionPolicy Bypass -Command "${psCommand}"`, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        const output = stdout.trim() || "No Drive Found"; // Ensure output is trimmed
        console.log("PowerShell Output:", output); // Log the output
        resolve(output);
      }
    });
  });
});
