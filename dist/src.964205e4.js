// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({14:[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],12:[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":14}],6:[function(require,module,exports) {

var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":12}],4:[function(require,module,exports) {
'use strict';

require('./styles.scss');

// import sayHello from './utils';

console.log('ok!');
// sayHello();

// # 6 Step procedure:
// ## Step 1: DOM Elements
// ## Step 2: Global State Variables
// ## Step 3: Helper Functions
// ## Step 4: Event Handler Functions
// ## Step 5: State Handlers
// ## Step 6: Handle Local Storage (for persistence)

// # Step 1: DOM Elements

var myDOM = {
	// ## left section
	addEditSectionTitle: document.querySelector('#add-edit-item > h2'),
	addGroceryListBtn: document.querySelector('.grocery-btn'),
	// addWishListBtn: document.querySelector('.wishlist-btn'),
	form: {
		formElement: document.querySelector('form'),
		itemName: document.querySelector('#item-name'),
		itemQuantity: document.querySelector('#item-quantity'),
		itemUnit: document.querySelector('#item-unit'),
		submitBtn: document.querySelector('.grocery-btn')
	},
	// ## right section
	listHeadGrocery: document.querySelector('.list-heading > h2:nth-child(1)'),
	// listHeadWishlist: document.querySelector('.list-heading > h2:nth-child(2)'),
	itemCounter: document.querySelector('#item-counter'),
	list: document.querySelector('.list'),
	emptyListPlaceholder: document.querySelector('.empty-list-placeholder'),
	clearListBtn: document.querySelector('#clear-btn')
};

// # Step 2: Global State Variables
/**
 * will hold all list items with their data and reference to DOM node (for faster access)
 * example => groceryList = {
 *  'Banana': {
 *    quantity: 2,
 *    unit: 'dozen',
 *    isDone: false,
 *    element: DOM_element reference
 *  }
 * }
 */
var groceryList = {};

/**
 * to check if form is in add or edit mode
 * and stores original name of the product if its in edit mode
 */
