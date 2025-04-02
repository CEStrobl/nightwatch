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
	const d = new Date();

	const hours = d.getHours();
	const minutes = d.getMinutes();
	const seconds = d.getSeconds();
	const timeFormatted = `[${hours}:${minutes}:${seconds}]`;

	const day = d.getDate();
	const month = d.getMonth()+1;
	const year = d.getFullYear();

	const date = `${month}/${day}/${year}`

	let record = {
		command: command,
		timestamp: timeFormatted,
		date: date,
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



console.table(readps())


