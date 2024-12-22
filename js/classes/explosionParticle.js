import p5 from "p5/lib/p5";

import { getRandomRange } from "@/utils/random";

export default class ExplosionParticle {
	constructor(x, y, color) {
		this.position = createVector(x, y);
		this.velocity = p5.Vector.random2D();
		this.velocity.mult(getRandomRange(3, 9));
		this.color = color;
		this.dampening = 0.99;
		this.size = getRandomRange(12, 20);
		this.particleType = Math.round(getRandomRange(1, 3));
	}

	update() {
		this.position.add(this.velocity);

		this.velocity.mult(this.dampening);
		this.size -= 0.5;
	}

	display() {
		const size = Math.round(this.size);

		if (size >= 1) {
			fill(`rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`);
			noStroke();
			if (this.particleType == 1) {
				rect(this.position.x, this.position.y, Math.round(this.size));
			} else if (this.particleType == 2) {
				ellipse(this.position.x, this.position.y, Math.round(this.size));
			} else {
				stroke(`rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`);
				noFill();
				line(
					this.position.x,
					this.position.y,
					this.position.x + getRandomRange(-this.size, this.size),
					this.position.y + getRandomRange(-this.size, this.size)
				);
			}
		}
	}
}
