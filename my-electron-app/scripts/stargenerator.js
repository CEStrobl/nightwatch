function printStars(maxStars, maxWidth, maxHeight) {
	for (let i = 0; i < maxStars; i++) {
		let x = Math.floor(Math.random() * maxWidth);
		let y = Math.floor(Math.random() * maxHeight);
		console.log(`${x}px ${y}px white,`);
	}
}

printStars(100, 1920, 1080);
