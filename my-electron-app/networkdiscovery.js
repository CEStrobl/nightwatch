let myIps = []


async function discover() {

	// send PS arp -a
	const arpTable = await execute("arp -a");

	// parse it to an array of network objects
	const arpData = parseArpTable(arpTable).flatMap(iface => iface.Entries);
	
	// define parent div container
	let parent = document.getElementById("netcontainer");

	for (let i = 0; i < arpData.length; i++) {
		const node = arpData[i];
		
		// init net card
		const card = document.createElement("div");
		card.className = "netcard card";
		card.id = "netdevice"+i;
		parent.appendChild(card);

		const devname = "-"
		const devip = node.IPAddress;
		const devmac = node.MACAddress.substring(0,8);
		const devvend = "-"
		const ping = "-"

		card.innerHTML =
		`
			<div class="net-header">
				<h1>${devname}</h1>
				<h3>${devip}</h3>
			</div>
			<div class="divline"></div>
			<div class="row-details">
				<div class="block">
					${ping}
				</div>
				<div class="block">
					${devmac}
				</div>
				<div class="block">
					${devvend}
				</div>
				
			</div>
		`

	}
	
}