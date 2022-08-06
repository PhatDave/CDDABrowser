document.addEventListener("DOMContentLoaded", function(event) {
	const electron = require('electron');
	const ipcRenderer = electron.ipcRenderer;
	const valueResolver = require('../scripts/itemValueResolver.js');
	const wrapperResolver = require('../scripts/itemValueWrapperResolver.js');
	const ItemKeySorter = require('../scripts/itemKeySorter.js');

	ipcRenderer.send('loaded');

	ipcRenderer.on('renderItems', (event, data) => {
		let itemContainer = document.querySelector('#itemContainer');
		data.forEach((item) => {
			let itemData = item.data;
			let element = createTemplateElement();
			element.querySelector('.id').textContent = itemData.id;
			element.querySelector('.name').textContent = item.name;
			element.onclick = itemClickHandler;
			itemContainer.appendChild(element);
		});
	});

	ipcRenderer.on('renderItem', (event, data) => {
		let itemContainer = document.querySelector('#itemDetailed tbody');
		itemContainer.innerHTML = '';

		let itemData = data.data;
		ItemKeySorter.sort(Object.keys(itemData)).forEach((key) => {
			let value = valueResolver.resolve(key, itemData[key]);
			let valueHtmlWrapper = wrapperResolver.resolve(key, value);

			// todo handle submits for the input;
			let element = htmlToElement(`<tr>
	<td class="col-2">${key}</td>
	<td class="col-10">${valueHtmlWrapper}</td>
</tr>`);

			itemContainer.appendChild(element);
		});
	});

	function itemClickHandler(event, target) {
		let id = event.target.parentElement.querySelector('.id').textContent;
		ipcRenderer.send('itemClicked', id);
	};

	function createTemplateElement() {

		return htmlToElement(`<div class="item">
	<div>
		<div class="id" hidden></div>
		<div class="name"></div>
	</div>
</div>`);
	};

	function htmlToElement(html) {
		let template = document.createElement('template');
		html = html.trim();
		template.innerHTML = html;
		return template.content.firstChild;
	};
});
