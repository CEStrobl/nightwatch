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
	getVolumeOutput += "";

	// Split into two sections: Volume Info and Friendly Name Mapping
	const sections = getVolumeOutput.trim().split("=====");

	console.log("sections")
	console.table(sections)
	
	const volumeData = sections[0].trim().split("\n\n").filter(drive => drive.trim())+"";
	const nameData = sections[1].trim().split("\n\n").filter(entry => entry.trim()) +"";

	console.log("Raw Drive Entries:");
	console.table(volumeData);

	console.log("Raw Name Entries:");
	console.table(nameData);

	// Create a mapping of DriveLetter -> FriendlyName
	const friendlyNameMap = {};
	for (let entry of nameData) {
		const lines = entry.split("\n").map(line => line.trim());
		let letter = "N/A";
		let name = "N/A";

		for (let line of lines) {
			const parts = line.split(":").map(part => part.trim());
			if (parts[0] === "DriveLetter") letter = parts[1] + "";
			if (parts[0] === "FriendlyName") name = parts.slice(1).join(":") + "";
		}

		friendlyNameMap[letter] = name;
	}

	console.log("Mapped Friendly Names:");
	console.table(friendlyNameMap);

	const results = [];

	// Process the main volume data
	for (let drive of volumeData) {
		const lines = drive.split("\n").map(line => line.trim());

		let driveObj = {
			letter: "N/A",
			friendlyName: "N/A",
			fileSysType: "N/A",
			driveType: "N/A",
			healthStatus: "N/A",
			operationalStatus: "N/A",
			remainingSpace: "N/A",
			totalSpace: "N/A",
		};

		for (let line of lines) {
			const parts = line.split(":").map(part => part.trim());

			const key = parts[0] + "";
			const value = parts.slice(1).join(":") + "";

			if (key === "DriveLetter") driveObj.letter = value;
			if (key === "FileSystemType") driveObj.fileSysType = value;
			if (key === "DriveType") driveObj.driveType = value;
			if (key === "HealthStatus") driveObj.healthStatus = value;
			if (key === "OperationalStatus") driveObj.operationalStatus = value;
			if (key === "SizeRemaining") driveObj.remainingSpace = value;
			if (key === "Size") driveObj.totalSpace = value;
		}

		// Map FriendlyName using DriveLetter
		driveObj.friendlyName = friendlyNameMap[driveObj.letter] || "N/A";

		console.log("Parsed Drive Object:");
		console.table([driveObj]);
		results.push(driveObj);
	}

	console.log("Final Parsed Drive List:");
	console.table(results);
	return results;
}
