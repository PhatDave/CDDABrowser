const path = require("path");
const getFilesRecursively = require("../utils");
const Item = require("../entity/Item");

class ItemService {
	constructor() {
		this.items = [];
	}

	addItem(item) {
		this.items.push(new Item(item));
	}

	getItems() {
		return this.items;
	}

	getItem(id) {
		return this.items.find(item => item.id === id);
	}
}

module.exports = ItemService
