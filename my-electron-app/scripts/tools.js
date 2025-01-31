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

