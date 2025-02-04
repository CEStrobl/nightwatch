let myIps = []


async function discover() {
	let result = await execute("arp -a");

	console.log(result)
	
}