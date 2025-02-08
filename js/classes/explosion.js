import { getRandomRange } from '@/utils/random';
import ExplosionParticle from '@/classes/explosionParticle';
import { explosionParticleManager } from '@/utils/explosions';
import { explosionParticleBuffer } from '@/utils/buffers';

export default class Explosion {
  constructor(x, y, color) {
    this.count = getRandomRange(15, 30);
    this.lifeTime = getRandomRange(30, 45);
    this.color = color;
    this.particles = [];

    this.setupExplosionParticles(x, y, color);
  }

  setupExplosionParticles(x, y, color) {
    for (let i = 0; i < this.count; i++) {
      let explosionP;

      if (explosionParticleBuffer.explosionParticles.length > 0) {
        explosionP = explosionParticleBuffer.explosionParticles.pop();
        explosionP.reset(x, y, color);
      } else {
        explosionP = new ExplosionParticle(x, y, color);
      }

      explosionParticleManager.explosionParticles.push(explosionP);
    }
  }

  reset(x, y, color) {
    this.color = color;
    this.particles = [];
    this.lifeTime = getRandomRange(30, 45);

    this.setupExplosionParticles(x, y, color);
  }

  dead() {
    return this.lifeTime <= 0;
  }

  update() {
    this.lifeTime--;
  }
}
