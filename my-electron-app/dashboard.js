let myDrives = []

function findDriveNameFS(fstype){
	let x = "Unknown Drive"
	
	switch (fstype.trim()) {
		case "NTFS":
			x = "Hard Drive"
			break;
		case "FAT32":
			x = "Removable Storage"
			break;
		case "exFAT":
			x = "Flash Drive"
			break;
		case "ReFS":
			x = "Enterprise Storage"
			break;
		case "UDF":
			x = "DVD"
			break;
		case "CDFS":
			x = "CD-ROM"
			break;
		case "RAW":
			x = "Unformatted Drive"
			break;
		default:
			break;
	}
	return x;

}

function findDriveName(friendly, fstype, dvtype) {
	let x = "";

	friendly = friendly.trim();
	fstype = fstype.trim();

	if (friendly !== "") {
		x = friendly;
	}

	let switchvar = fstype;

	if(fstype == "Unknown") {switchvar = dvtype}

	// console.log(friendly, fstype, dvtype, x)
	
	if (x === "") {
		switch (switchvar) {
			case "NTFS":
				x = "Hard Drive"
				break;
			case "FAT32":
				x = "Removable Storage"
				break;
			case "exFAT":
				x = "Flash Drive"
				break;
			case "ReFS":
				x = "Enterprise Storage"
				break;
			case "UDF":
				x = "DVD"
				break;
			case "CDFS":
				x = "CD-ROM"
				break;
			case "CD-ROM":
				x = "CD Player"
				break;
			case "RAW":
				x = "Unformatted Drive"
				break;
			default:
				x = "Unknown Device"
				break;
		}
	}
	return x
}

function findDriveImg(fstype) {
	let x = "img/"
	switch (fstype) {
		case "NTFS":
			x += "drive1.png"
			break;
		case "FAT32":
			x += "sdcard.png"
			break;
		case "exFAT":
			x += "usb.png"
			break;
		case "ReFS":
			x += "drive1.png"
			break;
		case "UDF":
			x += "cdrom.png"
			break;
		case "CDFS":
			x += "cdrom.png"
			break;
		case "CD-ROM":
			x += "cdrom.png"
			break;
		case "RAW":
			x += "drive1.png"
			break;
		default:
			x += "drive1.png"
			break;
	}
	
	return x
}

function findAdapterImg(description) {
	description += ""
	let x = "img/";

	// console.log("description:", description)
	
	if(description.includes("Wi-Fi")){
		x += "wifi.png"
	} 
	else if (description.includes("vEthernet") || description.includes("Virtual")) {
		x += "vadapter.png"
	}
	else if(description.includes("Bluetooth")){
		x += "bluetooth.png"
	}
	else {
		x += "ethernet.png"
	}
	// console.log("x:", x)
	return x
}

function buildDrive(drive) {

	const parent = document.getElementById("diskContainer");

	const card = document.createElement("div");
	card.className += "card"
	
	card.innerHTML = `
		<h1>(${drive.DriveLetter[0]}:) ${drive.friendlyName}</h1>
		<div class="row-details">
			<img src="${drive.img}" class="material-symbols-rounded">
			<table>
				<tbody>
					<tr><th>Drive Type</th><td>${drive.DriveType}<br></td></tr>
					<tr><th>File System</th><td>${drive.FileSystemType}<br></td></tr>
					<tr><th>Status</th><td>${drive.HealthStatus}<br></td></tr>
					<tr><th>Operational</th><td>${drive.OperationalStatus}<br></td></tr>
				</tbody>
			</table>
		</div>`

		if(drive.percent != "N/A") {
			card.innerHTML += `
			<div class="progress-container">
				<div class="progress-bar" style="width: ${drive.percent}%">${drive.percent}%</div>
			</div>
				<p>${drive.remaining} free of ${drive.total}</p>
			</div>
			
			`
		}

	parent.appendChild(card);
}


async function getDriveInfo(){
	const rawData = await execute(
		'Get-Volume | Select-Object DriveLetter, FileSystemLabel, FileSystemType, DriveType, HealthStatus, OperationalStatus, SizeRemaining, Size | Sort-Object DriveLetter'
	);
	const results = parseGetVolumeOutput(rawData);

	myDrives = results;

	buildAllDrives()
}


function buildAllDrives(){
	for (let i = 0; i < myDrives.length; i++) {
		const drive = myDrives[i];
		
		drive.friendlyName = findDriveName(drive.FileSystemLabel, drive.FileSystemType, drive.DriveType)
		
		if(drive.Size > 0) {
			drive.percent = Math.floor(( (drive.Size - drive.SizeRemaining) / drive.Size)*100)
		} else {drive.percent = "N/A"}

		drive.remaining = formatBytes(drive.SizeRemaining)
		drive.total = formatBytes(drive.Size)

		if (drive.FileSystemType == "Unknown") {
			drive.img = findDriveImg(drive.DriveType);
		} else {
			drive.img = findDriveImg(drive.FileSystemType);
		}

		const x = drive.DriveLetter + "";


		if(x[0] != null && drive.DriveType != "N/A") {
			buildDrive(drive);
		}

	}
}


