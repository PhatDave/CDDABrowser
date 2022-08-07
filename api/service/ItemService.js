const ItemRepository = require("../repository/ItemRepository");
const path = require("path");
const getFilesRecursively = require("../utils");

class ItemService {
	constructor(data = null) {
		this.itemRepository = new ItemRepository(data);
	}

	getItems() {
		return this.itemRepository.getAll();
	}

	getItem(id) {
		return this.itemRepository.getById(id);
	}
}

module.exports = ItemService;