var editMode = {
	status: false,
	prevName: ''
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
var createListElement = function createListElement(name, quantity, unit, isDone) {
	var listElement = document.createElement('li');
	if (isDone) listElement.classList.add('done-overlay');
	listElement.innerHTML = getListItemTemplate(name, quantity, unit);
	addListActionEventListeners(listElement, name);

	groceryList[name] = {
		quantity: quantity,
		unit: unit,
		element: listElement,
		isDone: isDone
	};
	return listElement;
};

/**
 * Returns HTML template string; to be inserted into new DOM element
 * @param {string} name Item name
 * @param {number} quantity Item quatity (could be string as well)
 * @param {string} unit Unit in which item is measured
 * @returns HTML_template_string
 */
var getListItemTemplate = function getListItemTemplate(name, quantity, unit) {
	return '<span class="list-item">\n\t<span class="list-item-name">' + name + '</span><span class="quantity-unit">' + quantity + ' ' + unit + '</span>\n</span>\n\t<!-- ! add icons -->\n\t<span class="list-action">\n\t<span class="done-btn">Done</span>\n\t<span class="edit-btn">Edit</span>\n\t<span class="del-btn">Del</span>\n\t</span>\n';
};

/**
 * clears all the input fields and changes button and titles back to original ones (if they were changed due to 'Edit' option)
 */
var changeFormToAddNewItem = function changeFormToAddNewItem() {
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
var changeFormToEditItem = function changeFormToEditItem(name) {
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
var validateInput = function validateInput() {
	var itemName = myDOM.form.itemName.value;
	var itemQuantity = myDOM.form.itemQuantity.value;
	var itemUnit = myDOM.form.itemUnit.value;

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
myDOM.form.submitBtn.addEventListener('click', function (event) {
	console.log('from submit');
	event.preventDefault();
	if (editMode.status === true) {
		editItem(editMode.prevName);
	} else {
		addItem();
	}
});

/**
 * helper function for 'createListElement()' to add event listeners
 * @param {DOM_Element} listElement newly created 'li' element so that its buttons could get event listeners
 * @param {string} name ItemName, that acts as key for event handlers
 */
var addListActionEventListeners = function addListActionEventListeners(listElement, name) {
	listElement.querySelector('.done-btn').addEventListener('click', function () {
		toggleCompleteItem(name);
	});
	listElement.querySelector('.edit-btn').addEventListener('click', function () {
		changeFormToEditItem(name);
	});
	listElement.querySelector('.del-btn').addEventListener('click', function () {
		deleteItem(name);
	});
};

/**
 * event listen to clear the grocery list
 */
myDOM.clearListBtn.addEventListener('click', function () {
	deleteAllItems();
});

// # Step 5: State Handlers

/**
 * Appends (increments) items based on the form data
 * @param {DOM_event} event onClick event when user wants to add a new item to the list
 */
var addItem = function addItem() {
	// if (event) event.preventDefault();
	if (!validateInput()) {
		return;
	}

	var name = myDOM.form.itemName.value;
	var quantity = myDOM.form.itemQuantity.value;
	var unit = myDOM.form.itemUnit.value;
	quantity = Number(quantity);
	if (groceryList.hasOwnProperty(name)) {
		groceryList[name].quantity += quantity;
		groceryList[name].unit = unit;
		groceryList[name].element.querySelector('.quantity-unit').innerText = groceryList[name].quantity + ' ' + unit;
	} else {
		myDOM.list.append(createListElement(name, quantity, unit));
		myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) + 1;
	}
	if (Number(myDOM.itemCounter.innerText) !== 0) myDOM.emptyListPlaceholder.style.display = 'none';
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
var editItem = function editItem(prevName) {
	if (!validateInput()) {
		return;
	}

	var newName = myDOM.form.itemName.value;
	var newQuantity = myDOM.form.itemQuantity.value;
	var newUnit = myDOM.form.itemUnit.value;

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
	groceryList[newName].element.innerHTML = getListItemTemplate(newName, newQuantity, newUnit);
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
var deleteItem = function deleteItem(name) {
	// because counter has been already reduced for 'done' list items
	if (!groceryList[name].isDone) myDOM.itemCounter.innerText = Number(myDOM.itemCounter.innerText) - 1;
	groceryList[name].element.remove();
	delete groceryList[name];
	if (Number(myDOM.itemCounter.innerText) === 0) myDOM.emptyListPlaceholder.style.display = 'block';
	changeFormToAddNewItem();

	// console.log('deleteItem: ', { groceryList });
	setTimeout(updateLocalStorage, 0);
};

/**
 * Delete all items in the grocery list (and from the DOM as well)
 */
var deleteAllItems = function deleteAllItems() {
	for (var itemName in groceryList) {
		deleteItem(itemName);
	}
};

/**
 * function for onClick on 'Done' button for list items
 * @param {string} name ItemName, acts as the key
 */
var toggleCompleteItem = function toggleCompleteItem(name) {
	// console.log(groceryList[name].element);
	groceryList[name].element.classList.toggle('done-overlay');
	groceryList[name].isDone = !groceryList[name].isDone;
	if (groceryList[name].isDone) {
		var counter = Number(myDOM.itemCounter.innerText) - 1;
		myDOM.itemCounter.innerText = counter;
		if (counter === 0) myDOM.emptyListPlaceholder.style.display = 'block';
	} else {
		var _counter = Number(myDOM.itemCounter.innerText) + 1;
		myDOM.itemCounter.innerText = _counter;
		if (_counter === 1) myDOM.emptyListPlaceholder.style.display = 'none';
	}

	// console.log('toggleCompleteItem: ', { groceryList });
	setTimeout(updateLocalStorage, 0);
};

// # Step 6: Handle Local Storage (for persistence)

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

/**
 * Reads our groceryList from local storage and then populate the DOM list with the data
 */
var readLocalStorageAndPopulateDOM = function readLocalStorageAndPopulateDOM() {
	var localDataString = localStorage.getItem('groceryList');
	var localDataObj = JSON.parse(localDataString);
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
	var counter = 0;
	groceryList = {};
	for (var itemName in localDataObj) {
		myDOM.list.append(createListElement(itemName, localDataObj[itemName].quantity, localDataObj[itemName].unit, localDataObj[itemName].isDone));
		if (!localDataObj[itemName].isDone) counter++;
	}
	myDOM.itemCounter.innerText = counter;
	if (counter > 0) myDOM.emptyListPlaceholder.style.display = 'none';

	// console.log('onLoad: ', { groceryList });
};

/**
 * save our state (grocery list items) onto local storage for persistence
 * it is called after each alteration in the groceryList object (because window.onbeforeunload is not always reliable)
 */
var updateLocalStorage = function updateLocalStorage() {
	var newLocalDataObj = {};
	for (var itemName in groceryList) {
		newLocalDataObj[itemName] = {
			quantity: Number(groceryList[itemName].quantity),
			unit: groceryList[itemName].unit,
			isDone: groceryList[itemName].isDone
		};
	}

	localStorage.setItem('groceryList', JSON.stringify(newLocalDataObj));
};

/**
 * this event is fired when the browser load this object
 * thus, this is when we call our state (list items) from local storage into global state variable
 */
window.onload = readLocalStorageAndPopulateDOM;
},{"./styles.scss":6}],6:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '55677' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[6,4], null)
//# sourceMappingURL=/src.964205e4.map