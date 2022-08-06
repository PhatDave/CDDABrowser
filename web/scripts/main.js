document.addEventListener("DOMContentLoaded", function(event) {
	const electron = require('electron');
	const ipcRenderer = electron.ipcRenderer;
	const valueResolver = require('../scripts/itemValueResolver.js');
	const wrapperResolver = require('../scripts/itemValueWrapperResolver.js');
	const ItemKeySorter = require('../scripts/itemKeySorter.js');

	ipcRenderer.send('loaded');

	ipcRenderer.on('renderItems', (event, data) => {
		let itemKeys = []
		data.forEach((item) => {
			this.items.push(item);
			itemKeys.push(Object.keys(item.data));
		});
		this.addItems(this.items);
	});

	ipcRenderer.on('renderItem', (event, data) => {
		let itemContainer = document.querySelector('#itemDetailed tbody');
		itemContainer.innerHTML = '';

		let itemData = data.data;
		ItemKeySorter.sort(Object.keys(itemData)).forEach((key) => {
			let value = valueResolver.resolve(key, itemData[key]);
			let valueHtmlWrapper = wrapperResolver.resolve(key, value);

			// todo handle submits for the input;
			let element = this.htmlToElement(`<tr>
	<td class="col-2">${key}</td>
	<td class="col-10">${valueHtmlWrapper}</td>
</tr>`);

			itemContainer.appendChild(element);
		});
	});

	// todo implement filterBy
	document.querySelector('#itemSearch input').onkeyup = (event) => {
		let filter = event.target.value;
		ipcRenderer.send('filter', filter);
	}

	function itemClickHandler(event, target) {
		let id = event.target.parentElement.querySelector('.id').textContent;
		ipcRenderer.send('itemClicked', id);
	}

	function createTemplateItemElement() {
		return this.htmlToElement(`<div class="item" data-id="">
	<div>
		<div class="id" hidden></div>
		<div class="name"></div>
	</div>
</div>`);
	}

	function htmlToElement(html) {
		let template = document.createElement('template');
		html = html.trim();
		template.innerHTML = html;
		return template.content.firstChild;
	}

	function addItems(items) {
		items.forEach((item) => {
			this.addItem(item);
		});
		this.displayedItems = items;
	}

	function addItem(item) {
		let itemContainer = document.querySelector('#itemContainer');
		let element = this.createTemplateItemElement();
		let itemData = item.data;
		element.setAttribute('data-id', itemData.id);
		element.querySelector('.id').textContent = itemData.id;
		element.querySelector('.name').textContent = item.name;
		element.onclick = this.itemClickHandler;
		itemContainer.appendChild(element);
	}
});
