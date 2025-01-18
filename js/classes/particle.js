import p5 from 'p5/lib/p5';

import config from '@/utils/config';
import { getRandomRange } from '@/utils/random';

const PARTICLE_SIZE = config.isMobile ? 5 : 8;
export default class Particle {
  constructor(x, y, mass = 1, color) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(getRandomRange(1, 2));
    this.acceleration = createVector();
    this.mass = mass;
    this.radius = PARTICLE_SIZE;
    this.lifeTime = getRandomRange(20, 35);
    this.color = color;
  }

  reset(x, y, color) {
    this.position.x = x;
    this.position.y = y;
    this.acceleration.x = 0;
    this.acceleration.y = 0;
    this.color = color;
    this.lifeTime = getRandomRange(20, 35);
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
    return map(this.lifeTime, 0, 35, 1, PARTICLE_SIZE);
  }

  display() {
    fill(
      `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.lifeTime})`
    );
    ellipse(this.position.x, this.position.y, this.getSize());
  }
}
