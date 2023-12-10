class Hexagon {
  id;
  x;
  y;
  size;
  walls = [];
  isMine = false;

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

  drawWalls() {
    ctx.beginPath();
    ctx.fillStyle = '#F9F171';
    if (this.isMine) {
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
  }

  drawCenter() {
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.size, this.size,  Math.PI / 180, 0, 2 * Math.PI);
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#E6CC47';
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}
