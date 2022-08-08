const path = require("path");
const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const Menu = require('electron').Menu;

class UIManager {
	constructor() {
		this.webPath = './web';
		this.templatesPath = path.join(this.webPath, 'templates');
		this.mainWindow = null;
	}

	async buildUI(build = true) {
		if (build) {
			const mainMenuTemplate = [
				{
					label: 'File',
					submenu: [
						{
							label: 'Pogramn\'t',
							accelerator: 'Ctrl+Q',
							click: function() {
								app.quit()
							}
						}
						// {
						// 	label: 'Pogram',
						// 	accelerator: 'Ctrl+A', // Looks like you cannot override some default hotkeys
						// 	click: createNewWindow
						// }
					]
				}
			];

			if (process.env.NODE_ENV !== 'production') {
				mainMenuTemplate.push({
					label: 'Developer',
					submenu: [
						{
							label: 'Reload',
							accelerator: 'Ctrl+R',
							click: function(item, focusedWindow) {
								focusedWindow.reload()
							}
						},
						{
							label: 'Force Reload',
							accelerator: 'Ctrl+Shift+R',
							click: function(item, focusedWindow) {
								focusedWindow.webContents.reloadIgnoringCache()
							}
						},
						{
							label: 'Toggle',
							accelerator: 'Ctrl+Shift+I',
							click: function(item, focusedWindow) {
								focusedWindow.toggleDevTools()
							}
						}
					]
				})
			}

			await app.whenReady()
			this.mainWindow = new BrowserWindow({
				width: 1600,
				height: 800,
				webPreferences: {
					// preload: path.join(__dirname, 'preload.js'),
					nodeIntegration: true,
					contextIsolation: false
				},
				center: true
			});

			this.mainWindow.on('closed', () => {
				app.quit();
			});
			Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate));
			await this.mainWindow.loadFile(path.join(this.templatesPath, 'index.html'));

			app.on('window-all-closed', () => {
				app.quit();
			});
		}
	}
}

module.exports = UIManager;
