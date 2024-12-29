import { sketch } from "@/utils/p5-wrapper";
import config from "@/utils/config";
import { getRandomNumber } from "@/utils/random";
import explosionManager from "@/utils/explosions";
import Emitter from "@/classes/emitter";

sketch.setup = setup;
sketch.draw = draw;
sketch.keyPressed = keyPressed;

const EMITTER_COUNT = config.isMobile ? 10 : 30;
let emitters = [];

function setup() {
	if (!config.clearScreen) background(0);
	frameRate(config.frameRate);
	pixelDensity(config.pixelDensity);
	if (config.isMobile) {
		const canvasSize = window.innerWidth - 50;
		createCanvas(canvasSize, canvasSize);
	} else {
		createCanvas(config.width, config.height);
	}

	noStroke();

	for (let i = 0; i < EMITTER_COUNT; i++) {
		emitters.push(new Emitter(getRandomNumber(width), getRandomNumber(height)));
	}
}

function draw() {
	if (config.clearScreen) background(30);

	for (let i = 0; i < emitters.length; i++) {
		const currentEmiter = emitters[i];
		for (let j = i + 1; j < emitters.length; j++) {
			const nextEmitter = emitters[j];

			if (currentEmiter.exploded || nextEmitter.exploded) continue;

			if (currentEmiter.collides(nextEmitter)) {
				currentEmiter.explode();
				nextEmitter.explode();
			}
		}

		if (!currentEmiter.exploded) {
			currentEmiter.emit(1);
			currentEmiter.wrapEdges();
		}

		currentEmiter.update();
		currentEmiter.display();
	}

	for (let explosion of explosionManager.explosions) {
		explosion.update();
		explosion.display();
	}

	if (emitters.length < EMITTER_COUNT) {
		emitters.push(new Emitter(getRandomNumber(width), getRandomNumber(height)));
	}

	emitters = emitters.filter((emitter) => !emitter.dead());
	explosionManager.explosions = explosionManager.explosions.filter((explosion) => !explosion.dead());

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
