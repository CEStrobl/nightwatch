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

let findHostname = window.electronAPI.getHostname;

async function hostnamecom(ip) {
	try {
		const result = await window.electronAPI.getHostname(ip);
		return result;
	} catch (err) {
		throw err;
	}
}