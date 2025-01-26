import config from '@/utils/config';
import { getRandomRange } from '@/utils/random';
import { explosionBuffer, particleBuffer } from '@/utils/buffers';
import explosionManager from '@/utils/explosions';
import Particle from '@/classes/particle';
import Explosion from '@/classes/explosion';

const COLORS = [
  { r: 57, g: 212, b: 203 },
  { r: 57, g: 135, b: 203 },
  { r: 57, g: 212, b: 121 },
  { r: 178, g: 117, b: 203 },
];

const MAX_PARTICLES = 15;

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
    this.radius = config.isMobile
      ? getRandomRange(8, 10)
      : getRandomRange(10, 15);
  }

  reset(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.acceleration.x = 0;
    this.acceleration.y = 0;
    this.exploded = false;
  }

  emit(count) {
    if (this.particles.length >= MAX_PARTICLES) return;

    for (let i = 0; i < count; i++) {
      let newParticle;
      if (particleBuffer.particles.length > 0) {
        newParticle = particleBuffer.particles.pop();
        newParticle.reset(this.position.x, this.position.y, this.color);
      } else {
        newParticle = new Particle(
          this.position.x,
          this.position.y,
          1,
          this.color
        );
      }

      this.particles.push(newParticle);
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

    let newExplosion;
    if (explosionBuffer.explosions.length > 0) {
      newExplosion = explosionBuffer.explosions.pop();
      newExplosion.reset(this.position.x, this.position.y, this.color);
    } else {
      newExplosion = new Explosion(
        this.position.x,
        this.position.y,
        this.color
      );
    }

    explosionManager.explosions.push(newExplosion);
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

    let aliveParticles = [];
    let deadParticles = [];

    for (let i = 0; i < this.particles.length; i++) {
      const currentParticle = this.particles[i];
      if (currentParticle.dead()) {
        deadParticles.push(currentParticle);
      } else {
        aliveParticles.push(currentParticle);
      }
    }

    this.particles = aliveParticles;
    particleBuffer.particles.push(...deadParticles);
  }

  display() {
    if (!this.exploded) {
      push();
      strokeWeight(2);
      stroke(250);
      fill(`rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`);
      circle(this.position.x, this.position.y, this.radius);
      pop();

      for (let particle of this.particles) {
        particle.display();
      }
    }
  }
}
