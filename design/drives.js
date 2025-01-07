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

let localdisk = driveTemplate

localdisk.friendlyName = "Local Disk"
localdisk.letter = "C"
localdisk.driveType = "Fixed"
localdisk.fileSysType = "FTPS"
localdisk.health = "Healthy"
localdisk.operational = "OK"
localdisk.percent = 48
localdisk.remaining = 123
localdisk.remUnit = "GB"
localdisk.total = 475
localdisk.totalUnit = "GB"