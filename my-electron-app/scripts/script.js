/**
 * Welcome to script.js
 * 
 * this is used for DOM elements that perform an action.
 * it has nothing to do with the main features of the 
 * program. it is mainly used for activating some
 * visual effect.
 * 
*/

const logcontainer = document.getElementById("commandhistory")

function showcommandhistory() {
	logcontainer.style.display = "flex";
}

function hidecommandhistory() {
	logcontainer.style.display = "none";
}


// refresh is a debugging tool
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


function hideLoading(){
	let loading = document.getElementById("loadingScreen")

	loading.style.opacity = 0;

	setInterval(() =>{
		loading.style.display = "none";
	}, 1000)
}
