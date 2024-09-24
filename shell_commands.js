var { exec, spawn } = require('child_process');

function buttonAction() {
	exec('ping my.dartpoints.com', function(err, stdout, stderr) {
		if(err) {
			console.error(stderr);
		} else {
			console.log(stdout);

		}
			
	})

}


buttonAction()