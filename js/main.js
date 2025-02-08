import { sketch } from '@/utils/p5-wrapper';
import config from '@/utils/config';
import { getRandomNumber } from '@/utils/random';
import { explosionManager, explosionParticleManager } from '@/utils/explosions';
import {
  emitterBuffer,
  explosionBuffer,
  explosionParticleBuffer,
} from '@/utils/buffers';
import Emitter from '@/classes/emitter';
import QuadTree, { Rectangle, Point } from '@/classes/quadtree';

sketch.setup = setup;
sketch.draw = draw;
sketch.keyPressed = keyPressed;

const EMITTER_COUNT = config.isMobile ? 15 : 90;
let emitters = [];

function setup() {
  if (!config.clearScreen) background(0);
  frameRate(config.frameRate);
  pixelDensity(config.pixelDensity);
  if (config.isMobile) {
    createCanvas(config.width, config.width);
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

  const boundary = new Rectangle(width / 2, height / 2, width, height);
  const quadtree = new QuadTree(boundary, 4);

  // put in quadtree
  for (let i = 0; i < emitters.length; i++) {
    const currentEmiter = emitters[i];
    quadtree.insert(
      new Point(
        currentEmiter.position.x,
        currentEmiter.position.y,
        currentEmiter
      )
    );

    currentEmiter.update();
    currentEmiter.display();
  }

  // use quadtree to check collision
  for (let e of emitters) {
    const range = new Rectangle(e.position.x, e.position.y, 25, 25);
    const points = quadtree.query(range);

    for (let point of points) {
      const other = point.userData;

      if (e.exploded || other.exploded) continue;

      if (e !== other && e.collides(other)) {
        e.explode();
        other.explode();
      }
    }

    if (!e.exploded) {
      e.emit(1);
      e.wrapEdges();
    }
  }

  for (let explosion of explosionManager.explosions) {
    explosion.update();
  }

  for (let explosionParticle of explosionParticleManager.explosionParticles) {
    explosionParticle.update();
    explosionParticle.display();
  }

  // reuse emitters
  let aliveEmitters = [];
  let deadEmitters = [];
  for (let i = 0; i < emitters.length; i++) {
    const currentEmitter = emitters[i];
    if (currentEmitter.dead()) {
      deadEmitters.push(currentEmitter);
    } else {
      aliveEmitters.push(currentEmitter);
    }
  }

  emitterBuffer.emitters = deadEmitters;
  emitters = aliveEmitters;

  const emitterLength = aliveEmitters.length + deadEmitters.length;

  if (emitterLength < EMITTER_COUNT) {
    emitters.push(new Emitter(getRandomNumber(width), getRandomNumber(height)));
  } else if (emitterBuffer.emitters.length > 0) {
    const resetEmitter = emitterBuffer.emitters.pop();
    resetEmitter.reset(getRandomNumber(width), getRandomNumber(height));

    emitters.push(resetEmitter);
  }

  // reuse explosions
  let aliveExplosions = [];
  let deadExplosions = [];
  for (let i = 0; i < explosionManager.explosions.length; i++) {
    const currentExplosion = explosionManager.explosions[i];
    if (currentExplosion.dead()) {
      deadExplosions.push(currentExplosion);
    } else {
      aliveExplosions.push(currentExplosion);
    }
  }

  explosionManager.explosions = aliveExplosions;
  explosionBuffer.explosions = deadExplosions;

  // reuse explosion particles
  let aliveExplosionParticles = [];
  let deadExplosionParticles = [];
  for (let i = 0; i < explosionParticleManager.explosionParticles.length; i++) {
    const currentExplosionParticle =
      explosionParticleManager.explosionParticles[i];
    if (currentExplosionParticle.dead()) {
      deadExplosionParticles.push(currentExplosionParticle);
    } else {
      aliveExplosionParticles.push(currentExplosionParticle);
    }
  }

  explosionParticleManager.explosionParticles = aliveExplosionParticles;
  explosionParticleBuffer.explosionParticles = deadExplosionParticles;

  if (!config.animate) createStill();
}

// Still image
function createStill() {
  noLoop();
  for (let i = 0; i < config.interations; i++) {}
}

function keyPressed() {
  if (key === 's') {
    saveGif('output', config.duration);
  }
}
