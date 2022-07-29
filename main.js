const path = require("path")

const app = require('electron').app
const BrowserWindow = require('electron').BrowserWindow
const Menu = require('electron').Menu
const ipcMain = require('electron').ipcMain

const webPath = './web'
const templatesPath = path.join(webPath, 'templates')

let mainWindow
const mainMenuTemplate = [{
	label: 'File', submenu: [{
		label: 'Pogramn\'t', accelerator: 'Ctrl+Q', click: function() {
			app.quit()
		}
	}, {
		label: 'Pogram', accelerator: 'Ctrl+A', // Looks like you cannot override some default hotkeys
		click: createNewWindow
	}]
}]

if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer', submenu: [{
			label: 'Reload', accelerator: 'Ctrl+R', click: function(item, focusedWindow) {
				focusedWindow.reload()
			}
		}, {
			label: 'Force Reload', accelerator: 'Ctrl+Shift+R', click: function(item, focusedWindow) {
				focusedWindow.webContents.reloadIgnoringCache()
			}
		}, {
			label: 'Toggle', accelerator: 'Ctrl+Shift+I', click: function(item, focusedWindow) {
				focusedWindow.toggleDevTools()
			}
		}]
	})
}

function createNewWindow() {
	let newWindow = new BrowserWindow({
		width: 800, height: 400, webPreferences: {
			// preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true, contextIsolation: false
		}
	})

	newWindow.loadFile(path.join(templatesPath, 'newPogram.html'))
	newWindow.on('close', function() {
		newWindow = null
	})
}

app.whenReady().then(() => {
	mainWindow = new BrowserWindow({
		width: 1600, height: 800, webPreferences: {
			preload: path.join(__dirname, 'preload.js'), nodeIntegration: true, contextIsolation: false
		}
	})

	mainWindow.on('closed', () => {
		app.quit()
	})
	Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate))
	mainWindow.loadFile(path.join(templatesPath, 'index.html'))
})

app.on('window-all-closed', () => {
	app.quit()
})

ipcMain.on('new-program', (event, arg) => {
	console.log(arg)
	mainWindow.webContents.send('version', {
		node: process.versions.node,
		electron: process.versions.electron,
		chrome: process.versions.chrome,
		pogs: "Pogs: true"
	})
	// console.log(event.sender.id)
	// Still don't know how to close the window though, would have to use a static reference which I dislike
})
