function handleAddBee (bee) {
  if(!bee) {
    bee = {
      id,
      player: id,
      x : randMinMax(0, map.width-32),
      y : randMinMax(0, map.height-32),
      width : 20,
      height : 20,
      check : false
    };
  }
  id++;
  objects.push(bee);
  // map.insert(rect);
}


function handleClear() {
  objects = [];
  map.clear();
}

function checkWinnerForWall(wall) {
  const WALL_OFFSET = 20;
  for (let bee of objects) {
      if (
        lineIntersectsRect(
          {x: wall.boundary.x1 + WALL_OFFSET*wall.direction.i, y: wall.boundary.y1 + WALL_OFFSET*wall.direction.j},
          {x: wall.boundary.x2 + WALL_OFFSET*wall.direction.i, y: wall.boundary.y2 + WALL_OFFSET*wall.direction.j},
          bee
        ) ||
        lineIntersectsRect(
          {x: wall.boundary.x1 - WALL_OFFSET*wall.direction.i, y: wall.boundary.y1 - WALL_OFFSET*wall.direction.j},
          {x: wall.boundary.x2 - WALL_OFFSET*wall.direction.i, y: wall.boundary.y2 - WALL_OFFSET*wall.direction.j},
          bee)
      ) {
        if (!wall?.collisions?.includes(bee.id)){
          wall.collisions.push(bee.id)
        }
      } else {
        let findBee = wall?.collisions?.findIndex(c => c === bee.id);
        if (findBee > -1) {
          wall.collisions.splice(findBee, 1);
        }
      }
  }
  if (wall.collisions.length > 0) {
    let numberPlayerA = 0;
    let numberPlayerB = 0;
    for (let collision of wall.collisions) {
      if (collision === 0) {
        numberPlayerA++;
      }
      if (collision === 1) {
        numberPlayerB++;
      }
    }
    if ((numberPlayerA > 0 && !hexagons[wall.hexagonBorder]?.mine) || numberPlayerB > 0) {
      wall.isOnFight = true;
    } else {
      wall.isOnFight = false;
      wall.fight.playerA = 0;
      wall.fight.playerB = 0;
    }

    if (numberPlayerA > numberPlayerB) {
      wall.fight.playerA++;
      wall.fight.playerB--;
    } else {
      wall.fight.playerA--;
      wall.fight.playerB++;
    }
    if (wall.fight.playerA > 100) {
      // TODO: hexagon is mine
      if (hexagons[wall.hexagonBorder]) {
        hexagons[wall.hexagonBorder].mine = true;
      }
    }
  } else {
    wall.isOnFight = false;
  }
}
function checkFights() {
  for (let id in hexagons) {
    for (let wall of hexagons[id].walls) {
      checkWinnerForWall(wall);
    }
  }
}

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


function setColorToLine(lineId, fightColorsStyle, row) {
  walls.forEach(wall => {
    if (wall.id === lineId && wall.isOnFight) {
      ctx.strokeStyle = fightColorsStyle[fightColorsStyle.length * Math.random() | 0];
    } else {
      if (row % 2 === 0) {
        ctx.strokeStyle = '#f0e68c';
      } else {
        ctx.strokeStyle = '#000';
      }
    }
  })
}

function drawFights() {
  for (let wall of walls) {
    if (wall.isOnFight) {
      ctx.moveTo(wall.boundary.x1, wall.boundary.y1);
      ctx.lineTo(wall.boundary.x2, wall.boundary.y2);
      const fightColorsStyle = ['red', 'violet'];
      ctx.strokeStyle = fightColorsStyle[fightColorsStyle.length * Math.random() | 0];
      ctx.stroke();
    }
  }
}

function drawMyWalls() {
  for (let wall of walls) {
   if (hexagons[wall.hexagon]?.mine && hexagons[wall.hexagonBorder]?.mine) {
     console.log('mine walls');
     ctx.moveTo(wall.boundary.x1, wall.boundary.y1);
     ctx.lineTo(wall.boundary.x2, wall.boundary.y2);
     ctx.strokeStyle = '#f0e68c';
     ctx.stroke();
   }
  }
}

