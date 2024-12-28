import { getRandomRange } from "@/utils/random";
import ExplosionParticle from "@/classes/explosionParticle";

export default class Explosion {
	constructor(x, y, color) {
		this.count = getRandomRange(60, 90);
		this.lifeTime = getRandomRange(30, 45);
		this.color = color;
		this.particles = [];

		for (let i = 0; i < this.count; i++) {
			this.particles.push(new ExplosionParticle(x, y, color));
		}
	}

	dead() {
		return this.lifeTime <= 0;
	}

	update() {
		this.lifeTime--;

		for (let particle of this.particles) {
			particle.update();
		}
	}

	display() {
		push();
		const color = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
		drawingContext.shadowBlur = 25;
		drawingContext.shadowColor = color;

		for (let particle of this.particles) {
			particle.display();
		}
		pop();
	}
}
