function randMinMax(min, max, round) {
  let val = min + (Math.random() * (max - min));

  if(round) val = Math.round(val);

  return val;
};

function isPointInsideSelectionBox(x, y, boxX, boxY, boxWidth, boxHeight) {
  return x >= boxX && x <= boxX + boxWidth && y >= boxY && y <= boxY + boxHeight;
}
