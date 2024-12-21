import { sketch } from "./p5-wrapper";
import config from "./config";
import Test from "./test";

new Test();

sketch.setup = setup;
sketch.draw = draw;
sketch.keyPressed = keyPressed;

function setup() {
	if (!config.clearScreen) background(0);
	frameRate(config.frameRate);
	pixelDensity(config.pixelDensity);
	createCanvas(config.width, config.height);
}

function draw() {
	if (config.clearScreen) background(0);

	ellipse(100, 100, 20);

	if (!config.animate) createStill();
}

// Still image
function createStill() {
	noLoop();
	for (let i = 0; i < config.interations; i++) {}
}

function keyPressed() {
	if (key === "s") {
		saveGif("output", config.duration);
	}
}
