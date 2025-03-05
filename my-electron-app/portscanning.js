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
		135: "RPC",
		161: "SNMP",
		162: "SNMP",
		443: "HTTPS",
		445: "SMB",
		902: "VMware Server",
		3074: "XBOX Live",
		3306: "MySQL",
		3389: "RDP",
		5357: "WSD",
		5900: "VNC",
		5040: "RDMA",
		5040: "RDMA",
		5432: "PostgreSQL"
	};

	for (let line of lines) {
		const parts = line.split(/\s+/); 
		const port = parseInt(parts[1]);

		if (Number.isInteger(port)) {

			let portObj = {
				localAddress: parts[0],
				localPort: port,
				protocol: portProtocols[port] || "",
				remoteAddress: parts[2],
			};
	
			results.push(portObj);
		}
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

		// Localhost connections
		if (localAddress === "127.0.0.1" || localAddress === "::1") {
			categorized.localOnly.push(conn); 
		}
		
		// Internal LAN connections
		else if (localAddress.startsWith("192.168.") || localAddress.startsWith("10.") ||
				   (localAddress.startsWith("172.") && parseInt(localAddress.split(".")[1]) >= 16 &&
					parseInt(localAddress.split(".")[1]) <= 31)) {
			categorized.internalLAN.push(conn);
		}
		
		// Listening on all interfaces
		else if (localAddress === "0.0.0.0" || localAddress === "::") {
			categorized.listeningAll.push(conn);
		}
		
		// External connections (Internet)
		else {
			categorized.external.push(conn);
		}
	});

	return categorized;
}

function createPortBlock(obj, parentID) {
	
	const parent = document.getElementById(parentID);

	const card = document.createElement("div");
	
	card.innerHTML = `
	<div class="portblock">
		<h4>${obj.localAddress}</h4>
		<h2>${obj.localPort}</h2>
		<h4>${obj.protocol}</h4>
	</div>`

	parent.appendChild(card);
}


async function portScanning() {
	// Example PowerShell Output
	const powerShellOutput = await execute(`Get-NetTCPConnection`);
	
	// Parse and Output Results
	const parsedPorts = parseNetTCPConnection(powerShellOutput);

	const categorized = categorizeConnections(parsedPorts);

	for (const property in categorized) {
		for (let i = 0; i < categorized[property].length; i++) {
			const x = categorized[property][i];
			
			createPortBlock(x, property);
		}
	}

}

portScanning()

