function parseNetTCPConnection(output) {
	output += ""
	const lines = output.split("\n").map(line => line.trim()).filter(line => line); // Clean lines
	const results = [];

	// Port-to-Protocol Mapping (Expand as Needed)
	const portProtocols = {
		21: "FTP",
		22: "SSH",
		25: "SMTP",
		53: "DNS",
		80: "HTTP",
		443: "HTTPS",
		3389: "RDP",
		5900: "VNC",
		3306: "MySQL",
		5432: "PostgreSQL",
		25565: "Minecraft Server"
	};

	for (let line of lines) {
		const parts = line.split(/\s+/); // Split by whitespace

		let a = "";

		for (let i = 0; i < parts.length; i++) {
			const x = parts[i];
			a += `${x}, `;
		}

		console.log(a)

		// const port = parseInt(parts[1]); // Extract port number
		// const state = parts[3]; // Extract state (Listening, Established, etc.)

		// if (!isNaN(port)) {
		// 	results.push({
		// 		port,
		// 		protocol: portProtocols[port] || "Unknown", // Lookup protocol or default to "Unknown"
		// 		status: state
		// 	});
		// }
	}

	return results;
}

async function portScanning() {
	// Example PowerShell Output
	const powerShellOutput = await execute(`Get-NetTCPConnection`);
	
	// Parse and Output Results
	const parsedPorts = parseNetTCPConnection(powerShellOutput);
	console.table(parsedPorts);

}

portScanning()

