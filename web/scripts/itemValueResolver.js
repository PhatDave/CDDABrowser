class MainValueResolver {
	constructor() {
		this.next = null
	}

	add(valueResolver) {
		if (this.next) {
			this.next.add(valueResolver)
		} else {
			this.next = valueResolver
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

class ValueResolver {
	static all = [];

	constructor(key, callback) {
		this.key = key
		this.callback = callback
		this.next = null
		ValueResolver.all.push(this)
	}

	add(valueResolver) {
		if (this.next) {
			this.next.add(valueResolver)
		} else {
			this.next = valueResolver
		}
	}

	resolve(key, value) {
		if (this.key === key) {
			return this.callback(value)
		}
		if (this.next) {
			return this.next.resolve(key, value)
		} else {
			return value
		}
	}
}

new ValueResolver('name', (value) => value[Object.keys(value).find(it => it.includes("str"))])

valueResolver = new MainValueResolver()
ValueResolver.all.forEach((item) => {
	valueResolver.add(item)
})

module.exports = valueResolver
