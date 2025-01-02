const pingOutput = document.getElementById('pingOutput');
const comout = document.getElementById('comout');
const comout2 = document.getElementById('comout2');

async function runcom(command) {
	
	const fs = require('fs');

	// Write data to a file synchronously
	fs.writeFileSync('command.txt', command, 'utf-8');
	console.log('File written successfully!');

	try {
		// Run Command
		const result = await window.electronAPI.runCommand();

		// Print Results
		comout.textContent = result;

	} catch (err) {
		comout.textContent = 'Error: ' + err;
	}
}


async function ping() {
	try {
		const result = await window.electronAPI.pingCommand();
		pingOutput.textContent = result;
	} catch (err) {
		pingOutput.textContent = 'Error: ' + err;
	}
}


