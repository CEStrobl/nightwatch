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
}

function readps() {
	const all = getSessionArray(pskey);
	return all;
}


console.table(readps())


