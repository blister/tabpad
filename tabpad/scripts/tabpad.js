let editor;

const SPECIAL = {
	'Tab': '\u0009',
	'Enter': '\n',
};

function saveChanges(ev) {
	window.localStorage.setItem('tabpad', ev.target.innerText);
}

// Some keys, Tab and Enter, are special characters 
// that we need to manually handle so that the browser
// doesn't do something wonky. 
function handleSpecialKeys(ev) {
	if ( ev.key in SPECIAL ) {
		ev.preventDefault();

		let doc = editor.ownerDocument.defaultView;
		let sel = doc.getSelection();
		let range = sel.getRangeAt(0);

		let specialNode = document.createTextNode(SPECIAL[ ev.key ]);
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