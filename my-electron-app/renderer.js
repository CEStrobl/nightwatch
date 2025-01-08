async function runcom(command) {
    // Try to send the command to the backend and get the result
    try {
        const result = await window.electronAPI.runCommand(command);
        // Log the result
        // console.log('Command Output:', result);
        return result;
    } catch (err) {
        // Log the error if execution fails
        console.error('Error executing command:', err);
        throw err;
    }
}

// Attach the `runcom` function to the global `window` object for direct access
window.runcom = runcom;

async function ping() {
	try {
		const result = await window.electronAPI.pingCommand();
		pingOutput.textContent = result;
	} catch (err) {
		pingOutput.textContent = 'Error: ' + err;
	}
}


