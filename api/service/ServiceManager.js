const getFilesRecursively = require("../utils");
const path = require("path");
const fs = require("fs");
const Logger = require("../Logger");
const Service = require("./Service");

class ServiceManager {
	constructor() {
		// Problem with the game files is that they're not structured "well" so for every item loaded we need to figure out what it is
		// The loading is this class' job, the figuring out will be done with a command chain to be implemented
		// Once we figure out what an item is it will be added to the respective service and repository

		// Services are reported unused by IDE but in fact they are used in the line below
		this.logger = new Logger(__filename);

		this.#loadAll();
	}

	#loadAll() {
		this.#loadBaseGame();
		this.#loadMods();

		this.services = Object.values(this).filter(service => service instanceof Service);
		this.services.forEach((item) => {
			this.logger.log(`${item.name} loaded ${item.getItems().length} items`);
		});
		// this.logger.log(`Following types failed to load:`);
		// this.logger.logInfo(this.unresolvedTypes);
		// this.logger.log(`Failed to resolve ${Object.keys(this.unresolvedTypes).length} types`);
		// Object.keys(this.unresolvedTypes).forEach((item) => {
		// 	this.logger.log(`Type: ${item} failed to resolve ${this.unresolvedTypes[item].count} times, example file: ${this.unresolvedTypes[item].files[0]}`);
		// });
	}

	#loadBaseGame() {
		this.logger.log("Loading base game...");
		let jsonDir = path.join(gameDir, "data", "json");
		let files = getFilesRecursively(jsonDir);

		// Have some sort of counter on frontend that updates with the loading of this shit
		// Because the initialization is going to take a little while
		files.forEach((file) => {
			this.#loadIfJson(path.join(jsonDir, file));
		});
		this.logger.log("Base game loaded");
	}

	#loadMods() {
		this.logger.log("Loading mods...");
		let modsFolder = path.join(gameDir, "data", "mods");
		let mods = fs.readdirSync(modsFolder).filter(file => fs.lstatSync(path.join(modsFolder, file)).isDirectory())
		mods.forEach((mod) => {
			this.logger.log(`Loading mod ${mod}...`);
			let modFolder = path.join(modsFolder, mod);
			let modFiles = getFilesRecursively(modFolder);
			let modName = modFolder.split(path.sep).pop();

			modFiles.forEach((file) => {
				this.#loadIfJson(path.join(modFolder, file), modName);
			});
		});
		this.logger.log("Mods loaded");
	}

	#loadIfJson(filePath, modName = "DDA") {
		try {
			if (/.json$/.exec(filePath)) {
				this.#loadFile(filePath, modName);
			}
		} catch (error) {
			console.log(`Error loading ${filePath} (mod ${modName})`);
			console.log(error);
		}
	}

	#loadFile(filePath, source = "DDA") {
		let data = fs.readFileSync(filePath, "utf8");
		let json = JSON.parse(data);
		if (json.constructor === [].constructor) {
			json.forEach((item) => {
				this.#resolveObject(item, source);
			});
		} else {
			this.#resolveObject(json, source);
		}
	}

	#resolveObject(object, source) {
		let type = this.#camelCaseifyType(object.type);
		let serviceName = `${type}Service`;
		if (!Object.keys(this).includes(type)) {
			this[serviceName] = new Service(serviceName, [object.type]);
		}
		let service = this[serviceName];
		service.addItem(object, source);
	}

	#camelCaseifyType(type) {
		let caps = /[A-Z_]+/g.exec(type);
		if (caps) {
			if (caps[0].length / type.length > 0.8) {
				type = type.toLowerCase();
			}
		}
		for (let i = 0; i < type.length; i++) {
			if (type.charAt(i) === "_") {
				type = type.slice(0, i) + type.slice(i + 1).charAt(0).toUpperCase() + type.slice(i + 2);
			}
		}
		return type;
	}
}

module.exports = ServiceManager
