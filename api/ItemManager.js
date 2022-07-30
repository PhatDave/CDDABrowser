const path = require("path");
const getFilesRecursively = require("./utils");
const fs = require("fs");

class ItemManager {
	constructor() {
		this.itemDir = path.join(gameDir, "data", "json", "items")

		let files = getFilesRecursively(this.itemDir)
		// todo also save relative path for writing mod later
		files = files.map(file => path.join(this.itemDir, file))
		files.map(file => this.loadFile(file))
	}

	loadFile(file) {
		const fileData = fs.readFileSync(file, {
			encoding: 'utf8',
			flag: 'r'
		})
		let parsedData = JSON.parse(fileData)
		parsedData.forEach((item) => {
			itemRegistry.addItem(item)
		})
	}

	serialize() {
		return itemRegistry.serialize()
	}
}

module.exports = ItemManager