function drawHexagon(x, y, size, row, col, add= false) {
  let hexagonId = row.toString() + col.toString();
  ctx.beginPath();
  ctx.fillStyle = '#F9F171';
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#000';

  // if (row %2 === 0) {
  //   ctx.strokeStyle = '#f0e68c';
  // } else {
  // }

  let line;
  let lineId;
  let hexagonBorderWith;

  lineId = hexagonId + 'L1';
  hexagonBorderWith = (row+1).toString() + (col+1).toString();

  ctx.moveTo(x, y + size*Math.sqrt(3));
  ctx.stroke();
  ctx.lineTo(x + 1.5*size, y + Math.sqrt(3)*size/2);
  if (add) {
    line = { x1: x, y1: y + size*Math.sqrt(3), x2: x + 1.5*size, y2: y + Math.sqrt(3)*size/2  }
    walls.push({
      id: lineId,
      boundary: line,
      direction: { i: -1, j: 1 },
      collisions: [],
      hexagon: hexagonId,
      hexagonBorder: hexagonBorderWith,
      isOnFight: false,
      fight: { playerA: 0, playerB: 0 }
    });
  }

  lineId = hexagonId + 'L2';
  ctx.lineTo(x + 1.5*size, y - Math.sqrt(3)*size/2);
  if (add) {
    line = { x1: x + 1.5*size, y1: y + Math.sqrt(3)*size/2, x2: x + 1.5*size, y2: y - Math.sqrt(3)*size/2 }
    walls.push({id: lineId, boundary: line, direction: { i: -1, j: 0 }, collisions: [], hexagon: hexagonId,  isOnFight: false, fight: { playerA: 0, playerB: 0 }});
  }

  lineId = hexagonId + 'L3';
  ctx.lineTo(x, y - size*Math.sqrt(3));
  if (add) {
    line = { x1: x + 1.5*size, y1: y - Math.sqrt(3)*size/2, x2: x, y2: y - size*Math.sqrt(3) }
    walls.push({id: lineId, boundary: line, direction: { i: -1, j: -1 },  collisions: [], hexagon: hexagonId, isOnFight: false, fight: { playerA: 0, playerB: 0 }});
  }

  lineId = hexagonId + 'L4';
  ctx.lineTo(x - 1.5*size, y - Math.sqrt(3)*size/2);
  if (add) {
    line = { x1: x, y1: y - size*Math.sqrt(3), x2: x - 1.5*size, y2: y - Math.sqrt(3)*size/2 }
    walls.push({id: lineId, boundary: line, direction: { i: 1, j: -1 }, collisions: [], hexagon: hexagonId,  isOnFight: false, fight: { playerA: 0, playerB: 0 }});
  }

  lineId = hexagonId + 'L5';
  ctx.lineTo(x - 1.5*size, y + Math.sqrt(3)*size/2);
  if (add) {
    line = { x1: x - 1.5*size, y1: y - Math.sqrt(3)*size/2, x2: x - 1.5*size, y2: y + Math.sqrt(3)*size/2  }
    walls.push({id: lineId, boundary: line, direction: { i: 1, j: 0 }, collisions: [], hexagon: hexagonId, isOnFight: false, fight: { playerA: 0, playerB: 0 }});
  }

  lineId = hexagonId + 'L6';
  if (add) {
    line = {  x1: x - 1.5*size, y1: y + Math.sqrt(3)*size/2, x2: x, y2: y + size*Math.sqrt(3) }
    walls.push({id: lineId, boundary: line, direction: { i: 1, j: 1 }, collisions: [], hexagon: hexagonId, isOnFight: false, fight: { playerA: 0, playerB: 0 }});
  }

  if (add) {
    hexagons[hexagonId] = {}
    hexagons[hexagonId].walls = walls.slice(walls.length - 6, walls.length);
    hexagons[hexagonId].mine = false;
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
  drawMyWalls();
  drawFights();
  requestAnimFrame(loop);
};

function checkFightLoop() {
  setInterval(checkFights, 10);
}

drawHoneycomb(rows, cols, hexSize, xOffset, yOffset, true);
loop();
handleAddBee();
handleAddBee();
checkFightLoop();

