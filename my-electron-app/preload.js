const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	pingCommand: () => ipcRenderer.invoke('ping-command'),
	runCommand: (command) => ipcRenderer.invoke('run-command', command),
	getHostname: (ip) => ipcRenderer.invoke('hostname-command', ip),
});