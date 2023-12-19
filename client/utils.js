function randMinMax(min, max, round) {
  let val = min + (Math.random() * (max - min));

  if(round) val = Math.round(val);

  return val;
};

function isPointInsideSelectionBox(x, y, boxX, boxY, boxWidth, boxHeight) {
  return x >= boxX && x <= boxX + boxWidth && y >= boxY && y <= boxY + boxHeight;
}

function getIntersection(r1, r2) {

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
function lineIntersectsLine(l1p1, l1p2, l2p1, l2p2) {
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
function lineIntersectsRect(p1, p2, r) {
  return lineIntersectsLine(p1, p2, { x: r.x, y: r.y }, { x: r.x + r.width, y: r.y }) ||
    lineIntersectsLine(p1, p2, { x: r.x + r.width, y: r.y }, { x: r.x + r.width, y: r.y + r.height }) ||
    lineIntersectsLine(p1, p2, { x: r.x + r.width, y: r.y + r.height }, { x: r.x, y: r.y + r.height }) ||
    lineIntersectsLine(p1, p2, { x: r.x, y: r.y + r.height }, { x: r.x, y: r.y })
    // (r.contains(p1) && r.contains(p2));
}

function intersectPointFor2Lines(x1, y1, x2, y2, x3, y3, x4, y4) {

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
