import { app, BrowserWindow, ipcMain } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DATA_FILE = 'hub-data.json';
const TEMP_FILE = 'hub-data.tmp';

function createWindow() {
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    skipTaskbar: true,
    type: process.platform === 'darwin' ? 'desktop' : 'normal', // Handle native positioning later for Windows if needed
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
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

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
