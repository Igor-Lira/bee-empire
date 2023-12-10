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
    // if ((numberPlayerA > 0 && !hexagons[wall.hexagonBorder]?.mine) || numberPlayerB > 0) {

    if (numberPlayerA > 0 || numberPlayerB > 0) {
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
      if (wall.hexagonBorder && map.honeycomb.hexagons[wall.hexagonBorder]) {
        map.honeycomb.hexagons[wall.hexagonBorder].isMine = true;
      }
    }
  } else {
    wall.isOnFight = false;
  }
}
function checkFights() {
  map.honeycomb.forEachWall(checkWinnerForWall);
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


//
// function drawBee(x, y, size, isSelected = false) {
//   ctx.fillStyle = isSelected ? 'red' : 'black';
//   ctx.fillRect(x - size/2, y - size/2, size, size);
// }

function loop() {
  ctx.clearRect(map.x,map.y, map.width, map.height);
  map.honeycomb.draw();
  map.honeycomb.drawFights();
  map.honeycomb.drawMyWalls();
  drawObjects();
  requestAnimFrame(loop);
};

function checkFightLoop() {
  setInterval(checkFights, 10);
}
map.honeycomb = new Honeycomb();

loop();
handleAddBee();
handleAddBee();
checkFightLoop();




