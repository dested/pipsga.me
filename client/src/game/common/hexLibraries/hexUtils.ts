export class Node<TPiece extends Vector3d> {
  parent: Node<TPiece> | null = null;
  x = 0;
  y = 0;
  item: TPiece | null = null;
  f = 0;
  g = 0;

  constructor(parent: Node<TPiece> | null, piece: TPiece) {
    this.parent = parent;
    // array index of this Node in the world linear array

    // the location coordinates of this Node
    this.x = piece.x;
    this.y = piece.z;
    this.item = piece;
    // the distanceFunction cost to get
    // TO this Node from the START
    this.f = 0;
    // the distanceFunction cost to get
    // from this Node to the GOAL
    this.g = 0;
  }

  value() {
    return this.x + this.y * 5000;
  }
}

export type Vector3d = {
  x: number;
  y: number;
  z: number;
};

export class HexUtils {
  static distance(p1: Vector3d, p2: Vector3d) {
    const x1 = p1.x;
    const y1 = p1.z;

    const x2 = p2.x;
    const y2 = p2.z;

    const du = x2 - x1;
    const dv = y2 + ((x2 / 2) | 0) - (y1 + ((x1 / 2) | 0));
    if ((du >= 0 && dv >= 0) || (du < 0 && dv < 0)) return Math.max(Math.abs(du), Math.abs(dv));
    else return Math.abs(du) + Math.abs(dv);
  }

  static orderBy<T>(list: T[], callback: (item: T) => number) {
    const itms = [];
    for (const obj of list) {
      itms.push({item: obj, val: callback(obj)});
    }
    itms.sort((a, b) => a.val - b.val);
    list = [];
    for (const obj1 of itms) {
      list.push(obj1.item);
    }
    return list;
  }

  static mathSign(f: number) {
    if (f < 0) return -1;
    else if (f > 0) return 1;
    return 0;
  }

  static getDirection(p1: Vector3d, p2: Vector3d): Direction {
    console.log('x1', p1.x, 'x2', p2.x, 'y1', p1.z, 'y2', p2.z);
    if (p1.x > p2.x) {
      if (p1.z === p2.z) {
        return Direction.BottomLeft;
      } else {
        if (p1.z < p2.z) {
          return Direction.TopLeft;
        } else {
          return Direction.BottomLeft;
        }
      }
    } else if (p1.x < p2.x) {
      if (p1.z === p2.z) {
        console.log('a');
        return Direction.TopRight;
      } else {
        if (p1.z < p2.z) {
          console.log('b');
          return Direction.BottomRight;
        } else {
          console.log('c');
          return Direction.TopRight;
        }
      }
    } else {
      if (p1.z < p2.z) {
        return Direction.Bottom;
      } else {
        return Direction.Top;
      }
    }
  }
}

enum Direction {
  TopLeft = 0,
  Top = 1,
  TopRight = 2,
  BottomRight = 3,
  Bottom = 4,
  BottomLeft = 5,
}
