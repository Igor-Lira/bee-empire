function handleAddBee (rect) {
  if(!rect) {
    rect = {
      x : randMinMax(0, map.bounds.width-32),
      y : randMinMax(0, map.bounds.height-32),
      width : 20,
      height : 20,
      check : false
    };
  }
  objects.push(rect);
  map.insert(rect);
}


function handleClear() {
  objects = [];
  map.clear();
}

function drawQuadtree (node) {
  const bounds = node.bounds;
  if(node.nodes.length === 0) {
    ctx.strokeStyle = 'rgba(255,0,0,0.5)';
    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

  } else {
    for(let i=0;i<node.nodes.length;i=i+1) {
      drawQuadtree(node.nodes[i]);
    }
  }
};

function drawObjects() {
  let obj;
  for(let i=0;i<objects.length;i=i+1) {
    obj = objects[i];
    if (obj.selected) {
      ctx.fillStyle = 'red';
    } else {
      ctx.fillStyle = 'blue';
    }
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  }
};


function drawHexagon(x, y, size, row, col, add= false) {
  // TODO: how to know if it is my hexagon.
  ctx.beginPath();
  ctx.fillStyle = '#F9F171';
  ctx.lineWidth = 5;

  if (row %2 === 0) {
    ctx.strokeStyle = '#f0e68c';
  } else {
    ctx.strokeStyle = '#000';
  }

  let line;

  ctx.moveTo(x, y + size*Math.sqrt(3));
  ctx.lineTo(x + 1.5*size, y + Math.sqrt(3)*size/2);
  if (add) {
    line = { x1: x, y1: y + size*Math.sqrt(3), x2: x + 1.5*size, y2: y + Math.sqrt(3)*size/2, i: -1, j: 1  }
    walls.push(line);
    // map.insert(line);
  }

  ctx.lineTo(x + 1.5*size, y - Math.sqrt(3)*size/2);
  if (add) {
    line = { x1: x + 1.5*size, y1: y + Math.sqrt(3)*size/2, x2: x + 1.5*size, y2: y - Math.sqrt(3)*size/2, i: -1, j: 0  }
    walls.push(line);
    // map.insert(line);
  }

  ctx.lineTo(x, y - size*Math.sqrt(3));
  if (add) {
    line = { x1: x + 1.5*size, y1: y - Math.sqrt(3)*size/2, x2: x, y2: y - size*Math.sqrt(3), i: -1, j: -1 }
    walls.push(line);
    // map.insert(line);
  }

  ctx.lineTo(x - 1.5*size, y - Math.sqrt(3)*size/2);
  if (add) {
    line = { x1: x, y1: y - size*Math.sqrt(3), x2: x - 1.5*size, y2: y - Math.sqrt(3)*size/2, i: 1, j: -1 }
    walls.push(line);
    // map.insert(line);
  }

  ctx.lineTo(x - 1.5*size, y + Math.sqrt(3)*size/2);

  if (add) {
    line = { x1: x - 1.5*size, y1: y - Math.sqrt(3)*size/2, x2: x - 1.5*size, y2: y + Math.sqrt(3)*size/2, i: 1, j: 0 }
    walls.push(line);
    // map.insert(line);
  }

  if (add) {
    line = {  x1: x - 1.5*size, y1: y + Math.sqrt(3)*size/2, x2: x, y2: y + size*Math.sqrt(3), i: 1, j: 1}
    walls.push(line);
  }

  if (add) {
    let hexagonId = row.toString() + col.toString();
    hexagons[hexagonId] = {}
    hexagons[hexagonId].walls = walls.slice(walls.length - 6, walls.length);
    if (row % 2 === 0) {
      hexagons[hexagonId].mine = true;
      ctx.fillStyle = '#FFF';
    }
  }


  ctx.fill();
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(x, y, size, size,  Math.PI / 180, 0, 2 * Math.PI);
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#E6CC47';
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

function drawHoneycomb(rows, cols, hexSize, xOffset, yOffset, add=false) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x;
      if (row % 2 === 0) {
        x = xOffset + col * 2*hexWidth;
      } else {
        x = xOffset + hexWidth + col *2*hexWidth;
      }
      const y = yOffset + row * 1.5*hexHeight;
      drawHexagon(x, y, hexSize, row, col, add);
    }
  }
}

const hexSize = 100;
const hexHeight = hexSize * Math.sqrt(3);
const hexWidth = hexSize * 1.5;
const rows = 5;
const cols = 5;
const xOffset = 50;
const yOffset = 50;

//
// function drawBee(x, y, size, isSelected = false) {
//   ctx.fillStyle = isSelected ? 'red' : 'black';
//   ctx.fillRect(x - size/2, y - size/2, size, size);
// }

function loop() {

  let candidates = [];
  ctx.clearRect(map.x,map.y, map.width, map.height);

  for(let i=0;i<objects.length;i=i+1) {
    objects[i].check = false;
  }

  drawHoneycomb(rows, cols, hexSize, xOffset, yOffset);
  drawObjects();
  requestAnimFrame(loop);
};

drawHoneycomb(rows, cols, hexSize, xOffset, yOffset, true);
loop();
handleAddBee();
handleAddBee();

