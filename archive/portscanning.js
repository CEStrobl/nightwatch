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
		43: "WHOIS",
		49: "TACACS",
		53: "DNS",
		67: "DHCP",
		68: "DHCP",
		69: "TFTP",
		70: "Gopher",
		79: "Finger",
		80: "HTTP",
		88: "Kerberos",
		110: "POP3",
		119: "NNTP",
		123: "NTP",
		135: "RPC",
		143: "IMAP4",
		161: "SNMP",
		162: "SNMP",
		264: "BGMP",
		318: "TSP",
		389: "LDAP",
		443: "HTTPS",
		445: "SMB",
		587: "SMTP",
		636: "LDAP (SSL)",
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

		console.log(parts, port)

		if (Number.isInteger(port)) {

			let portObj = {
				localAddress: parts[0],
				localPort: port,
				protocol: portProtocols[port] || "",
				status: parts[2],
			};
	
			results.push(portObj);
		}
	}

	return results;
}


function groupConnectionsByIP(connections) {
	const grouped = {};

	connections.forEach(conn => {
		const ip = conn.localAddress;

		if (!grouped[ip]) {
			grouped[ip] = [];
		}

		grouped[ip].push({
			localPort: conn.localPort,
			protocol: conn.transport || "TCP", // fallback to TCP
			status: conn.status
		});
	});

	return grouped;
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
	const powerShellOutput = await execute(`Get-NetTCPConnection | Select-Object localAddress, LocalPort, State`);
	
	// Parse and Output Results
	const parsedPorts = parseNetTCPConnection(powerShellOutput);
	
	const grouped = groupConnectionsByIP(parsedPorts);

	console.log("grouped")
	console.table(grouped)

	// for (const property in categorized) {
	// 	for (let i = 0; i < categorized[property].length; i++) {
	// 		const x = categorized[property][i];
			
	// 		createPortBlock(x, property);
	// 	}
	// }

}

