const fs = require("fs");
const path = require("path");

function getFilesRecursively(root, relativeRoot = "") {
	root = path.join(root, relativeRoot)
	const dir = fs.readdirSync(root)
	const folders = dir.filter(file => fs.lstatSync(path.join(root, file)).isDirectory())
	let files = dir.filter(file => fs.lstatSync(path.join(root, file)).isFile())
	files = files.map(file => path.join(relativeRoot, file))

	folders.forEach(folder => {
		let innerFiles = getFilesRecursively(root, folder)
		innerFiles = innerFiles.map(file => path.join(relativeRoot, file))
		files.push(...innerFiles)
	})

	return files
}

module.exports = getFilesRecursively
