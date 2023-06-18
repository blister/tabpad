let editor;

const SPECIAL = {
	'Tab': '\u0009',
	'Enter': '\n',
};

function saveChanges(ev) {
	window.localStorage.setItem('tabpad', ev.target.innerText);
}

let strs = {};
function getTabDepth(currentLine) {
	let previous = editor.innerText.split(currentLine)[0];

	let tabs = 0;
	for ( let i = previous.length - 1; i >= 0; --i ) {
		if ( previous[i] === '\t' ) {
			tabs++;
		} else {
			break;
		}
	}

	return tabs;
}

// Some keys, Tab and Enter, are special characters 
// that we need to manually handle so that the browser
// doesn't do something wonky. 
function handleSpecialKeys(ev) {
	if ( ev.key in SPECIAL ) {
		ev.preventDefault();

		let tabs = 0; // counter for tab depth

		let doc = editor.ownerDocument.defaultView;
		let sel = doc.getSelection();
		let range = sel.getRangeAt(0);

		// Issue #1 - tab depth preservation
		// If we hit enter on a line that has started with
		// one or more tabs, create the newline, but include
		// tabs to preserve the depth
		let MagicInsert = '';
		if ( ev.key === 'Enter' ) {
			let startContainer = editor.ownerDocument.defaultView.getSelection().getRangeAt(0).startContainer; //.startContainer.textContent;
			// check to see if the line is a textNode or a DOM node.
			if ( startContainer.nodeType === 3 ) {
				let tabCount = getTabDepth(startContainer.textContent);
				if ( tabCount ) {
					MagicInsert = SPECIAL.Tab.repeat(tabCount);
				}
				let textContent = startContainer.textContent;
				let len = textContent.length;
				for ( let i = 0; i < len; ++i ) {
					if ( textContent[i] === '\t' ) {
						tabs++;
						MagicInsert += '\t';
					} else if ( textContent[i] === '-' ) {
						MagicInsert += '- ';
					} else if ( textContent[i] === '\n' ) {
						// if we've created a text node previously, and our selection
						// has slurped in the newline, ignore it, but keep processing the
						// rest of the string.
						continue;
					} else {
						// if we find anything other than a tab, stop the loop
						break;
					}
				}
			}
		}

		let specialNode = document.createTextNode(`${SPECIAL[ ev.key ]}${MagicInsert}`);
		range.insertNode(specialNode);

		range.setStartAfter(specialNode);
		range.setEndAfter(specialNode); 
		sel.removeAllRanges();
		sel.addRange(range);

		// now that we've properly handled tabs, save changes
		saveChanges(ev);
	}
}

function loadContent() {
	editor.innerText = window.localStorage.getItem('tabpad');
}

document.addEventListener('DOMContentLoaded', () => {
	// fetch our editor node
	editor = document.getElementById('tabpad');

	// with the editor ready, load the existing content
	loadContent();

	// event handlers
	document.addEventListener('visibilitychange', loadContent);
	editor.addEventListener('keydown', handleSpecialKeys);
	editor.addEventListener('input', saveChanges);
});