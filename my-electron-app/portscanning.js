const portMap = {
	22: "SSH",
	80: "HTTP",
	443: "HTTPS",
	3389: "RDP",
	21: "FTP",
	23: "Telnet",
	25: "SMTP",
	53: "DNS",
	110: "POP3",
	139: "NetBIOS",
	8080: "HTTP",
	445: "SMB"
};

async function scanPort(ip, port) {
	const psCommand = `if ((Test-NetConnection -ComputerName ${ip} -Port ${port} -WarningAction SilentlyContinue).TcpTestSucceeded) { Write-Host "Open" } else { Write-Host "Closed" }`;

	const result = await execute(psCommand);

	console.log(`Scan ${ip}:${port} →`, result);

	return {
		port,
		protocol: portMap[port] || "Unknown",
		status: result ? result.trim() : "No Response"
	};
}




async function portScanSingleIP(ip) {
	const portsToScan = [22, 80, 443, 3389, 8080, 445];
	const results = [];

	console.log(`\n${ip}\n-----------`);

	for (let port of portsToScan) {
		const portInfo = await scanPort(ip, port);
		results.push(portInfo);

		console.log(`${portInfo.port}/TCP ${portInfo.protocol} ${portInfo.status}`);
	}

	return {
		ip,
		ports: results
	};
}

async function portScanning() {
	// const ip = document.getElementById("portipinput").value

	const ip = "10.0.0.53"

	portScanSingleIP(ip)
}