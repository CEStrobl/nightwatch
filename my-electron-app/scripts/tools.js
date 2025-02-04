const logTime = (() => {
    let startTime = null; // Tracks the start time
    let lastTime = null;  // Tracks the last log time

    return (label) => {
        const now = performance.now();

        // Initialize the timer on "Start"
        if (label === "Start") {
            startTime = now;
            lastTime = now;
            console.log(`[00:00] ${label}`);
            return;
        }

        // Calculate elapsed time since the last log and the total runtime
        const elapsed = Math.round((now - lastTime) / 1000); // Elapsed seconds
        const totalElapsed = Math.round((now - startTime) / 1000); // Total runtime seconds

        // Format elapsed time for logging
        const minutes = String(Math.floor(totalElapsed / 60)).padStart(2, "0");
        const seconds = String(totalElapsed % 60).padStart(2, "0");
        const timeFormatted = `[${minutes}:${seconds}]`;

        // Log "Finish" with total runtime
        if (label === "Finish") {
            console.log(`${timeFormatted} ${label} - Total runtime: ${totalElapsed} seconds`);
            return;
        }

        // Log other steps
        console.log(`${timeFormatted} ${label}`);
        lastTime = now; // Update the last log time
    };
})();




function parsePowerShellTable(input) {
    input
        .trim()
        .split("\n")
        .map(line => {
            const [DriveLetter, FriendlyName, FileSystemType, DriveType, HealthStatus, OperationalStatus] = line.split("|");
            return { DriveLetter, FriendlyName, FileSystemType, DriveType, HealthStatus, OperationalStatus };
        });
}

function parseArpTable(input) {
    const lines = input.trim().split("\n").map(line => line.trim());
    const result = [];
    let currentInterface = null;

    for (let line of lines) {
        // Match interface lines like: "Interface: 192.168.19.114 --- 0x16"
        let interfaceMatch = line.match(/^Interface:\s+([\d\.]+)\s+---\s+(\S+)/);
        if (interfaceMatch) {
            currentInterface = {
                InterfaceIP: interfaceMatch[1],
                InterfaceID: interfaceMatch[2],
                Entries: [],
            };
            result.push(currentInterface);
            continue;
        }

        // Match ARP entries like: "10.128.128.128  98-18-88-c1-19-21  dynamic"
        let arpMatch = line.match(/^([\d\.]+)\s+([\w-]+)\s+(\w+)$/);
        if (arpMatch && currentInterface) {
            currentInterface.Entries.push({
                IPAddress: arpMatch[1],
                MACAddress: arpMatch[2],
                Type: arpMatch[3],
            });
        }
    }

    return result;
}
