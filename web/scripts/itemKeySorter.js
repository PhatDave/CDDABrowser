class ItemKeySorter {
	// todo add a menu to edit this
	static order = ["id", "type", "name", "category", "description"]

	static sort(keys) {
		return keys.sort((a, b) => {
			let aIndex = this.order.indexOf(a);
			let bIndex = this.order.indexOf(b);

			if (aIndex === -1) {
				aIndex = this.order.length;
			}

			if (bIndex === -1) {
				bIndex = this.order.length;
			}

			return aIndex - bIndex;
		});
	}
}

module.exports = ItemKeySorter
