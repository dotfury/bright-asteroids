import { getRandomRange } from '@/utils/random';
import explosionManager from '@/utils/explosions';
import Particle from '@/classes/particle';
import Explosion from '@/classes/explosion';

const COLORS = [
  { r: 57, g: 212, b: 203 },
  { r: 57, g: 135, b: 203 },
  { r: 57, g: 212, b: 121 },
  { r: 178, g: 117, b: 203 },
];

export default class Emitter {
  constructor(x, y) {
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(getRandomRange(5, 7));
    this.acceleration = createVector(0, 0);
    this.position = createVector(x, y);
    this.particles = [];
    this.force = createVector(0, 0);
    this.color = random(COLORS);
    this.exploded = false;
    this.radius = getRandomRange(10, 25);
  }

  emit(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push(
        new Particle(this.position.x, this.position.y, 1, this.color)
      );
    }
    this.emitted = true;
  }

  applyForce(force) {
    if (!this.exploded) {
      this.acceleration.add(force);

      const particleForce = force.copy().mult(-1);
      for (let particle of this.particles) {
        particle.applyForce(particleForce);
      }
    }
  }

  wrapEdges() {
    if (this.position.x > width) {
      this.position = createVector(0, this.position.y);
    }
    if (this.position.x < 0) {
      this.position = createVector(width, this.position.y);
    }
    if (this.position.y > height) {
      this.position = createVector(this.position.x, 0);
    }
    if (this.position.y < 0) {
      this.position = createVector(this.position.x, height);
    }
  }

  collides(mover) {
    let dx = mover.position.x - this.position.x;
    let dy = mover.position.y - this.position.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= this.radius;
  }

  explode() {
    this.exploded = true;
    explosionManager.explosions.push(
      new Explosion(this.position.x, this.position.y, this.color)
    );
  }

  dead() {
    return this.particles.length <= 0 && this.exploded;
  }

  update() {
    if (!this.exploded) {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
    }

    for (let particle of this.particles) {
      particle.update();
    }

    this.particles = this.particles.filter((p) => !p.dead());
  }

  display() {
    if (!this.exploded) {
      fill(`rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`);
      circle(this.position.x, this.position.y, this.radius);
    }

    for (let particle of this.particles) {
      particle.display();
    }
  }
}
