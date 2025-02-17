let cl = console.log

async function runcom(command) {
	try {
		const result = await window.electronAPI.runCommand(command);
		return result;
	} catch (err) {
		throw err;
	}
}

let execute = window.electronAPI.runCommand;