const ItemRepository = require("../repository/ItemRepository");
const path = require("path");
const getFilesRecursively = require("../utils");
const valueResolver = require("./util/itemValueResolver");
const wrapperResolver = require("./util/itemValueWrapperResolver");
const ItemKeySorter = require("./util/itemKeySorter");

class ItemService {
	constructor() {
		this.itemRepository = new ItemRepository();
	}

	getItems() {
		return this.itemRepository.getAll();
	}

	getItem(id) {
		let item = this.itemRepository.getById(id);

		ItemKeySorter.sort(Object.keys(item)).forEach((key) => {
			let value = valueResolver.resolve(key, item[key]);
			let valueHtmlWrapper = wrapperResolver.resolve(key, value);

			console.log(valueHtmlWrapper);
			console.log(value);
		})

		return item;
	}
}

module.exports = ItemService;