function buildNetAdapter(adapter) {
	const parent = document.getElementById("netadapterContainer");

	let card = document.createElement("div");
	card.className += "adaptercard card"

	let dotcolor = "offline"

	let status = "Disconnected";

	if (adapter.Status == "Up") {dotcolor = "online"; status = "Connected"}
	
	card.innerHTML = `
		<h1>${adapter.Name}</h1>
		<img src="${adapter.icon}" alt="">
		<p>${adapter.InterfaceDescription}</p>
		<table>
			<tbody>
				<tr>
					<td>Status:</td>
					<td>
						<span class="status-dot ${dotcolor}"></span>	
						${status}
					</td>
				</tr>
				<tr>
					<td>IP Address:</td>
					<td>${adapter.ip}</td>
				</tr>
				<tr>
					<td>LinkSpeed:</td>
					<td>${adapter.LinkSpeed}</td>
				</tr>
				<tr>
					<td>MAC:</td>
					<td>${adapter.MacAddress}</td>
				</tr>
				<tr>
					<td>Vendor:</td>
					<td>${adapter.vendor}</td>
				</tr>
			</tbody>
		</table>`

	parent.appendChild(card);
}


async function getNetAdapterInfo() {
	const psOutput = await execute('Get-NetAdapter | Select-Object Name, InterfaceDescription, ifIndex, Status, MacAddress, LinkSpeed ');

	const adapters = parseNetAdapterOutput(psOutput);

	// console.table(adapters)

	for (let i = 0; i < adapters.length; i++) {
		const x = adapters[i];

		// finish gathering info
		adapters[i].vendor = cleanVendor(x.MacAddress);

		adapters[i].icon = findAdapterImg(x.InterfaceDescription);

		// match ip address to adapters
		const storedInterface = readinterface();
		for (let o = 0; o < storedInterface.length; o++) {
			const y = storedInterface[o];

			if (x.ifIndex == y.InterfaceIndex) {
				adapters[i].ip = y.IPv4Address;
			}
			
		}
		
		buildNetAdapter(x)
	}

}


async function getUptime() {
	const psoutput = await execute(`(New-TimeSpan -Start (Get-CimInstance Win32_OperatingSystem).LastBootUpTime)`)

	let uptime = parseUptimeOutput(psoutput);

	return uptime;
}

function updateUptime(uptime, uptimedisplay) {

	// click time over
	uptime.seconds++

	if (uptime.seconds == 60) {
		uptime.seconds = 0;
		uptime.minutes++;
	}
	if (uptime.minutes == 60) {
		uptime.minutes = 0;
		uptime.hours++;
	}
	if (uptime.hours == 24) {
		uptime.hours = 0;
		uptime.days++;
	}

	uptimedisplay.innerText = formatTime([uptime.days, uptime.hours, uptime.minutes, uptime.seconds])

	return uptime
}

async function initHostInfo() {
	const hostInfo = document.getElementById("hostInfo");

	// Host name
	const hostname = await execute(`(Get-CimInstance Win32_ComputerSystem).Name`);
	hostInfo.innerHTML += `<div class="header-title">${hostname}</div>`;

	// Host OS
	const hostOS = await execute(`(Get-CimInstance Win32_OperatingSystem).Caption`);
	hostInfo.innerHTML += `<div class="header-subtext">${hostOS}</div>`;
}

const uptimedisplay = document.getElementById("uptimedisplay");

async function dashboard() {

	// if interface has not been requested, then get it + store it
	if(!readinterface()) {
		const ipconfigresults = await execute(`Get-NetIPConfiguration | Select-Object InterfaceAlias, IPv4Address,interfaceindex, InterfaceDescription | Format-List`);
		parseInterfaceOutput(ipconfigresults); // stores it also
	}

	initOui();

	// init host info
	initHostInfo()
	
	// Init drive info
	getDriveInfo();
	
	// Init net adapter info
	getNetAdapterInfo();
	
	// Initial fetch for uptime
	let uptime = await getUptime(uptimedisplay);

	// Update every second
	setInterval(() => {
		uptime = updateUptime(uptime, uptimedisplay);
	}, 1000);
	// refetch every few mins to ensure accuracy
	setInterval(async () => {
		uptime = await getUptime(uptimedisplay);
	}, 360000);
}
