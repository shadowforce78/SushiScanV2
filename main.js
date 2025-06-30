const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

function createWindow() {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.maximize()
    win.loadFile(path.join(__dirname, 'src', 'index.html'))

    // Open the DevTools if needed
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})