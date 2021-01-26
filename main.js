const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require('fs');
const spawn = require('child_process');
const path = require('path');

function main() {
    const window = new BrowserWindow({
        frame: false,
        useContentSize: true,
        transparent: true,
        center: true,
        hasShadow: false,
        resizable: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            devTools: true,
            experimentalFeatures: true
        }
    });

    window.loadFile("index.html").then(() => loadPath(window));

    if (process.argv.includes('-d'))
        window.webContents.openDevTools();

    ipcMain.on("exec", (ev, bin) => {
        const program = path.join(bin[0], bin[1]);
    
        window.close();
        spawn.execFileSync(program);
    });

    ipcMain.on("exit", () => window.close());
}

function loadPath(window) {
    const paths = process.env.PATH.split(':');

    let binaries = [];

    for (const path of paths) {
        if (!fs.existsSync(path))
            continue;
        
        const items = fs.readdirSync(path);

        binaries = [...binaries, ...items.map(i => [path, i])];
    }

    window.webContents.send("binaries", binaries);
}

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        main();
    }
});

app.whenReady().then(main);

