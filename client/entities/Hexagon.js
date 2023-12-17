class Hexagon {
  id;
  x;
  y;
  size;
  walls = {};
  owner = 2;

  constructor(x, y, row, col, hexSize) {
    this.id = row.toString() + col.toString();
    this.x = x;
    this.y = y;
    this.size = hexSize;
    for (let i = 1; i < 7; i++) {
      const wall = new Wall(i, x, y, row, col, hexSize);
      this.walls[wall.id] = wall;
    }
  }

  draw() {
    this.drawWalls();
    this.drawCenter();
  }

  conquer(playerId) {
    this.owner = playerId;
    for (let id in this.walls) {
      this.walls[id].conquer(playerId);
    }
  }


  drawWalls() {
    const _fillStyle = ctx.fillStyle;
    const _lineWidth = ctx.lineWidth;
    const _strokeStyle = ctx.strokeStyle;

    ctx.beginPath();
    ctx.fillStyle = '#F9F171';
    if (this.owner === myId) {
      ctx.fillStyle = '#e3ff00';
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#E6CC47';
    for (let id in this.walls) {
      this.walls[id].draw();
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    /** DEBUG: this will draw wall masks **/
    // ctx.beginPath();
    // ctx.lineWidth = 5;
    // ctx.strokeStyle = 'green';
    // // for (let id in this.walls) {
    // //   this.walls[id].createMaskForCollision();
    // // }
    // ctx.closePath();
    // ctx.stroke();

    ctx.fillStyle = _fillStyle;
    ctx.lineWidth = _lineWidth;
    ctx.strokeStyle = _strokeStyle;
  }

  drawCenter() {
    const _fillStyle = ctx.fillStyle;
    const _lineWidth = ctx.lineWidth;
    ctx.beginPath();
    ctx.ellipse(this.x + xOffset, this.y + yOffset, this.size, this.size,  Math.PI / 180, 0, 2 * Math.PI);
    const grd = ctx.createRadialGradient(this.x + xOffset, this.y +yOffset, 0, this.x + xOffset, this.y + yOffset,  this.size);
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
