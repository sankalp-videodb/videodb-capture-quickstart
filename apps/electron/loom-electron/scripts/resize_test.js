const { BrowserWindow } = require('electron');
const win = BrowserWindow.getAllWindows()[0];
if (win) {
    win.setSize(500, 700);
    console.log("Resized to 500x700");
    setTimeout(() => {
        win.setSize(380, 600);
        console.log("Resized back to 380x600");
    }, 2000);
}
