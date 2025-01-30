let driveTemplate = {
	friendlyName: "",
	letter: "",
	driveType: "",
	fileSysType: "",
	health: "",
	operational: "",
	remaining: 0,
	remUnit: "",
	total: 0,
	totalUnit: "",
	percent: 0,

	icon: ""
}

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
	console.log(x)
	return x;

}

function findDriveName(friendly, label, fstype) {
	let x = "Unknown Device";

	friendly = friendly.trim();
	label = label.trim();
	fstype = fstype.trim();

	if (friendly !== "") {
		x = friendly;
	} else {
		x = label;
	}

	console.table(
		[["friendly", friendly],
		["label", label],
		["fstype", fstype],
		["x", x]]
	)
	
	if (x === "") {
		switch (fstype) {
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
				break;
		}
	}
	console.log(x)
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
		case "RAW":
			x += "drive1.png"
			break;
		default:
			x += "drive1.png"
			break;
	}
	
	return x
}

async function buildAndRetrieveDrive() {
	const parent = document.getElementById("diskContainer");

	logTime("Start")
	// Get drive count
	let driveCount = 0;
	try {
		driveCount = await execute('(Get-Volume | Sort-Object DriveLetter).Count');
	} catch (err) {
		console.error("[DRIVE COUNT]", err);
		return; // Exit early if drive count can't be retrieved
	}
	// Loop through drives
	for (let i = 0; i < driveCount; i++) {
		// Fetch all properties for the current drive in parallel
		logTime("Promise start")
		const properties = await Promise.allSettled([
			execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].DriveLetter`),
			execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].DriveType`),
			execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].FileSystemType`),
			execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].FileSystemLabel`),
			execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].FriendlyName`),
			execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].HealthStatus`),
			execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].OperationalStatus`),
			execute(`[Math]::Round((Get-Volume | Sort-Object DriveLetter)[${i}].SizeRemaining / 1GB, 2)`),
			execute(`[Math]::Round((Get-Volume | Sort-Object DriveLetter)[${i}].Size / 1GB, 2)`),
		]);
		logTime("Promise Completed")
		// Parse the results
		const [
			letter,
			driveType,
			fileSysType,
			fileSystemLabel,
			friendlyName,
			healthStatus,
			operationalStatus,
			remainingSpace,
			totalSpace,
		] = properties.map((p) => (p.status === 'fulfilled' ? p.value : null));

		if (!letter) continue; // Skip invalid drives

		// Create and append card
		const card = document.createElement("div");
		card.className = "card";
		parent.appendChild(card);

		// Initialize and populate drive object
		const drive = {
			letter,
			driveType,
			fileSysType,
			friendlyName: findDriveName(friendlyName, fileSystemLabel, fileSysType),
			health: healthStatus,
			operational: operationalStatus,
			remaining: Math.round(remainingSpace),
			total: Math.round(totalSpace),
			percent: Math.round((remainingSpace / totalSpace) * 100),
			remUnit: "GB",
			totalUnit: "GB",
			icon: findDriveImg(fileSysType)
		};

		// Populate card UI
		card.innerHTML = `
			<h1>(${drive.letter[0]}:) ${drive.friendlyName}</h1>
			<div class="row-details">
				<img src="${drive.icon}" class="material-symbols-rounded"></img>
				<table></table>
			</div>`

		if (drive.total > 0) {
			card.innerHTML += `
			<div class="progress-container">
				<div class="progress-bar" style="width: ${drive.percent}%">${drive.percent}%</div>
			</div>
			<p>${drive.remaining} ${drive.remUnit} free of ${drive.total} ${drive.totalUnit}</p>
			`
		}

		createTable(drive, card.querySelector("table"));
		myDrives.push(drive);

		logTime("Finish")
		hideLoading()
	}
}

async function buildAndRetrieveDrive3() {
	const parent = document.getElementById("diskContainer");

	logTime("Start")
	// Get drive count
	let driveCount = 0;
	try {
		driveCount = await execute('(Get-Volume | Sort-Object DriveLetter).Count');
	} catch (err) {
		console.error("[DRIVE COUNT]", err);
		return; // Exit early if drive count can't be retrieved
	}
	let props = ["letter", "type", "file sys", "label", "health", "operation", "remaining", "total"]
	// Loop through drives
	for (let i = 0; i < driveCount; i++) {
		logTime("Drive "+i)
		const letter = await execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].DriveLetter`);
		if (!letter) continue; // Skip invalid drives
		
		const drive = driveTemplate;		
		drive.letter = letter;

		// Init Card + Header
		const card = document.createElement("div");
		card.className = "card";
		parent.appendChild(card);
		
		card.innerHTML += `<h1 id="drive${i}h1">(${drive.letter[0]}:) <h1>`;

		// Init Icon based on file system type
		drive.fileSysType = await execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].FileSystemType`);
		drive.icon = findDriveImg(drive.fileSysType);
		
		// Init icon and table
		card.innerHTML += `
		<div class="row-details">
			<img src="${drive.icon}" class="material-symbols-rounded"></img>
			<table id="drive${i}table"></table>
		</div>`;
		
		// Get Table Data
		drive.driveType = await execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].DriveType`);
		drive.health = await execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].HealthStatus`);
		drive.operational = await execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].OperationalStatus`);

		// Build Table
		createTable(drive, document.getElementById("drive"+i+"table"));
		
		// Find Name
		const fileSystemLabel = await execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].FileSystemLabel`);

		const friendlyName = await execute(`(Get-Volume | Sort-Object DriveLetter)[${i}].FriendlyName`);
		drive.friendlyName = findDriveName(friendlyName, fileSystemLabel, drive.fileSysType);
		document.getElementById("drive"+i+"h1").innerHTML += `${drive.friendlyName}`;
		
		// Progress Bar
		drive.remaining = await execute(`[Math]::Round((Get-Volume | Sort-Object DriveLetter)[${i}].SizeRemaining / 1GB, 0)`);
		drive.remUnit = "GB";
				
		drive.total = await execute(`[Math]::Round((Get-Volume | Sort-Object DriveLetter)[${i}].Size / 1GB, 0)`);
		drive.totalUnit = "GB";
		drive.percent = Math.round((drive.remaining / drive.total) * 100);
			
		card.innerHTML += `
		<div class="progress-container">
			<div class="progress-bar" style="width: ${drive.percent}%">${drive.percent}%</div>
		</div>`;
		card.innerHTML += `<p>${drive.remaining} ${drive.remUnit} free of ${drive.total} ${drive.totalUnit}</p>`;
				
		myDrives.push(drive);

		logTime("Finish")
	}
}

