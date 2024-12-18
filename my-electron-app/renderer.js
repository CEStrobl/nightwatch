const pingOutput = document.getElementById('pingOutput');

async function ping() {
	try {
		const result = await window.electronAPI.pingCommand();
		pingOutput.textContent = result;
	} catch (err) {
		pingOutput.textContent = 'Error: ' + err;
	}
}

const pingOutputNew = document.getElementById('pingOutputNew');

async function pingNew() {
	try {
		const result = await window.electronAPI.pingNew();
		pingOutputNew.textContent = result;
	} catch (err) {
		pingOutputNew.textContent = 'Error: ' + err;
	}
}


