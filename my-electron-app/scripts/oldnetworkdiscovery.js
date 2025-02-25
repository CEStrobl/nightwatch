let myIps = []

let myNetwork = []

initOui()

async function arpdiscover() {

	// send PS arp -a
	const arpTable = await execute("arp -a");

	// parse it to an array of network objects
	const arpData = parseArpTable(arpTable).flatMap(iface => iface.Entries);
	
	// define parent div container
	let parent = document.getElementById("netcontainer");

	let index = 0;

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
			card.id = "netdevice"+index;
			parent.appendChild(card);
			
			device.name = "-";
			device.ip = node.IPAddress;
			device.vendor = lookupOUI(device.mac);

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

			device.name = hostname.replace("Unnamed", device.vendor.split(" ")[0])
			
			device.ping = "Located";
	
			card.innerHTML =
			`
				<div class="net-header" id="${"device"+index}">
					<h1>${device.name}</h1>
					<h3>${device.ip}</h3>
				</div>
				<div class="divline"></div>
				<div class="row-details">
					<div class="block" id="${"device"+index+"ping"}">
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
			index++
		}
		

	}

	allPingTimes()
	
}

async function pingDevice(ip) {
	let pingOutput = await execute(`ping ${ip}`);

    if (typeof pingOutput !== "string") {
        return "Offline";
    }

	const match = pingOutput.match(/time[=<]([\d]+)ms/i);

	return match ? `${match[1]} ms` : "Offline";
}

async function allPingTimes() {
	// loop thru myNetwork

	for (let i = 0; i < myNetwork.length; i++) {
		const device = myNetwork[i];
		
		// go to id deviceiping
		const pingdiv = document.getElementById("device"+i+"ping");
	
		// change to Pinging...
		pingdiv.innerText = "Pinging...";
		pingdiv.className += " loading";
	
		// actually ping it
		let result = await pingDevice(device.ip);
		pingdiv.className = "block"
		
		// change status
		if(result == "Offline") {
			device.status = "Offline";
			pingdiv.innerHTML = `<span class="status-dot offline"></span>`+result;
		} else if (result.includes("ms")){
			pingdiv.innerHTML = `<span class="status-dot online"></span>`+result;
			device.status = "Online";
			device.ping = result;
		} else {
			pingdiv.innerHTML = "Error"
			console.log("error: something went wrong with pinging", device.ip)
			console.log("results: ", results)
		}
	}

}
