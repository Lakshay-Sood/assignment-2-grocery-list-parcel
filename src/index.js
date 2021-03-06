import './styles.scss';
import { getListItemTemplate, addListActionEventListeners } from './utils';
import {
	readLocalStorageAndPopulateDOM,
	updateLocalStorage,
} from './localStorage';

console.log('ok!');
// sayHello();

// # 6 Step procedure:
// ## Step 1: DOM Elements
// ## Step 2: Global State Variables
// ## Step 3: Helper Functions
// ## Step 4: Event Handler Functions
// ## Step 5: State Handlers
// ## Step 6: Load and Populate from Local Storage

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
	clearListBtn: document.querySelector('#clear-btn'),
};

// # Step 2: Global State Variables
/**
 * will hold all list items with their data and reference to DOM node (for faster access)
 * example ==> groceryList = {
 *  'Banana': {
 *    quantity: 2,
 *    unit: 'dozen',
 *    isDone: false,
 *    element: DOM_element reference
 *  }
 * }
 */
let groceryList = {};

/**
 * to check if form is in add or edit mode
 * and stores original name of the product if its in edit mode
 */
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
	addListActionEventListeners(listElement, name, {
		toggleCompleteItem,
		changeFormToEditItem,
		deleteItem,
	});

	groceryList[name] = {
		quantity,
		unit,
		element: listElement,
		isDone,
	};
	return listElement;
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

/**
 * event listener for form submission
 * based on the state of the app, it calls addItem() or editItem()
 */
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

/**
 * event listen to clear the grocery list
 */
myDOM.clearListBtn.addEventListener('click', () => {
	deleteAllItems();
});

// # Step 5: State Handlers

/**
 * Appends (increments) items based on the form data
 * @param {DOM_event} event onClick event when user wants to add a new item to the list
 */
const addItem = () => {
	// if (event) event.preventDefault();
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

	setTimeout(() => {
		updateLocalStorage(groceryList);
	}, 0);
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

			setTimeout(() => {
				updateLocalStorage(groceryList);
			}, 0);
			return;
		}
		// groceryList[newName] = { ...groceryList[prevName] };
		groceryList[newName] = Object.assign(groceryList[prevName]);
		delete groceryList[prevName];
	}
	groceryList[newName].quantity = Number(newQuantity);
	groceryList[newName].unit = newUnit;
	groceryList[newName].element.innerHTML = getListItemTemplate(
		newName,
		newQuantity,
		newUnit
	);
	addListActionEventListeners(groceryList[newName].element, newName, {
		toggleCompleteItem,
		changeFormToEditItem,
		deleteItem,
	});

	changeFormToAddNewItem();
	setTimeout(() => {
		updateLocalStorage(groceryList);
	}, 0);
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

	setTimeout(() => {
		updateLocalStorage(groceryList);
	}, 0);
};

/**
 * Delete all items in the grocery list (and from the DOM as well)
 */
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
	groceryList[name].element.classList.toggle('done-overlay');
	groceryList[name].isDone = !groceryList[name].isDone;
	if (groceryList[name].isDone) {
		const counter = Number(myDOM.itemCounter.innerText) - 1;
		myDOM.itemCounter.innerText = counter;
		if (counter === 0) myDOM.emptyListPlaceholder.style.display = 'block';
	} else {
		const counter = Number(myDOM.itemCounter.innerText) + 1;
		myDOM.itemCounter.innerText = counter;
		if (counter === 1) myDOM.emptyListPlaceholder.style.display = 'none';
	}

	setTimeout(() => {
		updateLocalStorage(groceryList);
	}, 0);
};

// # Step 6: Load and Populate from Local Storage

/**
 * this event is fired when the browser load this object
 * thus, this is when we call our state (list items) from local storage into global state variable
 */
window.onload = () => {
	readLocalStorageAndPopulateDOM(myDOM, groceryList, createListElement);
};
