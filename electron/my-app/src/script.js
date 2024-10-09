console.log("Hello World")

var { exec, spawn } = require('child_process');

function buttonAction() {
	exec('ping 8.8.8.8', function(err, stdout, stderr) {
		if(err) {
			console.error(stderr);
		} else {
			console.log(stdout);

		}		
	})
}


buttonAction()