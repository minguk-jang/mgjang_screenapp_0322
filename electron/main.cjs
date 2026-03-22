const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { join, dirname } = require('path');
const fs = require('fs/promises');

const DATA_FILE = 'hub-data.json';
const TEMP_FILE = 'hub-data.tmp';

function createWindow() {
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    skipTaskbar: true,
    type: process.platform === 'darwin' ? 'desktop' : 'normal', // Handle native positioning later for Windows if needed
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  const userDataPath = app.getPath('userData');
  const dataFilePath = join(userDataPath, DATA_FILE);
  const tempFilePath = join(userDataPath, TEMP_FILE);

  ipcMain.handle('load-data', async () => {
    try {
      const data = await fs.readFile(dataFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        const defaultData = { todos: [], folders: [], quickLinks: [] };
        await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2));
        return defaultData;
      }
      console.error('Failed to read desktop data:', error);
      return { todos: [], folders: [], quickLinks: [] };
    }
  });

  ipcMain.handle('save-data', async (_, data) => {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(tempFilePath, jsonData);
      await fs.rename(tempFilePath, dataFilePath);
      return { success: true };
    } catch (error) {
      console.error('Failed to save desktop data:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('open-item', async (event, targetPath, isUrl = false) => {
    try {
      if (isUrl) {
        await shell.openExternal(targetPath);
        return true;
      } else {
        const error = await shell.openPath(targetPath);
        if (error) {
          console.error(`Failed to open path ${targetPath}:`, error);
          return false;
        }
        return true;
      }
    } catch (error) {
      console.error(`Error opening item ${targetPath}:`, error);
      return false;
    }
  });

  ipcMain.handle('show-open-dialog', async (event, options) => {
    try {
      const result = await dialog.showOpenDialog(options);
      if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
      }
      return null;
    } catch (error) {
      console.error('Failed to show open dialog:', error);
      return null;
    }
  });

  ipcMain.handle('read-directory', async (event, folderPath) => {
    try {
      const entries = await fs.readdir(folderPath, { withFileTypes: true });
      return entries.map(entry => {
        const isDirectory = entry.isDirectory();
        let type = 'other';
        if (isDirectory) {
          type = 'folder';
        } else {
          const ext = entry.name.split('.').pop().toLowerCase();
          if (ext === 'pdf') type = 'pdf';
          else if (['doc', 'docx'].includes(ext)) type = 'word';
          else if (['xls', 'xlsx', 'csv'].includes(ext)) type = 'excel';
          else if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) type = 'image';
        }
        return {
          id: entry.name,
          name: entry.name,
          path: join(folderPath, entry.name),
          isDirectory,
          type
        };
      });
    } catch (error) {
      console.error('Failed to read directory:', error);
      return [];
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.on('quit-app', () => {
    app.quit();
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
