const path = require("path");

class Logger {
	Reset = "\x1b[0m"
	Bright = "\x1b[1m"
	Dim = "\x1b[2m"
	Underscore = "\x1b[4m"
	Blink = "\x1b[5m"
	Reverse = "\x1b[7m"
	Hidden = "\x1b[8m"

	FgBlack = "\x1b[30m"
	FgRed = "\x1b[31m"
	FgGreen = "\x1b[32m"
	FgYellow = "\x1b[33m"
	FgBlue = "\x1b[34m"
	FgMagenta = "\x1b[35m"
	FgCyan = "\x1b[36m"
	FgWhite = "\x1b[37m"

	constructor(originClass) {
		this.originClass = originClass.split(path.sep).pop();
	}

	log(msg) {
		console.log(this.getClassName() + ":\t" + this.getWipe() + msg + this.getWipe())
	}

	getClassName() {
		return this.Bright + this.FgMagenta + this.originClass;
	}

	getWipe() {
		return this.Reset + this.FgWhite;
	}
}

module.exports = Logger
