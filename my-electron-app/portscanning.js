function parseNetTCPConnection(output) {
	output += "";
	const lines = output.split("\n").map(line => line.trim()).filter(line => line); // Clean lines
	const results = [];

	// Port-to-Protocol Mapping
	const portProtocols = {
		20: "FTP",
		21: "FTP",
		22: "SSH",
		23: "Telnet",
		25: "SMTP",
		53: "DNS",
		67: "DHCP",
		68: "DHCP",
		80: "HTTP",
		88: "Kerberos",
		110: "POP3",
		119: "NNTP",
		123: "NTP",
		161: "SNMP",
		162: "SNMP",
		443: "HTTPS",
		902: "VMware Server",
		3074: "XBOX Live",
		3306: "MySQL",
		3389: "RDP",
		5900: "VNC",
		5432: "PostgreSQL"
	};

	let lineCount = 0;

	for (let line of lines) {
		const parts = line.split(/\s+/); 

		if (lineCount > 1) {
			const port = parseInt(parts[1]);

			let portObj = {
				localAddress: parts[0],
				localPort: port,
				remoteAddress: parts[2],
				protocol: portProtocols[port] || "Unknown"
			};
	
			results.push(portObj);
		}

		lineCount++;
	}

	return results;
}


function categorizeConnections(connections) {
    const categorized = {
        localOnly: [],
        internalLAN: [],
        listeningAll: [],
        external: []
    };

    connections.forEach(conn => {
        const { localAddress, localPort, remoteAddress } = conn;

        if (localAddress === "127.0.0.1" || localAddress === "::1") {
            categorized.localOnly.push(conn); // Localhost connections
        } else if (localAddress.startsWith("192.168.") || localAddress.startsWith("10.") ||
                   (localAddress.startsWith("172.") && parseInt(localAddress.split(".")[1]) >= 16 &&
                    parseInt(localAddress.split(".")[1]) <= 31)) {
            categorized.internalLAN.push(conn); // Internal LAN connections
        } else if (localAddress === "0.0.0.0" || localAddress === "::") {
            categorized.listeningAll.push(conn); // Listening on all interfaces
        } else {
            categorized.external.push(conn); // External connections (Internet)
        }
    });

    return categorized;
}

async function portScanning() {
	// Example PowerShell Output
	const powerShellOutput = await execute(`Get-NetTCPConnection`);
	
	// Parse and Output Results
	const parsedPorts = parseNetTCPConnection(powerShellOutput);

	const categorized = categorizeConnections(parsedPorts);

	console.table(categorized);

}

portScanning()

