const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  pingCommand: () => ipcRenderer.invoke('ping-command'),
  pingNew: () => ipcRenderer.invoke('ping-new'),
});

