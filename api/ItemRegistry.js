class ItemRegistry {
	constructor() {
		this.items = []
		this.itemNames = {}
		this.modifiedItems = []

		this.blacklistedTypes = [
			"ammunition_type",
			"MIGRATION"
		]
	}

	addItem(item) {
		if (this.blacklistedTypes.find(type => item.type === type)) {
			return
		}
		this.resolveName(item);
		this.items.push(item)
	}

	resolveName(item) {
		if (item.name !== undefined) {
			let allStr = Object.keys(item.name)
			this.itemNames[item.id] = item.name[allStr.find(it => it.includes("str"))]
		}
	}

	getItem(id) {
		return this.items.find(item => item.id === id)
	}

	toList() {
		const retItems = []
		this.items.forEach(item => {
			retItems.push({
				id: item.id,
				name: this.itemNames[item.id]
			})
		})
		return retItems
	}
}

module.exports = ItemRegistry
