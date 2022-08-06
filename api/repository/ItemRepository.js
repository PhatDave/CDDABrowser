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

		let files = getFilesRecursively(itemDir);
		// todo also save relative path for writing mod later
		files = files.map(file => path.join(itemDir, file));
		files.map(file => this.#loadFile(file));
	}

	#loadFile(file) {
		const fileData = fs.readFileSync(file, {
			encoding: 'utf8',
			flag: 'r'
		})
		let parsedData = JSON.parse(fileData)
		parsedData.forEach((item) => {
			if (item.id === undefined || item.id === null) {
				return;
			}
			if (this.blacklistedTypes.find(type => item.type === type)) {
				return
			}

			item = new Item(item);
			this.items.push(item)
		})
	}

	getAll() {
		return this.items;
	}

	getById(id) {
		return this.items.find(item => item.data.id === id);
	}
}

module.exports = ItemRepository;
