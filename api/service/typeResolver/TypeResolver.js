const ItemTypeResolver = require("./ItemTypeResolver");

class TypeResolver {
	constructor() {
		this.next = null;

		let resolvers = []
		resolvers.push(new ItemTypeResolver());

		resolvers.forEach((item) => {
			this.addResolver(item);
		});
	}

	addResolver(resolver) {
		if (this.next === null) {
			this.next = resolver;
		} else {
			this.next.addResolver(resolver);
		}
	}

	resolveType(object) {
		this.next.resolveType(object);
	}
}

module.exports = TypeResolver;
