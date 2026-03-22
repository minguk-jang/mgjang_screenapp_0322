const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  openItem: (targetPath, isUrl) => ipcRenderer.invoke('open-item', targetPath, isUrl),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options)
});
