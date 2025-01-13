import { sketch } from '@/utils/p5-wrapper';
import config from '@/utils/config';
import { getRandomNumber } from '@/utils/random';
import explosionManager from '@/utils/explosions';
import Emitter from '@/classes/emitter';
import QuadTree, { Rectangle, Point } from '@/classes/quadtree';

sketch.setup = setup;
sketch.draw = draw;
sketch.keyPressed = keyPressed;

const EMITTER_COUNT = config.isMobile ? 10 : 80;
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

  const boundary = new Rectangle(width / 2, height / 2, width, height);
  const quadtree = new QuadTree(boundary, 4);

  strokeWeight(1);
  stroke(100);
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

  noStroke();
  for (let explosion of explosionManager.explosions) {
    explosion.update();
    explosion.display();
  }

  if (emitters.length < EMITTER_COUNT) {
    emitters.push(new Emitter(getRandomNumber(width), getRandomNumber(height)));
  }

  emitters = emitters.filter((emitter) => !emitter.dead());
  explosionManager.explosions = explosionManager.explosions.filter(
    (explosion) => !explosion.dead()
  );

  // quadtree.display();

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
