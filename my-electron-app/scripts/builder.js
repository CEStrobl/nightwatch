function createDiskCard(x) {

	const parent = document.getElementById("diskContainer")
	const tempid = "drive1"

	// Card
	let card = document.createElement("div")
	card.id = tempid
	card.className = "card"
	parent.appendChild(card)

	// Title
	let h1 = document.createElement("h1")
	h1.innerText = "("+x.letter+":) " + x.friendlyName
	card.appendChild(h1)

	// Row
	let row = document.createElement("div")
	row.className = "row-details"
	card.appendChild(row)

	// Icon
	let icon = document.createElement("span")
	icon.className = "material-symbols-outlined"
	icon.innerText = "hard_drive"
	row.appendChild(icon)

	// Table
	let table = document.createElement("table")
	row.appendChild(table)

	createTable(x, table)

	// progress bar
	let container = document.createElement("div")
	container.className="progress-container"
	card.appendChild(container)

	let bar = document.createElement("div")
	bar.className = "progress-bar"
	bar.innerText =  x.percent + "%"
	bar.style.width = bar.innerText
	container.appendChild(bar)

	let p = document.createElement("p")
	p.innerText = x.remaining + " " + x.remUnit + " free of " + x.total + " " + x.totalUnit
	card.appendChild(p)
}

function createTable(x, table){

	let tableDetails = ["Drive Type", "File System", "Status", "Operational"]
	let property = [x.driveType, x.fileSysType, x.health, x.operational]

	for (let i = 0; i < tableDetails.length; i++) {
		const e = tableDetails[i];
		const f = property[i];
		
		let tr = document.createElement("tr")
		table.appendChild(tr)
		
		let th = document.createElement("th")
		th.innerText = e
		tr.appendChild(th)
		
		let td = document.createElement("td")
		td.innerText = f
		tr.appendChild(td)
	}
}

createDiskCard(localdisk)