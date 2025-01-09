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
		driveCount = await execute('(Get-Volume | Sort-Object DriveLetter).Count');
	} catch (err) {console.error("[DRIVE COUNT]", err);}

	// Loop thru drives based on count
	for (let i = 0; i < driveCount - 1; i++) {

		// Init object
		let drive = driveTemplate;
		
		// Letter
		try {
			drive.letter = await execute('(Get-Volume | Sort-Object DriveLetter)['+i+'].DriveLetter');
		} catch (err) {console.error("[DRIVE"+i+" LETTER]", err);}
	
		// Name
		try {
			drive.friendlyName = await execute('(Get-Volume | Sort-Object DriveLetter)['+i+'].FileSystemLabel');
		} catch (err) {console.error("[DRIVE"+i+" NAME]", err);}
	
		// Drive Type
		try {
			drive.driveType = await execute('(Get-Volume | Sort-Object DriveLetter)['+i+'].DriveType');
		} catch (err) {console.error("[DRIVE"+i+" TYPE]", err);}
	
		// File System Type
		try {
			drive.fileSysType = await execute('(Get-Volume | Sort-Object DriveLetter)['+i+'].FileSystemType');
		} catch (err) {console.error("[DRIVE"+i+" FST]", err);}
	
		// Health Status
		try {
			drive.health = await execute('(Get-Volume | Sort-Object DriveLetter)['+i+'].HealthStatus');
		} catch (err) {console.error("[DRIVE"+i+" HEALTH]", err);}

		// Operational Status
		try {
			drive.operational = await execute('(Get-Volume | Sort-Object DriveLetter)['+i+'].OperationalStatus');
		} catch (err) {console.error("[DRIVE"+i+" OPERATIONAL]", err);}

		// Remaining space
		try {
			drive.remaining = await execute('[Math]::Round((Get-Volume | Sort-Object DriveLetter)['+i+'].SizeRemaining / 1GB, 2)');
			drive.remUnit = "GB"
		} catch (err) {console.error("[DRIVE"+i+" REMAINING]", err);}

		// Total Space
		try {
			drive.total = await execute('[Math]::Round((Get-Volume | Sort-Object DriveLetter)['+i+'].Size / 1GB, 2)');
			drive.totalUnit = "GB"
		} catch (err) {console.error("[DRIVE"+i+" TOTAL]", err);}

		myDrives.push(drive)
	}

	console.table(myDrives[0])

	createDiskCard(myDrives[0])

}
// populateDriveInfo()

function findDriveName(friendly, label, fstype) {
	let x = "Unknown Device";
	if (friendly !== "") {
		x = friendly;
	} else {
		x = label;
	}
	
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
			case "RAW":
				x = "Unformatted Drive"
				break;
			default:
				break;
		}
	}
	
	return x
}

async function buildAndRetrieveDrive() {
	
	const parent = document.getElementById("diskContainer")

	// Get drive count
	let driveCount = 0;

	try {
		driveCount = await execute('(Get-Volume | Sort-Object DriveLetter).Count');
	} catch (err) {console.error("[DRIVE COUNT]", err);}



	// Loop thru drives based on count
	for (let i = 0; i < driveCount; i++) {

		// Validate Drive
		const letter = await execute('(Get-Volume | Sort-Object DriveLetter)['+i+'].DriveLetter');
		if(letter) {
			
			const tempid = "drive"+i
	
			// Card
			let card = document.createElement("div")
			card.id = tempid
			card.className = "card"
			parent.appendChild(card)
	
			// Init object
			let drive = driveTemplate;
			
			// Letter
			drive.letter = letter

			// Drive Type
			try {
				drive.driveType = await execute('(Get-Volume | Sort-Object DriveLetter)['+i+'].DriveType');
			} catch (err) {console.error("[DRIVE"+i+" TYPE]", err);}
		
			// File System Type
			try {
				drive.fileSysType = await execute('(Get-Volume | Sort-Object DriveLetter)['+i+'].FileSystemType');
			} catch (err) {console.error("[DRIVE"+i+" FST]", err);}
			
			// Name
			let FSLabel, friendlyName;
			try {
				FSLabel = await execute('(Get-Volume | Sort-Object DriveLetter)['+i+'].FileSystemLabel');
				friendlyName = await execute('(Get-Volume | Sort-Object DriveLetter)['+i+'].FriendlyName');
				
			} catch (err) {console.error("[DRIVE"+i+" NAME]", err);}
			
			drive.friendlyName = findDriveName(friendlyName, FSLabel, drive.fileSysType)
		
			// Title
			let h1 = document.createElement("h1")
			h1.innerText = "("+drive.letter[0]+":) " + drive.friendlyName
			card.appendChild(h1)
	
			// Row
			let row = document.createElement("div")
			row.className = "row-details"
			card.appendChild(row)
	
			// Health Status
			try {
				drive.health = await execute('(Get-Volume | Sort-Object DriveLetter)['+i+'].HealthStatus');
			} catch (err) {console.error("[DRIVE"+i+" HEALTH]", err);}
	
			// Operational Status
			try {
				drive.operational = await execute('(Get-Volume | Sort-Object DriveLetter)['+i+'].OperationalStatus');
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
				drive.remaining = await execute('[Math]::Round((Get-Volume | Sort-Object DriveLetter)['+i+'].SizeRemaining / 1GB, 2)');
				drive.remaining = Math.round(drive.remaining)
				drive.remUnit = "GB"
			} catch (err) {console.error("[DRIVE"+i+" REMAINING]", err);}
	
			// Total Space
			try {
				drive.total = await execute('[Math]::Round((Get-Volume | Sort-Object DriveLetter)['+i+'].Size / 1GB, 2)');
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

	}
}

// buildAndRetrieveDrive()

async function buildAndRetrieveDrive2() {
    const parent = document.getElementById("diskContainer");

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
        };

        // Populate card UI
        card.innerHTML = `
            <h1>(${drive.letter[0]}:) ${drive.friendlyName}</h1>
            <div class="row-details">
                <span class="material-symbols-rounded">hard_drive</span>
                <table></table>
            </div>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${drive.percent}%">${drive.percent}%</div>
            </div>
            <p>${drive.remaining} ${drive.remUnit} free of ${drive.total} ${drive.totalUnit}</p>
        `;

        createTable(drive, card.querySelector("table"));
        myDrives.push(drive);
    }
}

buildAndRetrieveDrive2()


