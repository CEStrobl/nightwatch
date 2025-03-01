const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { exec } = require('child_process');

if (require('electron-squirrel-startup')) {
	app.quit();
}



const createWindow = () => {

	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 454,
		height: 800,

		webPreferences: {
			// Use preload script to expose only what’s needed
			preload: path.join(app.getAppPath(), 'preload.js'),
			
			// Disable Node.js in the renderer
			nodeIntegration: false,
			
			// Isolate the context to prevent malicious code execution
			contextIsolation: true
		},
	});

	mainWindow.loadFile(path.join(__dirname, 'index.html'));
	mainWindow.webContents.openDevTools();
};
app.whenReady().then(() => {
	createWindow();
	app.on('activate', () => {if (BrowserWindow.getAllWindows().length === 0) {	createWindow();	}	});
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {app.quit();}
});

ipcMain.handle('run-command', async (event, command) => {

	const powershellCommand = `powershell.exe -Command "${command}"`;

	return new Promise((resolve, reject) => {
		exec(powershellCommand, (error, stdout, stderr) => {
			// Reject the promise if an error occurs
			if (error) {
				console.error(error);
				reject(stderr);
				console.log("    ", command, "failed")
			} else {
				// Resolve the promise with the command output
				resolve(stdout);
			}
		});
	});
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
