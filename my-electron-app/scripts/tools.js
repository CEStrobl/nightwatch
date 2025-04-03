/**

	Welcome to tools.js

	This file contains powershell output parsers, debugging tools,
	and oui handlers. These are useful functions that may need to 
	be used in several places. 

*/

/** 
Log Time

displays the time stamp in addition to whatever youre console.log-ing

also acts as a stopwatch. pass it "Start" and "Stop" to start or stop the 
stopwatch

@param label console.log input
*/
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

/**
 * Takes time variables and formats them to dd:hh:mm:ss
 * 
 * example: [1, 2, 35, 0] returns 01:02:35:00
 * @param {array} array
 * @returns dd:hh:mm:ss
 */
function formatTime(array) {

	let retVal = [];

	for (let i = 0; i < array.length; i++) {
		let x = array[i];

		// cast to string
		x += "";

		// add leading 0's
		x = x.padStart(2, "0");

		retVal.push(x)
		
	}

	// add colon for time format
	retVal = retVal.join(":")

	return retVal;
}





/**
 * returns the current date in mm/dd/yy format
 * @returns mm/dd/yy
 */
function getTodaysDate(){
	const d = new Date();
	const day = d.getDate();
	const month = d.getMonth()+1;
	const year = d.getFullYear()[2] + d.getFullYear()[3];

	return `${month}/${day}/${year}`
}

/**
 * returns the current time stamp in hh:mm:ss format
 * @returns hh:mm:ss
 */
function getTimestamp(){
	const d = new Date();

	const hours = d.getHours();
	const minutes = d.getMinutes();
	const seconds = d.getSeconds();
	return formatTime([hours, minutes, seconds]);
}

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

/**
 * some mac addresses are really common but are unknown on the oui table. 
 * this helps filter those out. 
 * 
 * @param {string} mac partial or full mac address
 * @returns {boolean}
 */
function isOddMAC(mac) {

	let retVal = true;

	// error handling
	if(mac == undefined) {
		retVal = true;
	}
	// common, yet irrelevant mac addresses
	else if (mac.startsWith("01-00-5E") || mac.startsWith("FF-FF-FF")) {
		retVal = true;
	}
	else {retVal = false;}

	return retVal;
}

let ouiMap = '';

/**
 * parses the giant oui string into a map of mac addresses and their vendor
 */
function initOui() {
	ouiMap = new Map(
		oui.trim().split(/\r?\n/).map(line => {
			const [prefix, manufacturer] = line.split(",").map(s => s.trim().toUpperCase());
			return [prefix, manufacturer];
		})
	);
}

/**
 * @param {string} macPrefix 
 * @returns {string} vendor || Unknown OUI
 */
function lookupOUI(macPrefix) {
	return ouiMap.get(macPrefix.toUpperCase()) || "Unknown OUI";
}

/**
 * 
 * @param {string} getNetNeighborOutput 
 * @param {string} targetIP 
 * @returns 
 */
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

	let volumes = [];

	const entries = getVolumeOutput.split(/\n(?=DriveLetter\s+:)/);

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
				const key = parts[0].replace(/\s+/g, "");
				const value = parts.slice(1).join(":").trim();

				if (drive.hasOwnProperty(key)) {
					drive[key] = value;
				}
			}
		}

		volumes.push(drive);
	}
	return volumes;
}

/**
 * takes a byte input and converts it to the correct unit and value
 * @param {int} bytes 
 * @returns {string} 0 B format
 */
function formatBytes(bytes) {
	bytes = parseInt(bytes, 10); 

	let retVal = "";

	// error handing
	if (isNaN(bytes) || bytes < 0) retVal = "0 B"; 

	else if (bytes >= 1_000_000_000_000) retVal = Math.round(bytes / 1_000_000_000_000) + " TB";
	else if (bytes >= 1_000_000_000) retVal = Math.round(bytes / 1_000_000_000) + " GB";
	else if (bytes >= 256_000_000) retVal = Math.round(bytes / 1_000_000_000) + " GB"; 
	else if (bytes >= 1_000_000) retVal = Math.round(bytes / 1_000_000) + " MB";
	else if (bytes >= 1_000) retVal = Math.round(bytes / 1_000) + " KB";
	else retVal = bytes + " B";

	return retVal;
}

