const ItemRepository = require("../repository/ItemRepository");
const path = require("path");
const getFilesRecursively = require("../utils");

class ItemService {
	constructor() {
		this.itemRepository = new ItemRepository();
	}

	getItems() {
		return this.itemRepository.getAll();
	}

	getItem(id) {
		return this.itemRepository.getById(id);
	}

	getItemsFilterBy(filter, column) {

	}
}

module.exports = ItemService;
