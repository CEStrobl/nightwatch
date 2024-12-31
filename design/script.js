let refreshInterval = null;

function refresh(toggle) {
    if (toggle === 'start') {
        if (!localStorage.getItem('refreshLoop')) {
            console.log("Starting refresh loop...");
            localStorage.setItem('refreshLoop', 'true');
            startRefreshing();
        }
    } else if (toggle === 'stop') {
        console.log("Stopping refresh loop...");
        localStorage.removeItem('refreshLoop');
        clearInterval(refreshInterval);
    } else {
        console.log("Invalid toggle value. Use 'start' or 'stop'.");
    }
}

function startRefreshing() {
    refreshInterval = setInterval(() => {
        console.log("Refreshing page...");
        window.location.reload();
    }, 1000);
}

// Automatically resume refresh loop if it was active
if (localStorage.getItem('refreshLoop')) {
    startRefreshing();
}
