async function ping() {
	try {
		const result = await window.electronAPI.pingCommand();
		return result;
	} catch (err) {
		return  'Error: ' + err;
	}
}

async function runcom(command) {
	try {
		const result = await window.electronAPI.runCommand(command);
		return result;
	} catch (err) {
		throw err;
	}
}

let execute = window.electronAPI.runCommand;

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

async function populateDriveInfo() {

	// Get drive count
	let driveCount = 0;

	try {
		driveCount = await execute('(Get-Volume).Count');
	} catch (err) {console.error("[DRIVE COUNT]", err);}

	// Loop thru drives based on count
	for (let i = 0; i < driveCount - 1; i++) {

		// Init object
		let drive = driveTemplate;
		
		// Letter
		try {
			drive.letter = await execute('(Get-Volume)['+i+'].DriveLetter');
		} catch (err) {console.error("[DRIVE"+i+" LETTER]", err);}
	
		// Name
		try {
			drive.friendlyName = await execute('(Get-Volume)['+i+'].FileSystemLabel');
		} catch (err) {console.error("[DRIVE"+i+" NAME]", err);}
	
		// Drive Type
		try {
			drive.driveType = await execute('(Get-Volume)['+i+'].DriveType');
		} catch (err) {console.error("[DRIVE"+i+" TYPE]", err);}
	
		// File System Type
		try {
			drive.fileSysType = await execute('(Get-Volume)['+i+'].FileSystemType');
		} catch (err) {console.error("[DRIVE"+i+" FST]", err);}
	
		// Health Status
		try {
			drive.health = await execute('(Get-Volume)['+i+'].HealthStatus');
		} catch (err) {console.error("[DRIVE"+i+" HEALTH]", err);}

		// Operational Status
		try {
			drive.operational = await execute('(Get-Volume)['+i+'].OperationalStatus');
		} catch (err) {console.error("[DRIVE"+i+" OPERATIONAL]", err);}

		// Remaining space
		try {
			drive.remaining = await execute('[Math]::Round((Get-Volume)['+i+'].SizeRemaining / 1GB, 2)');
			drive.remUnit = "GB"
		} catch (err) {console.error("[DRIVE"+i+" REMAINING]", err);}

		// Total Space
		try {
			drive.total = await execute('[Math]::Round((Get-Volume)['+i+'].Size / 1GB, 2)');
			drive.totalUnit = "GB"
		} catch (err) {console.error("[DRIVE"+i+" TOTAL]", err);}

		myDrives.push(drive)
	}

	console.table(myDrives[0])

	createDiskCard(myDrives[0])

}
// populateDriveInfo()

async function buildAndRetrieveDrive() {
	
	const parent = document.getElementById("diskContainer")

	// Get drive count
	let driveCount = 0;

	try {
		driveCount = await execute('(Get-Volume).Count');
	} catch (err) {console.error("[DRIVE COUNT]", err);}



	// Loop thru drives based on count
	for (let i = 0; i < driveCount - 1; i++) {

		const tempid = "drive"+i

		// Card
		let card = document.createElement("div")
		card.id = tempid
		card.className = "card"
		parent.appendChild(card)

		// Init object
		let drive = driveTemplate;
		
		// Letter
		try {
			drive.letter = await execute('(Get-Volume)['+i+'].DriveLetter');
		} catch (err) {console.error("[DRIVE"+i+" LETTER]", err);}
	
		// Name
		try {
			drive.friendlyName = await execute('(Get-Volume)['+i+'].FileSystemLabel');
		} catch (err) {console.error("[DRIVE"+i+" NAME]", err);}
		
		// Title
		let h1 = document.createElement("h1")
		h1.innerText = "("+drive.letter[0]+":) " + drive.friendlyName
		card.appendChild(h1)

		// Row
		let row = document.createElement("div")
		row.className = "row-details"
		card.appendChild(row)

		// Drive Type
		try {
			drive.driveType = await execute('(Get-Volume)['+i+'].DriveType');
		} catch (err) {console.error("[DRIVE"+i+" TYPE]", err);}
	
		// File System Type
		try {
			drive.fileSysType = await execute('(Get-Volume)['+i+'].FileSystemType');
		} catch (err) {console.error("[DRIVE"+i+" FST]", err);}
	
		// Health Status
		try {
			drive.health = await execute('(Get-Volume)['+i+'].HealthStatus');
		} catch (err) {console.error("[DRIVE"+i+" HEALTH]", err);}

		// Operational Status
		try {
			drive.operational = await execute('(Get-Volume)['+i+'].OperationalStatus');
		} catch (err) {console.error("[DRIVE"+i+" OPERATIONAL]", err);}

		// Icon
		let icon = document.createElement("span")
		icon.className = "material-symbols-rounded"
		icon.innerText = "hard_drive"
		row.appendChild(icon)

		// Table
		let table = document.createElement("table")
		row.appendChild(table)

		createTable(drive, table)

		// Remaining space
		try {
			drive.remaining = await execute('[Math]::Round((Get-Volume)['+i+'].SizeRemaining / 1GB, 2)');
			drive.remaining = Math.round(drive.remaining)
			drive.remUnit = "GB"
		} catch (err) {console.error("[DRIVE"+i+" REMAINING]", err);}

		// Total Space
		try {
			drive.total = await execute('[Math]::Round((Get-Volume)['+i+'].Size / 1GB, 2)');
			drive.total = Math.round(drive.total)
			drive.totalUnit = "GB"
		} catch (err) {console.error("[DRIVE"+i+" TOTAL]", err);}

		drive.percent = Math.round((drive.remaining / drive.total)*100)

		// progress bar
		let container = document.createElement("div")
		container.className="progress-container"
		card.appendChild(container)

		let bar = document.createElement("div")
		bar.className = "progress-bar"
		bar.innerText =  drive.percent + "%"
		bar.style.width = bar.innerText
		container.appendChild(bar)

		let p = document.createElement("p")
		p.innerText = drive.remaining + " " + drive.remUnit + " free of " + drive.total + " " + drive.totalUnit
		card.appendChild(p)


		myDrives.push(drive)
	}

	console.table(myDrives[0])

}

buildAndRetrieveDrive()