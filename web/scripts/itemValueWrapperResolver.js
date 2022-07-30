const util = require("util");

class MainWrapperResolver {
	constructor() {
		this.next = null
	}

	add(wrapperResolver) {
		if (this.next) {
			this.next.add(wrapperResolver)
		} else {
			this.next = wrapperResolver
		}
	}

	resolve(key, value) {
		if (this.next) {
			return this.next.resolve(key, value)
		} else {
			return value
		}
	}
}

class WrapperResolver {
	static all = [];

	constructor(key, callback) {
		this.key = key
		this.callback = callback
		this.next = null
		WrapperResolver.all.push(this)
	}

	add(wrapperResolver) {
		if (this.next) {
			this.next.add(wrapperResolver)
		} else {
			this.next = wrapperResolver
		}
	}

	resolve(key, value) {
		if (this.key === key) {
			return this.callback(value)
		}
		if (this.next) {
			return this.next.resolve(key, value)
		} else {
			return `<div>${value}</div>`
		}
	}
}

let inputTemplate = `<input type="text" class="form-control" value="%s">`
let inputResolver = (value) => util.format(inputTemplate, value)
new WrapperResolver('name', inputResolver)

wrapperResolver = new MainWrapperResolver()
WrapperResolver.all.forEach((item) => {
	wrapperResolver.add(item)
})

module.exports = wrapperResolver
