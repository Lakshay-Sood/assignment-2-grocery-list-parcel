import './styles.scss';
import sayHello from './utils';

console.log('ok!');
// sayHello();

// import { createListElement } from './utils';

// # Step 1: DOM Elements

const myDOM = {
	// ## left section
	addEditSectionTitle: document.querySelector('#add-edit-item > h2'),
	addGroceryListBtn: document.querySelector('.grocery-btn'),
	// addWishListBtn: document.querySelector('.wishlist-btn'),
	form: {
		formElement: document.querySelector('form'),
		itemName: document.querySelector('#item-name'),
		itemQuantity: document.querySelector('#item-quantity'),
		itemUnit: document.querySelector('#item-unit'),
		submitBtn: document.querySelector('.grocery-btn'),
	},
	// ## right section
	listHeadGrocery: document.querySelector('.list-heading > h2:nth-child(1)'),
	// listHeadWishlist: document.querySelector('.list-heading > h2:nth-child(2)'),
	itemCounter: document.querySelector('#item-counter'),
	list: document.querySelector('.list'),
	emptyListPlaceholder: document.querySelector('.empty-list-placeholder'),
};

// # Step 2: Global State Variables
/**
 * will hold all list items with their data and reference to DOM node (for faster access)
 */
let groceryList = {};
let editMode = {
	status: false,
	prevName: '',
};

// # Step 3: Helper Functions

/**
 * Creates a new DOM element (to append in the grocery list)
 * @param {string} name Item name
 * @param {number} quantity Item quatity (could be string as well)
 * @param {string} unit Unit in which item is measured
 * @param {Boolean} isDone If item has been bought but still wants to keep in the list
 * @returns DOM_Element
 */
const createListElement = (name, quantity, unit, isDone) => {
	let listElement = document.createElement('li');
	if (isDone) listElement.classList.add('done-overlay');
	listElement.innerHTML = getListItemTemplate(name, quantity, unit);
	addListActionEventListeners(listElement, name);

	groceryList[name] = {
		quantity,
		unit,
		element: listElement,
		isDone,
	};
	return listElement;
};

const addListActionEventListeners = (listElement, name) => {
	listElement.querySelector('.done-btn').addEventListener('click', () => {
		toggleCompleteItem(name);
	});
	listElement.querySelector('.edit-btn').addEventListener('click', () => {
		changeFormToEditItem(name);
	});
	listElement.querySelector('.del-btn').addEventListener('click', () => {
		deleteItem(name);
	});
};

/**
 * Returns HTML template string; to be inserted into new DOM element
 * @param {string} name Item name
 * @param {number} quantity Item quatity (could be string as well)
 * @param {string} unit Unit in which item is measured
 * @returns HTML_template_string
 */
const getListItemTemplate = (name, quantity, unit) => {
	return `<span class="list-item">
	<span class="list-item-name">${name}</span><span class="quantity-unit">${quantity} ${unit}</span>
</span>
	<!-- ! add icons -->
	<span class="list-action">
	<span class="done-btn">Done</span>
	<span class="edit-btn">Edit</span>
	<span class="del-btn">Del</span>
	</span>
`;
};

/**
 * clears all the input fields and changes button and titles back to original ones (if they were changed due to 'Edit' option)
 */
const changeFormToAddNewItem = () => {
	editMode.status = false;
	// myDOM.form.formElement.setAttribute('onsubmit', 'addItem(event)');
	myDOM.form.itemName.value = '';
	myDOM.form.itemQuantity.value = '';
	myDOM.form.itemUnit.value = 'not-selected';
	myDOM.addEditSectionTitle.innerText = 'Add Item';
	myDOM.addGroceryListBtn.innerText = 'Add to Grocery List';
	// myDOM.addWishListBtn.innerText = 'Add to Wishlist';
};

/**
 * function for onClick on 'Edit' button for list items
 * populates the form fields with data of selected item
 * @param {string} name ItemName, acts as a key
 */
