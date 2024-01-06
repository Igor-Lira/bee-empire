class Honeycomb {

  hexagons = [];

  constructor() {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let x;
        if (row % 2 === 0) {
          x = xOffset + col * 2*hexWidth;
        } else {
          x = xOffset + hexWidth + col *2*hexWidth;
        }
        const y = yOffset + row * 1.5*hexHeight;
        const hexagon = new Hexagon(x, y, row, col, hexSize);
        this.hexagons[hexagon.id] = hexagon;
      }
    }
  }

  draw() {
    for(let id in this.hexagons) {
      this.hexagons[id].draw();
    }
  }

  forEachWall(cb) {
    for (let hexId in this.hexagons) {
      for (let wallId in this.hexagons[hexId].walls) {
        cb(this.hexagons[hexId].walls[wallId]);
      }
    }
  }


  drawMyWalls() {
    this.forEachWall((wall => {
      if (
          this.hexagons[wall.hexagon]?.owner === myId &&
          this.hexagons[wall.hexagonBorder]?.owner === myId
      ) {
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
    }))
  }

}
