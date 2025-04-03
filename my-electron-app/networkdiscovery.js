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

let progress = 0;
let bar = 0;

const startButton = document.getElementById("startButton");

function createProgressBar() {
	let parent = document.getElementById("progressbarconatainer");

	parent.innerHTML=
	`
	<p id="progressStatus"></p>
	<div class="progress-container">
		<div id="progressStatusBar" class="progress-bar" style="width: 0%"></div>
	</div>
	`	
	progress = document.getElementById("progressStatus");
	bar = document.getElementById("progressStatusBar");
}

async function pingHost(ip) {
	const result = await execute(
		`try {$ping = ping -n 1 -w 500 ${ip}} catch {$ping = "No Response"} Write-Host $ping`
	)

	console.log(result)

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

	logTime("Start");

	onlineDevices = [];

	const ips = Array.from({ length: 254 }, (_, i) => `${network}.${i + 1}`);
	const batchSize = 5;

	progress.className += " loading";

	let index = 0;

	for (let i = 0; i < ips.length; i += batchSize) {
		
		progress.innerText = `Scanning network ${network}.x ...`;
		bar.style.width =`${Math.round((i / ips.length) * 100)}%`;

		if(i>0){bar.innerText = i;}
		
		// Get the next batch of 15 + Run them in parallel
		const batch = ips.slice(i, i + batchSize); 
		const results = await Promise.all(batch.map(ip => pingHost(ip))); 

		results.forEach(({ ip, status, time }) => {
			if (status === "Online") {
				onlineDevices.push({ ip, status, ms: time });

				createIpCard(ip, time, status, index);

				index++;
			}
		});
		logTime(`Scanned ${i + batch.length} IPs so far...`);
	}

	progress.style.display = 'none';
	bar.style.display = 'none';

	console.log(`Scan Complete. Found ${onlineDevices.length} devices. `);
	logTime("Finish");

	enableButton();
	return true;
}


function clearIpCards() {
	let parent = document.getElementById("sweepnetcontainer");
	let length = parent.children.length;

	for (let i = 0; i < length; i++) {
		parent.removeChild(parent.children[0])
	}
}

function disableButton() {
	startButton.innerText = "In Progress...";
	startButton.disabled = true;
	startButton.style.color = "#ffffff65";
}

function enableButton(){
	startButton.innerText = "Start";
	startButton.disabled = false;
	startButton.style.color = "#ffffff";
}


async function discover() {

	disableButton()

	const selection = document.getElementById("subnet").value;

	clearIpCards();

	createProgressBar();
	
	pingSweep(selection);
	

}