function cleanVendor(fullmac) {
	let vendor = lookupOUI(fullmac.substring(0,8).toUpperCase());
	vendor += ""
	vendor.replace("THE ", ""); // removes "the" from the name
	let words = vendor.split(" ");

	const maxCharCount = 15;

	// keep reducing the word count til it is less than the max character amount
	for (let i = 4; i > 0; i--) {

		if(vendor.length > maxCharCount){
			vendor = words.slice(0, i).join(" ");
		}
		
	}

	return vendor;
}

function cleanAdapterName(name) {
	// Remove full sets of parentheses and trim spaces
	let cleaned = name.replace(/\s*\(.*?\)/g, "").trim();

	// If a stray closing parenthesis remains, remove it
	cleaned = cleaned.replace(/\)$/, "").trim();

	// If name has more than two words, keep only the first two
	let words = cleaned.split(" ");
	if (cleaned.length > 12) {
		cleaned = words.slice(0, 2).join(" ");
		if (cleaned.length > 12) {
			cleaned = words.slice(0, 1).join(" ");

		}
	}

	return cleaned;
}

function cleanAdapterDesc(desc) {
	// Remove full sets of parentheses and trim spaces
	let cleaned = desc.replace(/\s*\(.*?\)/g, "").trim();

	// If a stray closing parenthesis remains, remove it
	cleaned = cleaned.replace(/\)$/, "").trim();

	// If name has more than two words, keep only the first two
	let words = cleaned.split(" ");
	if (cleaned.length > 43) {
		cleaned = words.slice(0, 5).join(" ");
		if (cleaned.length > 43) {
			cleaned = words.slice(0, 4).join(" ");

		}
	}

	return cleaned;
}



function parseNetAdapterOutput(netAdapterOutput) {
	netAdapterOutput += ""; // Ensure it's a string

	let adapters = [];

	// Split entries by detecting the start of a new adapter block
	const entries = netAdapterOutput.split(/\n(?=Name\s+:)/);

	for (let entry of entries) {
		const lines = entry.split("\n").map(line => line.trim()).filter(line => line);

		let adapter = {
			Name: "N/A",
			InterfaceDescription: "N/A",
			ifIndex: "N/A",
			Status: "N/A",
			MacAddress: "N/A",
			LinkSpeed: "N/A"
		};

		for (let line of lines) {
			const parts = line.split(":");

			if (parts.length >= 2) {
				const key = parts[0].replace(/\s+/g, "");
				const value = parts.slice(1).join(":").trim();

				if (adapter.hasOwnProperty(key)) {
					if(key == "Name") {
						adapter[key] = cleanAdapterName(value);
					}
					else if (key == "InterfaceDescription") {
						adapter[key] =  cleanAdapterDesc(value);
					}
					
					else {
						adapter[key] = value;
					}
				}
			}
		}
		if (adapter.ifIndex != "N/A") {
			adapters.push(adapter);
		}

	}
	return adapters;
}


function parseUptimeOutput(output) {
	output += ""; // Ensure it's a string
	const lines = output.trim().split("\n").filter(line => line.trim());

	const uptime = {
		days: "00",
		hours: "00",
		minutes: "00",
		seconds: "00"
	};

	for (let line of lines) {
		const [rawKey, rawValue] = line.split(":");
		const key = rawKey.trim().toLowerCase() + "";
		const value = parseInt(rawValue.trim());

		if (isNaN(value)) continue;

		const padded = String(value).padStart(2, "0");

		switch (key) {
			case "days": uptime.days = padded; break;
			case "hours": uptime.hours = padded; break;
			case "minutes": uptime.minutes = padded; break;
			case "seconds": uptime.seconds = padded; break;
		}
	}

	return uptime;
}


