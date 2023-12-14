class Hexagon {
  id;
  x;
  y;
  size;
  walls = {};
  owner;

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
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#000';
    for (let id in this.walls) {
      this.walls[id].draw();
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = _fillStyle;
    ctx.lineWidth = _lineWidth;
    ctx.strokeStyle = _strokeStyle;
  }

  drawCenter() {
    const _strokeStyle = ctx.strokeStyle;
    const _fillStyle = ctx.fillStyle;
    const _lineWidth = ctx.lineWidth;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.size, this.size,  Math.PI / 180, 0, 2 * Math.PI);
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#E6CC47';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.strokeStyle = _strokeStyle;
    ctx.fillStyle = _fillStyle;
    ctx.lineWidth = _lineWidth;
  }
}
