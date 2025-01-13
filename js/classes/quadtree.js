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
