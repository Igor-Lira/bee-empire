import Bee from "@entities/Bee";
import Wall from "@entities/Wall";

export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  multiply(q: number) {
    return new Vector(this.x * q, this.y * q);
  }
}

export class Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}

export class Rectangle {
  pos: Vector;
  width: number;
  height: number;
  constructor(pos: Vector, width: number, height: number) {
    this.pos = pos;
    this.width = width;
    this.height = height;
  }
}

export function getUniqueID(): string {
    function s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
}


export function lineIntersectsRect(p1: {x: number, y: number}, p2: {x: number, y: number }, r: {x: number, y: number, height: number, width: number}) {
  return lineIntersectsLine(p1, p2, { x: r.x, y: r.y }, { x: r.x + r.width, y: r.y }) ||
    lineIntersectsLine(p1, p2, { x: r.x + r.width, y: r.y }, { x: r.x + r.width, y: r.y + r.height }) ||
    lineIntersectsLine(p1, p2, { x: r.x + r.width, y: r.y + r.height }, { x: r.x, y: r.y + r.height }) ||
    lineIntersectsLine(p1, p2, { x: r.x, y: r.y + r.height }, { x: r.x, y: r.y })
  // (r.contains(p1) && r.contains(p2));
}

export function lineIntersectsLine(l1p1: {x: number, y: number}, l1p2: {x: number, y: number}, l2p1: {x: number, y: number}, l2p2: {x: number, y: number}) {
  let q = (l1p1.y - l2p1.y) * (l2p2.x - l2p1.x) - (l1p1.x - l2p1.x) * (l2p2.y - l2p1.y);
  let d = (l1p2.x - l1p1.x) * (l2p2.y - l2p1.y) - (l1p2.y - l1p1.y) * (l2p2.x - l2p1.x);

  if (d === 0) {
    return false;
  }

  let r = q / d;

  q = (l1p1.y - l2p1.y) * (l1p2.x - l1p1.x) - (l1p1.x - l2p1.x) * (l1p2.y - l1p1.y);
  let s = q / d;

  if (r < 0 || r > 1 || s < 0 || s > 1) {
    return false;
  }

  return true;
}

export function unitaryOrthogonalVector(line: Line): {x: number, y: number} {
  // Calculate the direction vector of the line
  let directionVector = [line.x2 - line.x1, line.y2 - line.y1];

  // Calculate the orthogonal vector
  let orthogonalVector = [-directionVector[1], directionVector[0]]; // Switch x and y, and negate one of them

  // Calculate the magnitude of the vector
  let magnitude = Math.sqrt(orthogonalVector[0] ** 2 + orthogonalVector[1] ** 2);

  // Calculate the unit vector
  let unitVector = { x: orthogonalVector[0] / magnitude, y: orthogonalVector[1] / magnitude };

  return unitVector;
}


export function computeBeeMove(xTarget: number, bee: Bee, yTarget: number) {
  const xTargetDiff = xTarget - bee.pos.x;
  const yTargetDiff = yTarget - bee.pos.y;
  const angle = Math.atan2(yTargetDiff, xTargetDiff);
  const distance = Math.hypot(xTargetDiff, yTargetDiff);
  const deltaX = 0.8 * Math.cos(angle);
  const deltaY = 0.8 * Math.sin(angle);
  return {distance, delta: new Vector(deltaX, deltaY)}
}

function intersectPointFor2Lines(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {

  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false
  }

  let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
  if (denominator === 0) {
    return false
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1)
  let y = y1 + ua * (y2 - y1)

  return {x, y}
}



export function LineCrossLine(wall: Wall, bee: Bee, targetX: number, targetY: number) {
  const result =  intersectPointFor2Lines(
    wall.boundary.x1,
    wall.boundary.y1,
    wall.boundary.x2,
    wall.boundary.y2,
    targetX,
    targetY,
    bee.pos.x,
    bee.pos.y,
  )
  return result;
}


export function getIntersection(r1: {x: number, y: number, width: number, height: number}, r2: {x: number, y: number, width: number, height: number}) {

  var r1w = r1.width/2,
    r1h = r1.height/2,
    r2w = r2.width/2,
    r2h = r2.height/2;

  var distX = (r1.x + r1w) - (r2.x + r2w);
  var distY = (r1.y + r1h) - (r2.y + r2h);

  if(Math.abs(distX) < r1w + r2w && Math.abs(distY) < r1h + r2h) {
    return {
      pushX : (r1w  + r2w) - Math.abs(distX),
      pushY : (r1h  + r2h) - Math.abs(distY),
      dirX : distX === 0 ? 0 : distX < 0 ? -1 : 1,
      dirY : distY === 0 ? 0 : distY < 0 ? -1 : 1
    }
  } else {
    return false;
  }
}


export function pointInsideHexagon(x: number, y: number, hexagonVertices: {x: number, y: number}[]): boolean {
  function pointInPolygon(x: number, y: number, poly: {x: number, y: number}[]): boolean {
    let isInside = false;
    let i, j = poly.length - 1;
    for (i = 0; i < poly.length; i++) {
      if ((poly[i].y > y) !== (poly[j].y > y) &&
        x < ((poly[j].x - poly[i].x) * (y - poly[i].y)) / (poly[j].y - poly[i].y) + poly[i].x) {
        isInside = !isInside;
      }
      j = i;
    }
    return isInside;
  }

  // Check if the point is inside the hexagon by checking against its vertices
  return pointInPolygon(x, y, hexagonVertices);
}
