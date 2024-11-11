const path = require('path');
const { app, BrowserWindow } = require('electron');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Add this for development
    }
  });

  // Determine proper path to index.html
  const indexPath = path.join(__dirname, '..', 'build', 'index.html');
  
  // Load the index.html from a url in development
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
  } else {
    // Load the local index.html in production
    win.loadURL(`file://${indexPath}`);
  }

  // Open the DevTools in development.
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }

  // Debug: Log the path being used
  console.log('Loading from:', process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : `file://${indexPath}`
  );
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});