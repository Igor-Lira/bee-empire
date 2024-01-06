const world = new World();

world.loop();

const HEXAGON_BACKGROUND_NOT_CONQUERED = '#F9F171';
const HEXAGON_BACKGROUND_CONQUERED = '#e3ff00';

const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function(event) {
  console.log('Connected to the server');
  socket.send('Hello, server!');
};

function drawWalls(hexagon) {
  const _fillStyle = ctx.fillStyle;
  const _lineWidth = ctx.lineWidth;
  const _strokeStyle = ctx.strokeStyle;

  ctx.beginPath();
  if (hexagon?.mine) {
    ctx.fillStyle = HEXAGON_BACKGROUND_CONQUERED;
  } else {
    ctx.fillStyle = HEXAGON_BACKGROUND_NOT_CONQUERED;
  }
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#E6CC47';

  hexagon?.walls?.forEach(wall => {
    ctx.lineTo(wall.boundary.x2 + xOffset, wall.boundary.y2 + yOffset);
  })

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = _fillStyle;
  ctx.lineWidth = _lineWidth;
  ctx.strokeStyle = _strokeStyle;


  /** Draw Flights + Draw My Walls **/
  ctx.lineWidth = 4;
  hexagon?.walls?.forEach(wall => {
    if (wall.isOnFight) {
      const _strokeStyle = ctx.strokeStyle;
      const _lineWidth = ctx.lineWidth;
      ctx.beginPath();
      const fightColorsStyle = ['red', 'violet'];
      ctx.lineWidth = 5;
      ctx.strokeStyle = fightColorsStyle[fightColorsStyle.length * Math.random() | 0];
      ctx.moveTo(wall.boundary.x1 + xOffset, wall.boundary.y1 + yOffset);
      ctx.lineTo(wall.boundary.x2 + xOffset, wall.boundary.y2 + yOffset);
      ctx.stroke();
      ctx.closePath();
      ctx.strokeStyle = _strokeStyle;
      ctx.lineWidth = _lineWidth;
    } else if (wall.mine) {
      if (wall.mine) {
        ctx.beginPath();
        const _strokeStyle = ctx.strokeStyle;
        const _lineWidth = ctx.lineWidth;
        ctx.moveTo(wall.boundary.x1 + xOffset, wall.boundary.y1 + yOffset);
        ctx.lineTo(wall.boundary.x2 + xOffset, wall.boundary.y2 + yOffset);
        ctx.strokeStyle = '#f0e68c';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.strokeStyle = _strokeStyle;
        ctx.lineWidth = _lineWidth;
        ctx.closePath();
      }
    }
  })


}

function drawCenter(hexagon) {
  const _fillStyle = ctx.fillStyle;
  const _lineWidth = ctx.lineWidth;
  ctx.beginPath();
  ctx.ellipse(hexagon.x + xOffset, hexagon.y + yOffset, hexagon.size, hexagon.size, Math.PI / 180, 0, 2 * Math.PI);
  const grd = ctx.createRadialGradient(hexagon.x + xOffset, hexagon.y + yOffset, 0, hexagon.x + xOffset, hexagon.y + yOffset, hexagon.size);
  grd.addColorStop(0, "yellow");
  grd.addColorStop(1, "#E6CC47");
  ctx.fillStyle = grd;
  ctx.lineWidth = 5;
  ctx.fill();
  ctx.closePath();
  ctx.fillStyle = _fillStyle;
  ctx.lineWidth = _lineWidth;
}

function drawBee(bee) {
  const _strokeStyle = ctx.strokeStyle;
  const _fillStyle = ctx.strokeStyle;
  const _lineWidth = ctx.lineWidth;
  setColor(bee);
  drawTrajectory(bee);
  drawBeeSprint(bee);
  ctx.strokeStyle = _strokeStyle;
  ctx.fillStyle = _fillStyle;
  ctx.lineWidth = _lineWidth;
}

function setColor(bee) {
  console.log(bee.selected);
  if (bee.selected) {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
  } else {
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
  }
}

function drawBeeSprint(bee) {
  const img = new Image();
  if (this.selected) {
    img.src = 'assets/bee-selected.png';
  } else {
    img.src = "assets/bee.png";
  }

  const imgWidth = 25;
  ctx.drawImage(img, bee.x - imgWidth / 2 + xOffset, bee.y - imgWidth / 2 + yOffset);
}

function drawTrajectory(bee) {
  if (bee.trajectory?.xTarget && bee.trajectory?.yTarget) {
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(bee.x + xOffset, bee.y + yOffset);
    ctx.lineTo(bee.trajectory.fixedX + xOffset, bee.trajectory.fixedY + yOffset);
    ctx.strokeStyle = 'black';
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    /** display fixed **/
    ctx.fillRect(this.trajectory.fixedX + xOffset, this.trajectory.fixedY + yOffset, 10, 10);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
}

socket.onmessage = (event) => {
  // console.log('Received message:', event.data);
  // ctx.clearRect(this.x, this.y, this.width, this.height);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const data = JSON.parse(event.data);

  const hexagons = data.world?.hexagons;
  hexagons?.forEach(hexagon => {
    drawWalls(hexagon);
    drawCenter(hexagon);
  });

  const bees = data?.bees;
  world.data.bees = bees;
  world.data.bees.forEach(bee => {
    if (!world.bees[bee.id]) {
      world.bees[bee.id] = new Bee(1, bee.id);
    }
    world.bees[bee.id].mine = bee.mine;
    world.bees[bee.id].x = bee.x;
    world.bees[bee.id].y = bee.y;
    world.bees[bee.id].draw();
  })
};

socket.onclose = function(event) {
  console.log('Connection closed');
};


