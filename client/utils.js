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
function lineIntersectsRect(p1, p2, r) {
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

  return lineIntersectsLine(p1, p2, { x: r.x, y: r.y }, { x: r.x + r.width, y: r.y }) ||
    lineIntersectsLine(p1, p2, { x: r.x + r.width, y: r.y }, { x: r.x + r.width, y: r.y + r.height }) ||
    lineIntersectsLine(p1, p2, { x: r.x + r.width, y: r.y + r.height }, { x: r.x, y: r.y + r.height }) ||
    lineIntersectsLine(p1, p2, { x: r.x, y: r.y + r.height }, { x: r.x, y: r.y })
    // (r.contains(p1) && r.contains(p2));
}