const changeFormToEditItem = (name) => {
	myDOM.addEditSectionTitle.innerText = 'Edit Item';
	myDOM.addGroceryListBtn.innerText = 'Save to Grocery List';

	// populating with item data
	myDOM.form.itemName.value = name;
	myDOM.form.itemQuantity.value = groceryList[name].quantity;
	myDOM.form.itemUnit.value = groceryList[name].unit;

	editMode.status = true;
	editMode.prevName = name;
	// myDOM.form.formElement.setAttribute('onsubmit', `editItem(event, '${name}')`);
};

/**
 * Gives an alert in case the input is not in proper format
 * @returns boolean true if input is validated and false if there is an error
 */
const validateInput = () => {
	const itemName = myDOM.form.itemName.value;
	const itemQuantity = myDOM.form.itemQuantity.value;
	const itemUnit = myDOM.form.itemUnit.value;

	if (itemName === '') {
		alert('Item name can not be empty!');
		return false;
	} else if (itemQuantity <= 0) {
		alert('Item quantity must be greater than 1');
		return false;
	} else if (itemUnit === 'not-selected') {
		alert('Please select unit for your item');
		return false;
	}

	return true;
};

// # Step 4: Event Handler Functions

// myDOM.form.formElement.addEventListener('submit', (event) => {
myDOM.form.submitBtn.addEventListener('click', (event) => {
	console.log('from submit');
	event.preventDefault();
	if (editMode.status === true) {
		editItem(editMode.prevName);
	} else {
		addItem();
	}
});

document.querySelector('#clear-btn').addEventListener('click', () => {
	deleteAllItems();
});

/**
 * Appends (increments) items based on the form data
 * @param {DOM_event} event onClick event when user wants to add a new item to the list
 */
const addItem = () => {
	if (event) event.preventDefault();
	if (!validateInput()) {
		return;
	}

	const name = myDOM.form.itemName.value;
	let quantity = myDOM.form.itemQuantity.value;
	const unit = myDOM.form.itemUnit.value;
	quantity = Number(quantity);
	if (groceryList.hasOwnProperty(name)) {
		groceryList[name].quantity += quantity;
		groceryList[name].unit = unit;
		groceryList[name].element.querySelector('.quantity-unit').innerText =
			groceryList[name].quantity + ' ' + unit;
	} else {
		myDOM.list.append(createListElement(name, quantity, unit));
		myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) + 1;
	}
	if (Number(myDOM.itemCounter.innerText) !== 0)
		myDOM.emptyListPlaceholder.style.display = 'none';
	changeFormToAddNewItem();

	// console.log('addItem: ', { groceryList });
	setTimeout(updateLocalStorage, 0);
};

/**
 * Edits list item based on form data and original key (itemName) of the list element
 * Edits list item based on form data and original key (itemName) of the list element
 * @param {DOM_event} event onClick event when user edits a list item
 * @param {string} prevName Name of original list item which is being edited (helps to check if item is being edited or replaced)
 */
const editItem = (prevName) => {
	if (!validateInput()) {
		return;
	}

	const newName = myDOM.form.itemName.value;
	const newQuantity = myDOM.form.itemQuantity.value;
	const newUnit = myDOM.form.itemUnit.value;

	if (newName !== prevName) {
		if (groceryList[newName]) {
			addItem();
			deleteItem(prevName);

			// console.log('editItem: ', { groceryList });
			setTimeout(updateLocalStorage, 0);
			return;
		}
		// groceryList[newName] = { ...groceryList[prevName] };
		groceryList[newName] = Object.assign(groceryList[prevName]);
		delete groceryList[prevName];
		// myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) - 1;
	}
	groceryList[newName].quantity = Number(newQuantity);
	groceryList[newName].unit = newUnit;
	groceryList[newName].element.innerHTML = getListItemTemplate(
		newName,
		newQuantity,
		newUnit
	);
	addListActionEventListeners(groceryList[newName].element, newName);
	// myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) + 1;

	// console.log('editItem: ', { groceryList });

	changeFormToAddNewItem();
	setTimeout(updateLocalStorage, 0);
};

/**
 * Delete the item with given name (as name is unique)
 * @param {string} name Item name, use as key to delete item from the HTML list and global state variable
 */
