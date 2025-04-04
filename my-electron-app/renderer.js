let cl = console.log

async function execute(command) {
	logps(command);
	const result = await window.electronAPI.runCommand(command);
	return result;
}