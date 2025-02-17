let myIps = []

let myNetwork = []

initOui()

async function discover() {

	// send PS arp -a
	const arpTable = await execute("arp -a");

	// parse it to an array of network objects
	const arpData = parseArpTable(arpTable).flatMap(iface => iface.Entries);
	
	// define parent div container
	let parent = document.getElementById("netcontainer");

	for (let i = 0; i < arpData.length; i++) {
		const node = arpData[i];

		let device = {
			name: "-",
			mac: "-",
			ip: "-",
			vendor: "-",
			ping: "-",
			status: "-",
		};
		
		device.mac = node.MACAddress.substring(0,8).toUpperCase();
				
		if(!isOddMAC(device.mac)){
			
			// init net card
			const card = document.createElement("div");
			card.className = "netcard card";
			card.id = "netdevice.ice"+i;
			parent.appendChild(card);
			
			device.name = "-";
			device.ip = node.IPAddress;
			device.vendor = lookupOUI(device.mac);

			const x = await execute(
				`$hostname=''; 
				try { $temp=(Resolve-DnsName '${device.ip}' -ErrorAction SilentlyContinue | Select-Object -ExpandProperty NameHost); if ($temp) { $hostname=$temp } } catch {}; 
				try { if (-not $hostname) { $temp=([System.Net.Dns]::GetHostEntry('${device.ip}').HostName); if ($temp) { $hostname=$temp } } } catch {}; 
				[Console]::WriteLine($hostname)`
			);
			
			const hostname = x.trim() || "Unnamed Device";

			device.name = hostname.replace("Unnamed", device.vendor.split(" ")[0])
			
			device.ping = "Located";
	
			card.innerHTML =
			`
				<div class="net-header" id="${"device"+i}">
					<h1>${device.name}</h1>
					<h3>${device.ip}</h3>
				</div>
				<div class="divline"></div>
				<div class="row-details">
					<div class="block" id="${"device"+i+"ping"}">
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

			myNetwork.push(device)
		}
		

	}
	
}

async function pingDevice(ip) {
	let pingOutput = await execute(`ping ${ip}`);

    if (typeof pingOutput !== "string") {
        return "Offline";
    }

	const match = pingOutput.match(/time[=<]([\d]+)ms/i);

	return match ? `${match[1]} ms` : "Offline";
}
