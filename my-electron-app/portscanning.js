const portProtocols = {
	// 20: "FTP",
	// 21: "FTP",
	22: "SSH",
	// 23: "Telnet",
	// 25: "SMTP",
	// 43: "WHOIS",
	// 49: "TACACS",
	53: "DNS",
	// 67: "DHCP",
	// 68: "DHCP",
	// 69: "TFTP",
	// 70: "Gopher",
	// 79: "Finger",
	80: "HTTP",
	// 88: "Kerberos",
	// 110: "POP3",
	// 119: "NNTP",
	// 123: "NTP",
	135: "RPC",
	// 143: "IMAP4",
	// 161: "SNMP",
	// 162: "SNMP",
	// 264: "BGMP",
	// 318: "TSP",
	389: "LDAP",
	443: "HTTPS",
	// 445: "SMB",
	587: "SMTP",
	// 636: "LDAP (SSL)",
	// 902: "VMware Server",
	// 3074: "XBOX Live",
	// 3306: "MySQL",
	3389: "RDP",
	// 5357: "WSD",
	// 5900: "VNC",
	// 5040: "RDMA",
	// 5040: "RDMA",
	// 5432: "PostgreSQL"
};



function createPortCard(ip, port, protocol, status) {

	let statusclass = "";

	status+="";

	if (status.toLowerCase() === "filtered") {
		statusclass="filter";
	} 
	else {
		statusclass = status.toLowerCase();

	}
	statusclass += "portstatus";

	const parent = document.getElementById("portcontainer"+ip);
	const card = document.createElement("div");

	card.className = `portblock ${statusclass}`;
	card.id = "portcard" + port;
	
	card.innerHTML =
	`
	<h1>${port}</h1>
	<h2>${protocol}</h2>
	<div class="portstatus">${status}</div>
	`;

	parent.appendChild(card);
}

async function scanPort(ip, port, percent) {
	const psCommand = `if ((Test-NetConnection -ComputerName ${ip} -Port ${port} -WarningAction SilentlyContinue).TcpTestSucceeded) { Write-Host "Open" } else { Write-Host "Closed" }`;

	const result = await execute(psCommand);

	// console.log(`Scan ${ip}:${port} →`, result);

	return {
		port,
		protocol: portProtocols[port] || "Unknown",
		status: result ? result.trim() : "No Response"
	};
}


function initContainer(ip) {

	// clear the container if one exists for this ip
	const existingContainer = document.getElementById("portcontainer" + ip);
	if (existingContainer) {
		existingContainer.innerHTML="";
	} else {
		// Create a container for this port scan results
		const parent = document.getElementById("portscancontainer");
		const container = document.createElement("div");
		container.innerHTML = `
		<div class="deviceports">
			<h2>${ip}</h2>
			<div class="divline"></div>
			<div class="netcontainer" id="portcontainer${ip}">
			</div>
		</div>`;
		parent.appendChild(container);
	}
}


async function portScanSingleIP(ip) {
	const portsToScan = Object.keys(portProtocols).map(Number);
	const results = [];

	initContainer(ip);

	for (let i = 0; i < portsToScan.length; i++) {
		const port = portsToScan[i];
		const percent = Math.round((i / portsToScan.length) * 100);

		updateProgress(`Scanning ${ip}:${port}`, percent);

		const portInfo = await scanPort(ip, port, percent);
		results.push(portInfo);

		// console.log(`${portInfo.port} ${portInfo.protocol} ${portInfo.status}`);

		createPortCard(ip, portInfo.port, portInfo.protocol, portInfo.status);
	}

	endProgress();

	return {
		ip,
		ports: results
	};
}

async function portScanning() {

	if (validInputIP("Validate")) { 

		startProgress();
		const ip = document.getElementById("ipInput").value;
	
		portScanSingleIP(ip);
	}

}