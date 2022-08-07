const getFilesRecursively = require("../utils");
const path = require("path");

class ServiceManager {
	constructor() {
		// Problem with the game files is that they're not structured "well" so for every item loaded we need to figure out what it is
		// The loading is this class' job, the figuring out will be done with a command chain to be implemented
		// Once we figure out what an item is it will be added to the respective service and repository
		let services = [];
		this.#initServices();
	}

	#initServices() {
		let services = getFilesRecursively(__dirname);
		services = services.filter(service => service.endsWith(".js"));
		services = services.filter(service => service !== __filename.split(path.sep).pop());
		console.log(services);
	}
}

module.exports = ServiceManager
