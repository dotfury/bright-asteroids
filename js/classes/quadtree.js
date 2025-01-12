export class Point {
  constructor(x, y, userData) {
    this.x = x;
    this.y = y;
    this.userData = userData;
  }
}

export class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  contains(point) {
    return (
      point.x >= this.x - this.width &&
      point.x <= this.x + this.width &&
      point.y >= this.y - this.height &&
      point.y <= this.y + this.height
    );
  }

  intersects(range) {
    return !(
      range.x - range.width > this.x + this.width ||
      range.x + range.width < this.x - this.width ||
      range.y - range.height > this.y + this.height ||
      range.y + range.height < this.y - this.height
    );
  }
}

class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.radiusSquared = this.radius * this.radius;
  }

  contains(point) {
    // check if the point is in the circle by checking if the euclidean distance of
    // the point and the center of the circle if smaller or equal to the radius of
    // the circle
    let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
    return d <= this.rSquared;
  }

  intersects(range) {
    let xDist = Math.abs(range.x - this.x);
    let yDist = Math.abs(range.y - this.y);

    // radius of the circle
    let r = this.r;

    let w = range.w / 2;
    let h = range.h / 2;

    let edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);

    // no intersection
    if (xDist > r + w || yDist > r + h) return false;

    // intersection within the circle
    if (xDist <= w || yDist <= h) return true;

    // intersection on the edge of the circle
    return edges <= this.rSquared;
  }
}

export default class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
  }

  subdivide() {
    const { x, y, width, height } = this.boundary;

    this.northWest = new QuadTree(
      new Rectangle(x - width / 2, y - height / 2, width / 2, height / 2),
      this.capacity
    );
    this.northEast = new QuadTree(
      new Rectangle(x + width / 2, y - height / 2, width / 2, height / 2),
      this.capacity
    );
    this.southWest = new QuadTree(
      new Rectangle(x - width / 2, y + height / 2, width / 2, height / 2),
      this.capacity
    );
    this.southEast = new QuadTree(
      new Rectangle(x + width / 2, y + height / 2, width / 2, height / 2),
      this.capacity
    );

    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) return false;

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }

      if (this.northWest.insert(point)) return true;
      if (this.northEast.insert(point)) return true;
      if (this.southWest.insert(point)) return true;
      if (this.southEast.insert(point)) return true;
    }
  }

  query(range) {
    let found = [];

    if (!this.boundary.intersects(range)) {
      return found;
    } else {
      for (let p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }

      if (this.divided) {
        found = found.concat(this.northWest.query(range));
        found = found.concat(this.northEast.query(range));
        found = found.concat(this.southWest.query(range));
        found = found.concat(this.southEast.query(range));
      }

      return found;
    }
  }

  display() {
    stroke(255);
    strokeWeight(1);
    noFill();
    rectMode(CENTER);
    rect(
      this.boundary.x,
      this.boundary.y,
      this.boundary.width * 2,
      this.boundary.height * 2
    );

    if (this.divided) {
      this.northWest.display();
      this.northEast.display();
      this.southWest.display();
      this.southEast.display();
    }

    // strokeWeight(4);
    noStroke();
    for (let p of this.points) {
      point(p.x, p.y);
    }
  }
}
