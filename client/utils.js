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
