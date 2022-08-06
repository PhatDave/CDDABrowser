class Item {
	constructor(data) {
		this.name = "";
		this.data = data;

		this.resolveName();
	}

	resolveName() {
		if (this.name !== undefined) {
			let allStr = Object.keys(this.data.name)
			this.name = this.data.name[allStr.find(it => it.includes("str"))]
		}
	}
}
module.exports = Item;
