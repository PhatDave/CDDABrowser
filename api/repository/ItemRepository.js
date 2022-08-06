const path = require("path");
const getFilesRecursively = require("../utils");
const fs = require("fs");
const Item = require("../entity/Item");

class ItemRepository {
	constructor() {
		this.items = [];
		this.blacklistedTypes = ["ammunition_type",
			"MIGRATION"]

		this.#loadAll();
	}

	#loadAll() {
		let itemDir = path.join(gameDir, "data", "json", "items");
		let modsFolder = path.join(gameDir, "data", "mods");

		let files = getFilesRecursively(itemDir);
		// todo also save relative path for writing mod later
		files = files.map(file => path.join(itemDir, file));
		// Files from base game
		files.map(file => this.#loadFile(file, "DDA"));

		const dir = fs.readdirSync(modsFolder);
		dir.forEach((item) => {
			const modFolder = path.join(modsFolder, item);
			if (fs.lstatSync(modFolder).isFile()) {
				return;
			}
			let modName = modFolder.split(path.sep).pop();
			let modFiles = getFilesRecursively(modFolder);

			modFiles = modFiles.map(file => path.join(modsFolder, modName, file));
			modFiles.map(file => {
				if (/.json$/.exec(file)) {
					this.#loadFile(file, modName)
				}
			});
		});
	}

	#loadFile(file, source) {
		const fileData = fs.readFileSync(file, {
			encoding: 'utf8',
			flag: 'r'
		})
		let parsedData;
		try {
			parsedData = JSON.parse(fileData);
		} catch (SyntaxError) {
			console.log(`Error loading file ${file}`);
			return;
		}

		if (parsedData.constructor === [].constructor) {
			parsedData.forEach((item) => {
				this.#parseItem(item, source);
			})
		} else if (parsedData.constructor === Object.constructor) {
			this.#parseItem(parsedData, source);
		}
	}

	#parseItem(item, source) {
		if (item.id === undefined || item.id === null) {
			return;
		}
		if (this.blacklistedTypes.find(type => item.type === type)) {
			return
		}

		item = new Item(item);
		item.source = source;
		this.items.push(item)
	}

	getAll() {
		return this.items;
	}

	getById(id) {
		return this.items.find(item => item.data.id === id);
	}
}

module.exports = ItemRepository;
