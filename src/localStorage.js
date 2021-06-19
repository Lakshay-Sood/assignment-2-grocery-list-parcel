// # Handling Local Storage (for persistence)

/**
 * Reads our groceryList from local storage and then populate the DOM list with the data
 * @param {Object}	myDOM object of specific DOM elements, required to populate data
 * @param {Object}	groceryList the main state object of the application
 * @param {Function}	createListElement a function to create new <li> element and update groceryList
 */
export function readLocalStorageAndPopulateDOM(
	myDOM,
	groceryList,
	createListElement
) {
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
		if (!localDataObj[itemName].isDone) counter++;
	}
	myDOM.itemCounter.innerText = counter;
	if (counter > 0) myDOM.emptyListPlaceholder.style.display = 'none';

	// console.log('onLoad: ', { groceryList });
}

/**
 * save our state (grocery list items) onto local storage for persistence
 * it is called after each alteration in the groceryList object (because window.onbeforeunload is not always reliable)
 * @param {Object}	groceryList the main state object of the application
 */
export function updateLocalStorage(groceryList) {
	const newLocalDataObj = {};
	for (let itemName in groceryList) {
		newLocalDataObj[itemName] = {
			quantity: Number(groceryList[itemName].quantity),
			unit: groceryList[itemName].unit,
			isDone: groceryList[itemName].isDone,
		};
	}

	localStorage.setItem('groceryList', JSON.stringify(newLocalDataObj));
}

/**
 * NOT using this because its not a reliabe event
 * this event is fired when the window​, the document and its resources are about to be unloaded
 * thus, this is when we save our state (list items) onto local storage for persistence
 */
// window.onbeforeunload = () => {
// 	console.log('beforeunload: ', { groceryList });
// 	setTimeout(updateLocalStorage, 0);

// localStorage.setItem('groceryList', JSON.stringify(newLocalDataObj));
// };
