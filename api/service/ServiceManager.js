const getFilesRecursively = require("../utils");
const path = require("path");
const ItemService = require("./ItemService");
const fs = require("fs");
const TypeResolver = require("./typeResolver/TypeResolver");
const Logger = require("../Logger");

class ServiceManager {
	constructor() {
		// Problem with the game files is that they're not structured "well" so for every item loaded we need to figure out what it is
		// The loading is this class' job, the figuring out will be done with a command chain to be implemented
		// Once we figure out what an item is it will be added to the respective service and repository
		this.typeResolver = new TypeResolver();
		this.logger = new Logger(__filename);

		this.#loadAll();
	}

	#loadAll() {
		this.#loadBaseGame();
		this.#loadMods();
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
				this.typeResolver.resolveType(item);
			});
		} else {
			this.typeResolver.resolveType(json);
		}
	}
}

module.exports = ServiceManager
