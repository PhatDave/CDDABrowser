document.addEventListener("DOMContentLoaded", function(event) {
	const electron = require('electron');
	const ipcRenderer = electron.ipcRenderer;
	const valueResolver = require('../scripts/itemValueResolver.js');
	const wrapperResolver = require('../scripts/itemValueWrapperResolver.js');
	const ItemKeySorter = require('../scripts/itemKeySorter.js');

	class UIController {
		constructor() {
			this.items = [];
			this.displayedItems = [];

			this.#setupIpc();
			this.#setupEventListeners();
		}

		#setupIpc() {
			ipcRenderer.send('loaded');

			ipcRenderer.on('renderItems', (event, data) => {
				data.forEach((item) => {
					this.items.push(item);
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
		}

		#setupEventListeners() {
			// todo implement filterBy
			document.querySelector('#itemSearch input').onkeyup = (event) => {
				let search = event.target.value;
				let itemsToRender = [];

				this.items.forEach((item) => {
					if (item.name !== undefined && item.name.includes(search)) {
						itemsToRender.push(item);
					}
				});
				this.filterItems(itemsToRender);
			}
		}

		itemClickHandler(event, target) {
			let id = event.target.parentElement.querySelector('.id').textContent;
			ipcRenderer.send('itemClicked', id);
		}

		createTemplateItemElement() {
			return this.htmlToElement(`<div class="item" data-id="">
	<div>
		<div class="id" hidden></div>
		<div class="name"></div>
	</div>
</div>`);
		}

		htmlToElement(html) {
			let template = document.createElement('template');
			html = html.trim();
			template.innerHTML = html;
			return template.content.firstChild;
		}

		filterItems(items) {
			// add or remove items from ui based on the difference between displayedItems and items
			let itemsToAdd = [];
			let itemsToRemove = [];

			items.forEach((item) => {
				if (!this.displayedItems.includes(item)) {
					itemsToAdd.push(item);
				}
			});

			this.displayedItems.forEach((item) => {
				if (!items.includes(item)) {
					itemsToRemove.push(item);
				}
			});

			this.addItems(itemsToAdd);
			this.removeItems(itemsToRemove);
		}

		addItems(items) {
			items.forEach((item) => {
				this.addItem(item);
			});
			this.displayedItems = items;
		}

		addItem(item) {
			let itemContainer = document.querySelector('#itemContainer');
			let element = this.createTemplateItemElement();
			let itemData = item.data;
			element.setAttribute('data-id', itemData.id);
			element.querySelector('.id').textContent = itemData.id;
			element.querySelector('.name').textContent = item.name;
			element.onclick = this.itemClickHandler;
			itemContainer.appendChild(element);
		}

		removeItem(id) {
			let itemElement = document.querySelector(`#itemContainer .item[data-id="${id}"]`);
			itemElement.remove();
		}

		removeItems(items) {
			items.forEach((item) => {
				this.removeItem(item.data.id);
			});
		}
	}

	let uiController = new UIController();
});
