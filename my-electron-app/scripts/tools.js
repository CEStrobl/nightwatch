const logTime = (() => {
	let startTime = null; // Tracks the start time
	let lastTime = null;  // Tracks the last log time

	return (label) => {
		const now = performance.now();

		// Initialize the timer on "Start"
		if (label === "Start") {
			startTime = now;
			lastTime = now;
			console.log(`[00:00] ${label}`);
			return;
		}

		// Calculate elapsed time since the last log and the total runtime
		const elapsed = Math.round((now - lastTime) / 1000); // Elapsed seconds
		const totalElapsed = Math.round((now - startTime) / 1000); // Total runtime seconds

		// Format elapsed time for logging
		const minutes = String(Math.floor(totalElapsed / 60)).padStart(2, "0");
		const seconds = String(totalElapsed % 60).padStart(2, "0");
		const timeFormatted = `[${minutes}:${seconds}]`;

		// Log "Finish" with total runtime
		if (label === "Finish" || label === "Stop") {
			console.log(`${timeFormatted} ${label} - Total runtime: ${totalElapsed} seconds`);
			return;
		}

		// Log other steps
		console.log(`${timeFormatted} ${label}`);
		lastTime = now; // Update the last log time
	};
})();


function parsePowerShellTable(input) {
	input
		.trim()
		.split("\n")
		.map(line => {
			const [DriveLetter, FriendlyName, FileSystemType, DriveType, HealthStatus, OperationalStatus] = line.split("|");
			return { DriveLetter, FriendlyName, FileSystemType, DriveType, HealthStatus, OperationalStatus };
		});
}

function parseArpTable(input) {
	const lines = input.trim().split("\n").map(line => line.trim());
	const result = [];
	let currentInterface = null;

	for (let line of lines) {
		// Match interface lines like: "Interface: 192.168.19.114 --- 0x16"
		let interfaceMatch = line.match(/^Interface:\s+([\d\.]+)\s+---\s+(\S+)/);
		if (interfaceMatch) {
			currentInterface = {
				InterfaceIP: interfaceMatch[1],
				InterfaceID: interfaceMatch[2],
				Entries: [],
			};
			result.push(currentInterface);
			continue;
		}

		// Match ARP entries like: "10.128.128.128  98-18-88-c1-19-21  dynamic"
		let arpMatch = line.match(/^([\d\.]+)\s+([\w-]+)\s+(\w+)$/);
		if (arpMatch && currentInterface) {
			currentInterface.Entries.push({
				IPAddress: arpMatch[1],
				MACAddress: arpMatch[2],
				Type: arpMatch[3],
			});
		}
	}

	return result;
}

function isOddMAC(mac) {

	if(mac == undefined) {
		return true;
	}

	if (mac.startsWith("01-00-5E") || mac.startsWith("FF-FF-FF")) {
		return true;
	} else {return false;}
}

let ouiMap = '';

function initOui() {
	ouiMap = new Map(
		oui.trim().split(/\r?\n/).map(line => {
			const [prefix, manufacturer] = line.split(",").map(s => s.trim().toUpperCase());
			return [prefix, manufacturer];
		})
	);
}


function lookupOUI(macPrefix) {
	return ouiMap.get(macPrefix.toUpperCase()) || "Unknown OUI";
}

function getMacAddress(getNetNeighborOutput, targetIP) {
	// Split into lines and filter out empty lines
	const lines = getNetNeighborOutput.trim().split("\n").filter(line => line.trim());

	for (let line of lines) {
		// Normalize spaces and split columns
		const parts = line.trim().split(/\s+/);

		const ip = parts[1];
		const mac = parts[2].substring(0,8).toUpperCase();

		if (ip === targetIP) {
			return mac.substring(0,8).toUpperCase();
		}
	}

	return "00-00-00"; 
}

function getHostMacAddress(getNetNeighborOutput) {
	// Split into lines and filter out empty lines
	const lines = getNetNeighborOutput.trim().split("\n").filter(line => line.trim());
	for (let line of lines) {
		// Normalize spaces and split columns
		const parts = line.trim().split(/\s+/);
		
		const mac = parts[0];

		if (mac.includes("-")) {
			return mac.substring(0,8).toUpperCase();
		}

	}

	return "00-00-00"; 
}


function parseGetVolumeOutput(getVolumeOutput) {
    getVolumeOutput += ""; // Ensure input is a string
    console.log("Raw Get-Volume Output:\n", getVolumeOutput); // ✅ Step 1

    let volumes = [];

    // ✅ Step 2: See how we are splitting drives
    const entries = getVolumeOutput.split(/\n(?=DriveLetter\s+:)/);
    console.log("Split Entries:", entries);

    for (let entry of entries) {
        const lines = entry.split("\n").map(line => line.trim()).filter(line => line);

        let drive = {
            DriveLetter: "N/A",
            FileSystemLabel: "N/A",
            FileSystemType: "N/A",
            DriveType: "N/A",
            HealthStatus: "N/A",
            OperationalStatus: "N/A",
            SizeRemaining: "N/A",
            Size: "N/A"
        };

        for (let line of lines) {
            const parts = line.split(":");

            if (parts.length >= 2) {
                const key = parts[0].replace(/\s+/g, ""); // Remove spaces from keys
                const value = parts.slice(1).join(":").trim(); // Preserve colons in values

                if (drive.hasOwnProperty(key)) {
                    drive[key] = value;
                }
            }
        }

        // ✅ Step 3: Check each drive before adding
        console.log("Parsed Drive Before Adding:", drive);
        volumes.push(drive);
    }

    // ✅ Final Output Check
    console.log("Final Parsed Drives:");
    console.table(volumes);
    return volumes;
}




function formatBytes(bytes) {
    bytes = parseInt(bytes, 10); 

    if (isNaN(bytes) || bytes < 0) return "0 B"; 

    if (bytes >= 1_000_000_000) return Math.floor(bytes / 1_000_000_000) + " GB";
    if (bytes >= 256_000_000) return Math.floor(bytes / 1_000_000_000) + " GB"; 
    if (bytes >= 1_000_000) return Math.floor(bytes / 1_000_000) + " MB";
    if (bytes >= 1_000) return Math.floor(bytes / 1_000) + " KB";

    return bytes + " B";
}


