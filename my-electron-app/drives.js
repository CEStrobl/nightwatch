let myDrives = []

function findDriveNameFS(fstype){
	let x = "Unknown Drive"

	console.log(fstype)
	
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

	console.log(friendly, fstype, dvtype, x)
	
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

getDriveInfo()


function buildAllDrives(){
	for (let i = 0; i < myDrives.length; i++) {
		const drive = myDrives[i];
		
		drive.friendlyName = findDriveName(drive.FileSystemLabel, drive.FileSystemType, drive.DriveType)
		
		if(drive.Size > 0) {
			drive.percent = Math.floor(( (drive.Size - drive.SizeRemaining) / drive.Size)*100)
		} else {drive.percent = "N/A"}

		drive.remaining = formatBytes(drive.SizeRemaining)
		drive.total = formatBytes(drive.Size)

		drive.img = findDriveImg(drive.FileSystemType);

		const x = drive.DriveLetter + "";


		if(x[0] != null && drive.DriveType != "N/A") {
			buildDrive(drive);
		}

	}
}