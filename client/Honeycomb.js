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


  drawFights() {
    this.forEachWall((wall => {
      if (wall.isOnFight) {
        ctx.beginPath();
        ctx.moveTo(wall.boundary.x1, wall.boundary.y1);
        ctx.lineTo(wall.boundary.x2, wall.boundary.y2);
        const fightColorsStyle = ['red', 'violet'];
        ctx.strokeStyle = fightColorsStyle[fightColorsStyle.length * Math.random() | 0];
        ctx.stroke();
        ctx.closePath();
      }
    }));
  }

  drawMyWalls() {
    this.forEachWall((wall => {
      if (this.hexagons[wall.hexagon]?.isMine && this.hexagons[wall.hexagonBorder]?.isMine) {
        ctx.moveTo(wall.boundary.x1, wall.boundary.y1);
        ctx.lineTo(wall.boundary.x2, wall.boundary.y2);
        ctx.strokeStyle = '#f0e68c';
        ctx.stroke();
      }
    }))
  }

}
