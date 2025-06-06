window.sessionLog = [];

function initSessionArray(key) {
	// Initialize if not already there
	if (!sessionStorage.getItem(key)) {
		sessionStorage.setItem(key, JSON.stringify([]));
	}
}

// Add an item to the array
function addToSessionArray(item, key) {
	const arr = JSON.parse(sessionStorage.getItem(key));
	arr.push(item);
	sessionStorage.setItem(key, JSON.stringify(arr));
}

// Get the array
function getSessionArray(key) {
	return JSON.parse(sessionStorage.getItem(key) || "[]");
}

// Clear the array
function clearSessionArray(key) {
	sessionStorage.setItem(key, JSON.stringify([]));
}


// Log Powershell History

const pskey = "pshistory";

initSessionArray(pskey);

function logps(command) {

	let record = {
		command: command,
		timestamp: getTimestamp(),
		date: getTodaysDate(),
	}

	addToSessionArray(record,pskey);
	updateComDisplay();
}

function readps() {
	const all = getSessionArray(pskey);
	return all;
}


const comdisplay = document.getElementById("commanddisplay")
function updateComDisplay() {
	
	// always update command history
	// clear commands

	if(comdisplay.hasChildNodes()) {
		const children = comdisplay.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			comdisplay.removeChild(child)
		}

	}

	// add elements
	const storage = readps();
	for (let i = 0; i < storage.length; i++) {
		const x = storage[i];
		
		comdisplay.innerHTML += `
			<tr>
			<td>${x.timestamp}</td>
			<td>${x.command}</td>
			</tr>
		`;
	}

}

updateComDisplay()




const ipconfigkey = "ipconfiginfo";

initSessionArray(ipconfigkey);

function loginterface(record) {
	addToSessionArray(record,ipconfigkey);
}

function readinterface() {
	const all = getSessionArray(ipconfigkey);
	return all;
}

let interfaceRequest = "interfacerequest";
initSessionArray(interfaceRequest);
