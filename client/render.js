const cv = document.getElementById('canvas');
const ctx = cv.getContext('2d');
cv.width = window.innerWidth;
cv.height = window.innerHeight;

function drawHexagon(x, y, size) {
  ctx.beginPath();
  ctx.fillStyle = '#F9F171';
  ctx.lineWidth = 5;
  ctx.moveTo(x, y + size*Math.sqrt(3));
  ctx.lineTo(x + 1.5*size, y + Math.sqrt(3)*size/2);
  ctx.lineTo(x + 1.5*size, y - Math.sqrt(3)*size/2);
  ctx.lineTo(x, y - size*Math.sqrt(3));
  ctx.lineTo(x - 1.5*size, y - Math.sqrt(3)*size/2);
  ctx.lineTo(x - 1.5*size, y + Math.sqrt(3)*size/2);
  ctx.fill();
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(x, y, size, size,  Math.PI / 180, 0, 2 * Math.PI);
  ctx.fillStyle = '#E6CC47'
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

function drawHoneycomb(rows, cols, hexSize, xOffset, yOffset) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x;
      if (row % 2 === 0) {
        x = xOffset + col * 2*hexWidth;
      } else {
        x = xOffset + hexWidth + col *2*hexWidth;
      }
      const y = yOffset + row * 1.5*hexHeight;
      drawHexagon(x, y, hexSize);
    }
  }
}

const hexSize = 100;
const hexHeight = hexSize * Math.sqrt(3);
const hexWidth = hexSize * 1.5;
const rows = 10;
const cols = 10;
const xOffset = 50;
const yOffset = 50;

drawHoneycomb(rows, cols, hexSize, xOffset, yOffset);

function drawBee(x, y, size, isSelected = false) {
  ctx.fillStyle = isSelected ? 'red' : 'black';
  ctx.fillRect(x - size/2, y - size/2, size, size);
}

const global = {};

global.player = {};

global.player.bee = {
  x: 100,
  y: 100,
}


drawBee(global.player.bee.x, global.player.bee.y, 20);
