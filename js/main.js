import { sketch } from "@/utils/p5-wrapper";
import config from "@/utils/config";
import Test from "@/classes/test";

sketch.setup = setup;
sketch.draw = draw;
sketch.keyPressed = keyPressed;

let test;

function setup() {
	if (!config.clearScreen) background(0);
	frameRate(config.frameRate);
	pixelDensity(config.pixelDensity);
	createCanvas(config.width, config.height);

	test = new Test();
}

function draw() {
	if (config.clearScreen) background(0);

	ellipse(100, 100, 20);
	test.display();

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
