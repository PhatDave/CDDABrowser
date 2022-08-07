const ServiceManager = require("./api/service/ServiceManager");
const UIManager = require("./UIManager");

const ipcMain = require('electron').ipcMain

uiManager = new UIManager();
uiManager.buildUI().then(() => {
	let mainWindow = uiManager.mainWindow;

	// todo make this not hardcoded
	// If mirko were to be assigned to module.exports it may not have any access modifier (const/let/var) for some reason
	module.exports = gameDir = "C:\\Users\\Dave\\Desktop\\Cataclysm-DDA";

	let serviceManager = new ServiceManager();

	ipcMain.on('loaded', () => {
		mainWindow.toggleDevTools();
		mainWindow.webContents.send('renderItems', serviceManager.getItems());
	})

	ipcMain.on('itemClicked', (event, id) => {
		mainWindow.webContents.send('renderItem', serviceManager.getItem(id));
	})
});
