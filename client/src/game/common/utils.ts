export class Point {
  private _x: number;
  private _y: number;

  get x(): number {
    return this._x | 0;
  }

  set x(val: number) {
    this._x = val | 0;
  }

  get y(): number {
    return this._y | 0;
  }

  set y(val: number) {
    this._y = val | 0;
  }

  static Create(pos: Point): Point {
    return new Point(pos.x, pos.y);
  }

  constructor(x: number, y: number) {
    this._x = x | 0;
    this._y = y | 0;
  }

  offset(windowLocation: Point): Point {
    return new Point(this.x + windowLocation.x, this.y + windowLocation.y);
  }

  negatePoint(windowLocation: Point): Point {
    return new Point(this.x - windowLocation.x, this.y - windowLocation.y);
  }

  negate(x: number, y: number): Point {
    return new Point(this.x - (x | 0), this.y - (y | 0));
  }

  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export class DoublePoint {
  x: number;
  y: number;

  static create(pos: DoublePoint): DoublePoint {
    return new DoublePoint(pos.x, pos.y);
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  offset(windowLocation: DoublePoint): DoublePoint {
    return new DoublePoint(this.x + windowLocation.x, this.y + windowLocation.y);
  }

  negatePoint(windowLocation: DoublePoint): DoublePoint {
    return new DoublePoint(this.x - windowLocation.x, this.y - windowLocation.y);
  }

  negate(x: number, y: number): DoublePoint {
    return new DoublePoint(this.x - (x | 0), this.y - (y | 0));
  }

  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}

export class IntersectingRectangle extends Point {
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  intersects(p: Point): boolean {
    return this.x < p.x && this.x + this.width > p.x && this.y < p.y && this.y + this.height > p.y;
  }

  static intersectsRect(r: Rectangle, p: Point): boolean {
    return r.x < p.x && r.x + r.width > p.x && r.y < p.y && r.y + r.height > p.y;
  }

  static intersectRect(r1: Rectangle, r2: Rectangle): boolean {
    return !(r2.x > r1.x + r1.width || r2.x < r1.x || r2.y > r1.y + r1.height || r2.y < r1.y);
  }
}

export class Rectangle extends Point {
  width: number;
  height: number;

  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(x, y);
    this.width = width;
    this.height = height;
  }
}
