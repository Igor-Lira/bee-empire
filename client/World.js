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


  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = cols * 2 * hexWidth;
    this.height = rows * 1.5 * hexHeight;
    MAX_OFFSET_X_INF = -this.width + window.innerWidth - 200;
    MAX_OFFSET_Y_INF = -this.height + window.innerHeight - 200;
    this.honeycomb = new Honeycomb();
    this.controller = new WorldController();
  }

  loop() {
    this.controller.scroll();
    requestAnimFrame(() => this.loop(this));
  }


  drawEntities(data) {
    this.data = data;
    const hexagons = this.data.world?.hexagons;
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
      if (!world.bees[bee.id]) {
        world.bees[bee.id] = new Bee(1, bee.id);
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
    })

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    /** DEBUG: Draw Fight Masks **/
    ctx.beginPath();

    ctx.lineWidth = 4;
    ctx.strokeStyle = 'red';

    hexagon?.walls?.forEach(wall => {
      ctx.lineTo(wall.maskFight.x2 + xOffset, wall.maskFight.y2 + yOffset);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    /** DEBUG: Draw Fight Masks **/


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
