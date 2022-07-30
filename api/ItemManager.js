const path = require("path");
const getFilesRecursively = require("./utils");

class ItemManager {
	constructor() {
		this.itemDir = path.join(gameDir, "data", "json", "items")
		console.log(`this.itemDir = ${this.itemDir}`)

		let files = getFilesRecursively(this.itemDir)
		files.map(file => console.log(`file = ${file}`))
	}
}

module.exports = ItemManager
