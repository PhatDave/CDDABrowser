const path = require("path");
const getFilesRecursively = require("../utils");
const Item = require("../entity/Item");
const Logger = require("../Logger");

class Service {
	constructor(name, types) {
		this.items = [];
		this.name = name;
		this.logger = new Logger(name);

		this.types = types
	}

	addItem(item, source) {
		this.items.push(new Item(item, source));
	}

	getItems() {
		return this.items;
	}

	getItem(id) {
		return this.items.find(item => item.id === id);
	}

	resolveType(object, source) {
		// this.logger.log("Resolving type...");
		if (this.types.includes(object.type.toLowerCase())) {
			this.addItem(object, source);
			// this.logger.log(`Object resolved by ${this.constructor.name}`);
			return true;
		}
		return false;
	}
}

module.exports = Service
