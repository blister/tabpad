let contents = '';

function handleInput(ev) {
	let changes = ev.target.innerText;
	contents = changes;
	window.localStorage.setItem('tabpad', contents);
}

// tabs are causing us to lose focus. we want tabs
// so trap tab presses and insert them.
function replaceTabs(ev) {
	if ( ev.key === "Tab" ) {
		ev.preventDefault();

		let editor = document.getElementById("tabpad");
		let doc = editor.ownerDocument.defaultView;
		let sel = doc.getSelection();
		let range = sel.getRangeAt(0);

		let tabNode = document.createTextNode("\u0009");
		range.insertNode(tabNode);

		range.setStartAfter(tabNode);
		range.setEndAfter(tabNode); 
		sel.removeAllRanges();
		sel.addRange(range);
	}
}

function loadContent() {
	contents = window.localStorage.getItem('tabpad');

	if ( contents && contents.trim() != '' ) {
		document.getElementById('tabpad').innerText = contents;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	loadContent();
	document.addEventListener('visibilitychange', loadContent);

	document.getElementById('tabpad').addEventListener('keydown', replaceTabs);
	document.getElementById('tabpad').addEventListener('input', handleInput);
});