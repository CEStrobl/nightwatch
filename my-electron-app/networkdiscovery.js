initOui();

async function createIpCard(ip, time, status, index) {
	let netresult = 0;
	let mac = 0;
	try {
		netresult = await execute(`Get-NetNeighbor ${ip}`)
		mac = getMacAddress(netresult, ip);
	} catch {
		netresult = await execute(`getmac`);
		mac = getHostMacAddress(netresult);
	}
	
	let device = {
		name: "-",
		mac: mac,
		index: index,
		ip: ip,
		vendor: cleanVendor(mac),
		ping: time,
		status: status,
	};
	
	const x = await execute(
		`try {$hostname = [System.Net.Dns]::GetHostEntry('${ip}').HostName} catch {$hostname = "Unnamed Device"} Write-Host $hostname`
	);
	
	const hostname = x.trim() || "Unnamed Device";
	
	device.name = hostname.replace("Unnamed", device.vendor.split(" ")[0]);

	if(!isOddMAC(device.mac)) {
		
		// init net card
		let parent = document.getElementById("sweepnetcontainer");
		const card = document.createElement("div");
		card.className = "netcard card";
		card.id = "netdevice"+index;
		parent.appendChild(card);

		card.innerHTML =
		`
			<div class="net-header" id="device${device.index}">
				<h1>${device.name}</h1>
				<h3>${device.ip}</h3>
			</div>
			<div class="divline"></div>
			<div class="row-details">
				<div class="block pingblock" id="${"device"+device.index+"ping"}">
				<span class="status-dot online"></span>	
					${device.ping}
				</div>
				<div class="block">
					${device.mac}
				</div>
				<div class="block">
					${device.vendor}
				</div>
				
			</div>
		`
	}

}

async function pingHost(ip) {
	const result = await execute(
		`try {$ping = ping -n 1 -w 500 ${ip}} catch {$ping = "No Response"} Write-Host $ping`
	);

	if (result == undefined || result.includes("No Response")) {
		return { ip, status: "Offline", time: "0ms" };
	} else {

		// Extract response time (matches "time=3ms" or "time<1ms")
		const match = result.match(/time[=<](\d+)ms/);
		const time = match ? `${match[1]}ms` : "N/A";
	
		const isOnline = result.includes("Reply from");
		return { ip, status: isOnline ? "Online" : "Offline", time };
	}

}

let onlineDevices = [];

async function pingSweep(network) {

	onlineDevices = [];

	
	// Generate IP addresses in the subnet
	let ips = [];
	for (let i = 1; i <= 254; i++) {
		const ip = `${network}.${i}`;
		ips.push(ip);
	}
	const batchSize = 5;

	let index = 0;

	for (let i = 0; i < ips.length; i += batchSize) {

		let percent = Math.round((i / ips.length) * 100);

		updateProgress(`Scanning network ${network}.x ...`, percent);

		if( i > 0 ) {bar.innerText = i;}
		
		// Get the next batch of x and Run them in parallel
		const batch = ips.slice(i, i + batchSize); 
		const results = await Promise.all(batch.map(ip => pingHost(ip))); 

		results.forEach(({ ip, status, time }) => {
			if (status === "Online") {
				onlineDevices.push({ ip, status, ms: time });

				createIpCard(ip, time, status, index);

				index++;
			}
		});
	}

	endProgress();

	return true;
}


function clearIpCards() {
	let parent = document.getElementById("sweepnetcontainer");
	let length = parent.children.length;

	for (let i = 0; i < length; i++) {
		parent.removeChild(parent.children[0])
	}
}

function fillNetworkOptions() {
	const networkselect = document.getElementById("network");

	const storedInterfaces = readinterface();
	for (let i = 0; i < storedInterfaces.length; i++) {
		const x = storedInterfaces[i];
		
		let ip = x.IPv4Address.split(".").slice(0, 3).join(".");

		if (ip != "N/A" && ip != "0.0.0") {
			networkselect.innerHTML += `
			<option value="${ip}">${ip}.x</option>
			`
		}
		
	}

	enableButton();

}

async function prediscover() {

	loadingButton();

	// if interface has not been requested, then get it + store it
	if(readinterface().length == 0 || !readinterface()) {
		const ipconfigresults = await execute(`Get-NetIPConfiguration | Select-Object InterfaceAlias, IPv4Address,interfaceindex, InterfaceDescription | Format-List`);
		parseInterfaceOutput(ipconfigresults); // stores it also
	}
	
	fillNetworkOptions();

}

prediscover();

async function discover() {

	startProgress();
	
	clearIpCards();

	const selection = document.getElementById("network").value;
	
	pingSweep(selection);
	

}