const deleteItem = (name) => {
	// because counter has been already reduced for 'done' list items
	if (!groceryList[name].isDone)
		myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) - 1;
	groceryList[name].element.remove();
	delete groceryList[name];
	if (Number(myDOM.itemCounter.innerText) === 0)
		myDOM.emptyListPlaceholder.style.display = 'block';
	changeFormToAddNewItem();

	// console.log('deleteItem: ', { groceryList });
	setTimeout(updateLocalStorage, 0);
};

const deleteAllItems = () => {
	for (let itemName in groceryList) {
		deleteItem(itemName);
	}
};

/**
 * function for onClick on 'Done' button for list items
 * @param {string} name ItemName, acts as the key
 */
const toggleCompleteItem = (name) => {
	// console.log(groceryList[name].element);
	groceryList[name].element.classList.toggle('done-overlay');
	groceryList[name].isDone = !groceryList[name].isDone;
	if (groceryList[name].isDone)
		myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) - 1;
	else myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) + 1;

	// console.log('toggleCompleteItem: ', { groceryList });
	setTimeout(updateLocalStorage, 0);
};

/**
 * this event is fired when the window​, the document and its resources are about to be unloaded
 * thus, this is when we save our state (list items) onto local storage for persistence
 */
// window.onbeforeunload = () => {
// 	console.log('beforeunload: ', { groceryList });

// 	setTimeout(updateLocalStorage, 0);
// const newLocalDataObj = {};
// const itemNameEle = document.querySelectorAll('.list-item-name');
// itemNameEle.forEach((ele) => {
// 	newLocalDataObj[ele.innerText] = {
// 		quantity: Number(groceryList[ele.innerText].quantity),
// 		unit: groceryList[ele.innerText].unit,
// 		isDone: groceryList[ele.innerText].isDone,
// 	};
// });

// localStorage.setItem('groceryList', JSON.stringify(newLocalDataObj));
// };

// # Step 5: Handle Local Storage (for persistence)

/**
 * Reads our groceryList from local storage and then populate the DOM list with the data
 */
const readLocalStorageAndPopulateDOM = () => {
	const localDataString = localStorage.getItem('groceryList');
	const localDataObj = JSON.parse(localDataString);
	// this obj will look something like this
	// const localDataObj = {
	// 	'Urad Dal': {
	// 		quantity: 500,
	// 		unit: 'gm',
	// 		isDone: false,
	// 	},
	// 	'Banana': {
	// 		quantity: 2,
	// 		unit: 'dozen',
	// 		isDone: true,
	// 	},
	// 	'Water Bottle': {
	// 		quantity: 6,
	// 		unit: 'nos.',
	// 		isDone: false,
	// 	},
	// 	'Toned Milk': {
	// 		quantity: 2,
	// 		unit: 'L',
	// 		isDone: false,
	// 	},
	// };

	// no local storage key found
	if (!localDataObj) {
		groceryList = {};
		myDOM.itemCounter.innerText = 0;
	}

	// counter to count total items in the list
	let counter = 0;
	groceryList = {};
	for (let itemName in localDataObj) {
		myDOM.list.append(
			createListElement(
				itemName,
				localDataObj[itemName].quantity,
				localDataObj[itemName].unit,
				localDataObj[itemName].isDone
			)
		);
		counter++;
	}
	myDOM.itemCounter.innerText = counter;
	if (counter > 0) myDOM.emptyListPlaceholder.style.display = 'none';

	// console.log('onLoad: ', { groceryList });
};

/**
 * save our state (grocery list items) onto local storage for persistence
 * it is called after each alteration in the groceryList object (because window.onbeforeunload is not always reliable)
 */
const updateLocalStorage = () => {
	const newLocalDataObj = {};
	for (let itemName in groceryList) {
		newLocalDataObj[itemName] = {
			quantity: Number(groceryList[itemName].quantity),
			unit: groceryList[itemName].unit,
			isDone: groceryList[itemName].isDone,
		};
	}

	localStorage.setItem('groceryList', JSON.stringify(newLocalDataObj));
};

/**
 * this event is fired when the browser load this object
 * thus, this is when we call our state (list items) from local storage into global state variable
 */
window.onload = readLocalStorageAndPopulateDOM;
