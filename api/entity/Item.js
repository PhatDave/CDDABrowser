class Item {
	constructor(data, source) {
		this.name = "";
		this.source = source;
		this.data = data;

		this.resolveName();
	}

	resolveName() {
		if (this.data.name !== undefined) {
			let allStr = Object.keys(this.data.name)
			this.name = this.data.name[allStr.find(it => it.includes("str"))]
		}
	}
}
module.exports = Item;
