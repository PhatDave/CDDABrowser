document.addEventListener("DOMContentLoaded", function(event) {
	const electron = require('electron');
	const ipcRenderer = electron.ipcRenderer;

	ipcRenderer.send('loaded')

	ipcRenderer.on('renderItems', (event, data) => {
		let itemContainer = document.querySelector('#itemContainer')
		data.items.forEach((item) => {
			let element = createTemplateElement()
			element.querySelector('.id').textContent = item.id
			if (item.id == "battery") {
				console.log(data.itemNames[item.id])
			}
			element.querySelector('.name').textContent = data.itemNames[item.id]
			itemContainer.appendChild(element)
		})
	});

	function createTemplateElement() {
		return htmlToElement(`<div class="item">
	<div>
		<span class="id"></span>&nbsp -> &nbsp<span class="name"></span>
	</div>
</div>`)
	}

	function htmlToElement(html) {
		let template = document.createElement('template');
		html = html.trim();
		template.innerHTML = html;
		return template.content.firstChild;
	}
});
