import p5 from 'p5/lib/p5';

import { getRandomRange } from '@/utils/random';

export default class Particle {
  constructor(x, y, mass = 1, color) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(getRandomRange(1, 2));
    this.acceleration = createVector();
    this.mass = mass;
    this.radius = 30;
    this.lifeTime = getRandomRange(20, 35);
    this.color = color;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    if (this.edgeCheck) this.checkEdges();

    this.acceleration.mult(0);
    this.lifeTime -= 1;
  }

  applyForce(force) {
    const f = p5.Vector.div(force, this.mass);

    this.acceleration.add(f);
  }

  dead() {
    return this.lifeTime <= 0;
  }

  getSize() {
    return map(this.lifeTime, 0, 35, 1, 30);
  }

  display() {
    fill(
      `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.lifeTime})`
    );
    ellipse(this.position.x, this.position.y, this.getSize());
  }
}
