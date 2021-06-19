/**
 * returns sanitised string corresponding to input string
 * @param {string} templateString unsanitsed input string
 * @returns {string} sanitised input string to prevent XSS attacks
 */
function sanitiseHTML(templateString) {
	const tempDiv = document.createElement('div');
	tempDiv.innerText = templateString;
	// console.log(templateString, tempDiv.innerText);
	return tempDiv.innerHTML;
}

/**
 * Returns HTML template string; to be inserted into new DOM element
 * @param {string} name Item name
 * @param {number} quantity Item quatity (could be string as well)
 * @param {string} unit Unit in which item is measured
 * @returns HTML_template_string
 */
export function getListItemTemplate(name, quantity, unit) {
	name = sanitiseHTML(name);
	quantity = sanitiseHTML(quantity);
	unit = sanitiseHTML(unit);

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
}

/**
 * helper function for 'createListElement()' to add event listeners
 * @param {DOM_Element} listElement newly created 'li' element so that its buttons could get event listeners
 * @param {string} name ItemName, that acts as key for event handlers
 * @param {{doneHandler, editHandler, deleteHandler}}	eventHandler	3 event handlers for 3 buttons on the list items
 */
export function addListActionEventListeners(listElement, name, eventHandler) {
	listElement.querySelector('.done-btn').addEventListener('click', () => {
		eventHandler.toggleCompleteItem(name);
	});
	listElement.querySelector('.edit-btn').addEventListener('click', () => {
		eventHandler.changeFormToEditItem(name);
	});
	listElement.querySelector('.del-btn').addEventListener('click', () => {
		eventHandler.deleteItem(name);
	});
}
