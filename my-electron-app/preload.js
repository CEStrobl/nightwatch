const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	pingCommand: () => ipcRenderer.invoke('ping-command'),
	runCommand: () => ipcRenderer.invoke('run-command'),

	
});
