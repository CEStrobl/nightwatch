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

function findDriveName(friendly, fstype) {
	let x = "Unknown Device";

	friendly = friendly.trim();
	fstype = fstype.trim();

	if (friendly !== "") {
		x = friendly;
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

function buildDrive(drive) {

	const parent = document.getElementById("diskContainer");

	const card = document.createElement("div");
	
	card.innerHTML = `
		<h1>(${drive.letter[0]}:) ${drive.friendlyName}</h1>
		<div class="row-details">
			<img src="${drive.letter}" class="material-symbols-rounded">
			<table>
				<tbody>
					<tr><th>Drive Type</th><td>${drive.driveType}<br></td></tr>
					<tr><th>File System</th><td>${drive.fileSysType}<br></td></tr>
					<tr><th>Status</th><td>${drive.health}<br></td></tr>
					<tr><th>Operational</th><td>${drive.operational}<br></td></tr>
				</tbody>
			</table>
		</div>
		<div class="progress-container">
			<div class="progress-bar" style="width: ${drive.percent}%">${drive.percent}%</div>
		</div>
			<p>${drive.remaining} GB free of ${drive.total} GB</p>
		</div>
	`

	parent.appendChild(card);
}


async function getDriveInfo(){
	const rawData = await execute(
		'Get-Volume | Select-Object DriveLetter, FileSystemLabel, FileSystemType, DriveType, HealthStatus, OperationalStatus, SizeRemaining, Size | Sort-Object DriveLetter'
	);

	console.log("raw data: ",rawData);
	const results = parseGetVolumeOutput(rawData);

	console.table("results: ", results);

}


