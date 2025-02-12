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
                reject(stderr);
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

ipcMain.handle('hostname-command', async (event, ip) => {
	const hostnameCommand = `
	$hostname="Unnamed Device"; 
	try { $temp=(Resolve-DnsName "10.0.0.53" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NameHost); if ($temp) { $hostname=$temp } } catch {}; 
	try { if ($hostname -eq "Unnamed Device") { $temp=([System.Net.Dns]::GetHostEntry("10.0.0.53").HostName); if ($temp) { $hostname=$temp } } } catch {}; 
	[Console]::WriteLine($hostname)
	`;
	
	exec(`powershell -NoProfile -Command "${hostnameCommand}"`, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`Stderr: ${stderr}`);
			return;
		}
		console.log(`Hostname:`, stdout.trim() || "Unnamed Device"); // Prevents "undefined"
	});
});

