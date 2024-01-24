class World {
  x;
  y;
  width;
  height;
  honeycomb = null;
  data = { bees: [] };
  bees = [];
  controller;
  HEXAGON_BACKGROUND_NOT_CONQUERED = '#F9F171';
  HEXAGON_BACKGROUND_CONQUERED = '#e3ff00';
  MY_WALL = '#f0e68c';
  fightColorsStyle = ['red', 'violet'];

  constructor(world) {
    this.x = world.x;
    this.y = world.y;
    const hexSize = world.hexSize;
    const hexHeight = hexSize * Math.sqrt(3);
    const hexWidth = hexSize * 1.5;
    this.width = world.cols * 2 * hexWidth;
    this.height = world.rows * 1.5 * hexHeight;
    MAX_OFFSET_X_INF = -this.width + window.innerWidth - 200;
    MAX_OFFSET_Y_INF = -this.height + window.innerHeight - 200;
    this.controller = new WorldController(this);
    setListeners(this);
    this.loop();
  }

  loop() {
    this.controller.scroll();
    requestAnimFrame(() => this.loop(this));
  }


  drawEntities(data) {
    this.data = data;
    const hexagons = this.data.honeycomb?.hexagons;
    hexagons?.forEach(hexagon => {
      this.drawWalls(hexagon);
      this.drawHexagonCenter(hexagon);
    });
    this.drawBees();
  }

  drawBees() {
    const bees = this.data?.bees;
    this.data.bees = bees;
    this.data.bees.forEach(bee => {
      if (!this.bees[bee.id]) {
        this.bees[bee.id] = new Bee(1, bee.id);
      }
      this.bees[bee.id].mine = bee.mine;
      this.bees[bee.id].x = bee.x;
      this.bees[bee.id].y = bee.y;
      this.bees[bee.id].draw();
    })
  }

  drawWalls(hexagon) {
    const _fillStyle = ctx.fillStyle;
    const _lineWidth = ctx.lineWidth;
    const _strokeStyle = ctx.strokeStyle;

    this.drawWallsDefault(hexagon);


    /** DEBUG **/
    // this.drawWallFightMasks(hexagon);


    ctx.fillStyle = _fillStyle;
    ctx.lineWidth = _lineWidth;
    ctx.strokeStyle = _strokeStyle;


    ctx.lineWidth = 4;
    hexagon?.walls?.forEach(wall => {
      if (wall.isOnFight) {
        this.drawFights(wall);
      } else if (wall.mine) {
        this.drawMyWalls(wall);
      }
    })
  }

  drawWallsDefault(hexagon) {
    ctx.beginPath();
    if (hexagon?.mine) {
      ctx.fillStyle = this.HEXAGON_BACKGROUND_CONQUERED;
    } else {
      ctx.fillStyle = this.HEXAGON_BACKGROUND_NOT_CONQUERED;
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#E6CC47';

    hexagon?.walls?.forEach(wall => {
      ctx.lineTo(wall.boundary.x2 + xOffset, wall.boundary.y2 + yOffset);
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawWallFightMasks(hexagon) {
    ctx.beginPath();

    ctx.lineWidth = 4;
    ctx.strokeStyle = 'red';

    hexagon?.walls?.forEach(wall => {
      ctx.lineTo(wall.maskFight.x2 + xOffset, wall.maskFight.y2 + yOffset);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawMyWalls(wall) {
    ctx.beginPath();
    const _strokeStyle = ctx.strokeStyle;
    const _lineWidth = ctx.lineWidth;
    ctx.moveTo(wall.boundary.x1 + xOffset, wall.boundary.y1 + yOffset);
    ctx.lineTo(wall.boundary.x2 + xOffset, wall.boundary.y2 + yOffset);
    ctx.strokeStyle = this.MY_WALL;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.strokeStyle = _strokeStyle;
    ctx.lineWidth = _lineWidth;
    ctx.closePath();
  }

  drawFights(wall) {
    const _strokeStyle = ctx.strokeStyle;
    const _lineWidth = ctx.lineWidth;
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = this.fightColorsStyle[this.fightColorsStyle.length * Math.random() | 0];
    ctx.moveTo(wall.boundary.x1 + xOffset, wall.boundary.y1 + yOffset);
    ctx.lineTo(wall.boundary.x2 + xOffset, wall.boundary.y2 + yOffset);
    ctx.stroke();
    ctx.closePath();
    ctx.strokeStyle = _strokeStyle;
    ctx.lineWidth = _lineWidth;
  }

  drawHexagonCenter(hexagon) {
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
}
