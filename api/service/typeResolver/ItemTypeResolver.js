const ItemService = require("../ItemService");

class ItemTypeResolver {
	constructor() {
		this.next = null;
		this.service = new ItemService();

		this.types = ["ARMOR", "GENERIC"]
	}

	addResolver(resolver) {
		if (this.next === null) {
			this.next = resolver;
		} else {
			this.next.addResolver(resolver);
		}
	}

	resolveType(object) {
		if (this.types.includes(object.type)) {
			this.service.addItem(object);
			return null;
		}
		if (this.next !== null) {
			return this.next.resolveType(object);
		}
		return null;
	}
}

module.exports = ItemTypeResolver;
