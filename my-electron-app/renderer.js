const pingOutput = document.getElementById('pingOutput');

async function ping() {
    try {
        const result = await window.electronAPI.pingCommand();
        pingOutput.textContent = result;
    } catch (err) {
        pingOutput.textContent = 'Error: ' + err;
    }
}

async function getDrives() {
    try {
        // Fetch drive information from the PowerShell function
        const drives = await window.electronAPI.getDrives('all', -1, 'DriveLetter');

        // Parse the response into lines (assuming drives are separated by line breaks)
        const driveLines = drives.trim().split('\n');

        // Clear previous drive information
        for (let i = 0; i < 4; i++) {
            const driveElement = document.getElementById(`drive${i}`);
            if (driveElement) {
                driveElement.innerText = '';  // Clear previous text
            }
        }

        // Update each <p> element based on the drive information received
        driveLines.forEach((driveInfo, index) => {
            const driveElement = document.getElementById(`drive${index}`);
            if (driveElement) {
                driveElement.innerText = driveInfo;
            }
        });
    } catch (error) {
        console.error("Error fetching drive information:", error);
    }
}
