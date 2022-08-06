const path = require("path")
const ItemService = require("./api/service/ItemService");

const app = require('electron').app
const BrowserWindow = require('electron').BrowserWindow
const Menu = require('electron').Menu
const ipcMain = require('electron').ipcMain

const webPath = './web'
const templatesPath = path.join(webPath, 'templates')

let mainWindow
const mainMenuTemplate = [{
	label: 'File',
	submenu: [{
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
}]

if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer',
		submenu: [{
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
			}]
	})
}

app.whenReady().then(() => {
	mainWindow = new BrowserWindow({
		width: 1600,
		height: 800,
		webPreferences: {
			// preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			contextIsolation: false
		},
		center: true
	})

	mainWindow.on('closed', () => {
		app.quit();
	})
	Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate));
	mainWindow.loadFile(path.join(templatesPath, 'index.html'));
})

app.on('window-all-closed', () => {
	app.quit()
})

// todo make this not hardcoded
// If mirko were to be assigned to module.exports it may not have any access modifier (const/let/var) for some reason
let mirko = "C:\\Users\\Dave\\Desktop\\Cataclysm-DDA"
module.exports = gameDir = mirko;
itemService = new ItemService();
module.exports = itemService;

ipcMain.on('loaded', () => {
	mainWindow.toggleDevTools()
	mainWindow.webContents.send('renderItems', itemService.getItems());
})

ipcMain.on('itemClicked', (event, id) => {
	mainWindow.webContents.send('renderItem', itemService.getItem(id));
})
