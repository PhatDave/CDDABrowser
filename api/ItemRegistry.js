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
		// if (item.name === undefined) {
		// 	console.log(item)
		// }
		if (this.blacklistedTypes.find(type => item.type === type)) {
			return
		}
		if (item.name !== undefined) {
			let allStr = Object.keys(item.name)
			try {
				this.itemNames[item.id] = item.name[allStr.find(it => it.includes("str"))]
			} catch (TypeError) {
				console.log(item)
			}
		}
		if (this.itemNames[item.id] === undefined) {
			console.log(item.id)
		}

		this.items.push(item)
	}

	findItem(id) {
		return this.items.find(item => item.id === id)
	}

	serialize() {
		let returnobj = {}
		returnobj.items = this.items
		returnobj.itemNames = this.itemNames
		return returnobj
	}
}

module.exports = ItemRegistry
