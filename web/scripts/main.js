document.addEventListener("DOMContentLoaded", function(event) {
	const electron = require('electron');
	const ipcRenderer = electron.ipcRenderer;
	const valueResolver = require('../scripts/itemValueResolver.js');
	const wrapperResolver = require('../scripts/itemValueWrapperResolver.js');
	const ItemKeySorter = require('../scripts/itemKeySorter.js');

	class UIController {
		constructor() {
			this.displayedItems = [];

			this.#setupIpc();
			this.#setupEventListeners();
		}

		#setupIpc() {
			ipcRenderer.send('loaded');

			ipcRenderer.on('renderItems', (event, data) => {
				data.forEach((item) => {
					this.displayedItems.push(item);
					this.addItem(item);
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
			document.querySelector('#itemSearch input').onkeyup = function(event) {
				let search = event.target.value;
				let filteredItems = displayedItems.filter((item) => {
					return item.name.toLowerCase().includes(search.toLowerCase());
				}).map((item) => {
					return item.data;
				});
			}
		}

		itemClickHandler(event, target) {
			let id = event.target.parentElement.querySelector('.id').textContent;
			ipcRenderer.send('itemClicked', id);
		}

		createTemplateElement() {

			return this.htmlToElement(`<div class="item">
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

		addItem(item) {
			let itemContainer = document.querySelector('#itemContainer');
			let element = this.createTemplateElement();
			let itemData = item.data;
			element.querySelector('.id').textContent = itemData.id;
			element.querySelector('.name').textContent = item.name;
			element.onclick = this.itemClickHandler;
			itemContainer.appendChild(element);
		}

		removeItem(id) {

		}
	}

	let uiController = new UIController();
});
