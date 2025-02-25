const progress = document.getElementById("progressStatus")
const bar = document.getElementById("progressStatusBar")

async function pingHost(ip) {
    const result = await execute(`ping -n 1 -w 500 ${ip}`);

    if (!result) { // If execute() returns undefined or null, assume offline
        return { ip, status: "Offline", time: "0ms" };
    }

    // Extract response time (matches "time=3ms" or "time<1ms")
    const match = result.match(/time[=<](\d+)ms/);
    const time = match ? `${match[1]}ms` : "N/A";

    return { ip, status: result.includes("Reply from") ? "Online" : "Offline", time };
}

async function printOnlineDevices(devices) {
    console.log("Live Online Devices:");
    console.table(devices);
}

async function pingSweep(network) {
    let onlineDevices = [];
    const ips = Array.from({ length: 254 }, (_, i) => `${network}.${i + 1}`);
    const batchSize = 15;

    progress.className += " loading"

    for (let i = 0; i < ips.length; i += batchSize) {
        progress.innerText = `Scanning network ${network}.x ...`;
        bar.style.width =`${Math.round((i / ips.length) * 100)}%`;

        if(i>0){bar.innerText = i;}
        
        // Get the next batch of 15 + Run them in parallel
        const batch = ips.slice(i, i + batchSize); 
        const results = await Promise.all(batch.map(ip => pingHost(ip))); 

        results.forEach(({ ip, status, time }) => {
            if (status === "Online") {
                onlineDevices.push({ ip, status, ms: time });
            }
        });

        console.log(`Scanned ${i + batch.length} IPs so far...`);
        await printOnlineDevices(onlineDevices);
    }

    progress.style.display = 'none';
    bar.style.display = 'none';

    console.log("Scan complete.");
}


async function discover() {
	
	pingSweep("192.168.19");
}
