import p5 from 'p5/lib/p5';

import config from '@/utils/config';
import { getRandomRange } from '@/utils/random';

export default class ExplosionParticle {
  constructor(x, y, color) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(getRandomRange(3, 9));
    this.color = color;
    this.dampening = 0.99;
    this.size = config.isMobile
      ? getRandomRange(8, 15)
      : getRandomRange(12, 20);
    this.particleType = Math.round(getRandomRange(1, 3));
  }

  reset(x, y, color) {
    this.position.x = x;
    this.position.y = y;
    this.color = color;
    this.size = config.isMobile
      ? getRandomRange(8, 15)
      : getRandomRange(12, 20);
  }

  update() {
    this.position.add(this.velocity);

    this.velocity.mult(this.dampening);
    this.size -= 0.5;
  }

  dead() {
    return this.size <= 0;
  }

  display() {
    push();
    const red = this.color.r;
    const green = this.color.g;
    const blue = this.color.b;
    const color = `rgb(${red}, ${green}, ${blue})`;
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = color;

    const size = Math.round(this.size);

    if (size >= 1) {
      fill(`rgb(${red}, ${green}, ${blue})`);
      noStroke();
      if (this.particleType == 1) {
        rect(this.position.x, this.position.y, size);
      } else if (this.particleType == 2) {
        ellipse(this.position.x, this.position.y, size);
      } else {
        stroke(`rgb(${red}, ${green}, ${blue})`);
        noFill();
        line(
          this.position.x,
          this.position.y,
          this.position.x + getRandomRange(-size, size),
          this.position.y + getRandomRange(-size, size)
        );
      }
    }
    pop();
  }
}
