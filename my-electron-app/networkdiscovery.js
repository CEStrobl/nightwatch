const progress = document.getElementById("progressStatus")
const bar = document.getElementById("progressStatusBar")

initOui()

async function createIpCard(ip, time, status, index) {
	
	const netresult = await execute(`Get-NetNeighbor ${ip}`);
	const mac = getMacAddress(netresult, ip);

	console.log(ip, time, status, index, mac)


	let device = {
		name: "-",
		mac: mac,
		index: index,
		ip: ip,
		vendor: lookupOUI(mac),
		ping: time,
		status: status,
	};

	console.table(device)

	if(!isOddMAC(device.mac)) {
		
		// init net card
		let parent = document.getElementById("sweepnetcontainer");
		const card = document.createElement("div");
		card.className = "netcard card";
		card.id = "netdevice"+index;
		parent.appendChild(card);

		// shorten vendor to two words if its too long
		if(device.vendor.length > 12) {
			device.vendor = device.vendor.split(" ")[0] + " " + device.vendor.split(" ")[1]
		}
	
		const x = await execute(
			`$hostname=''; 
			try { $temp=(Resolve-DnsName '${device.ip}' -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NameHost); if ($temp) { $hostname=$temp } } catch {}; 
			try { if (-not $hostname) { $temp=([System.Net.Dns]::GetHostEntry('${device.ip}').HostName); if ($temp) { $hostname=$temp } } } catch {}; 
			[Console]::WriteLine($hostname)`
		);
		
		const hostname = x.trim() || "Unnamed Device";
	
		device.name = hostname.replace("Unnamed", device.vendor.split(" ")[0]);
	
		card.innerHTML =
		`
			<div class="net-header" id="device${device.index}">
				<h1>${device.name}</h1>
				<h3>${device.ip}</h3>
			</div>
			<div class="divline"></div>
			<div class="row-details">
				<div class="block" id="${"device"+device.index+"ping"}">
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
    const result = await execute(`
        $output = ping -n 1 -w 500 ${ip} 2>$null;
        if ($?) { $output } else { Write-Output "Ping Failed" }
    `);

    if (!result || result.includes("Ping Failed")) { // Handle failures
        return { ip, status: "Offline", time: "0ms" };
    }

    // Extract response time (matches "time=3ms" or "time<1ms")
    const match = result.match(/time[=<](\d+)ms/);
    const time = match ? `${match[1]}ms` : "N/A";

    return { ip, status: result.includes("Reply from") ? "Online" : "Offline", time };
}

async function printOnlineDevices(devices) {
	console.log("Live Online Devices:");
	console.table(devices);
}

async function pingSweep(network) {
	let onlineDevices = [];
	const ips = Array.from({ length: 254 }, (_, i) => `${network}.${i + 1}`);
	const batchSize = 15;

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

		console.log(`Scanned ${i + batch.length} IPs so far...`);
	}

	progress.style.display = 'none';
	bar.style.display = 'none';

	console.log("Scan complete.");
}


async function discover() {
	
	pingSweep("192.168.56");
}
