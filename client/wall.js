class Wall {
  id;
  x;
  y;
  boundary;
  direction;
  collisions = [];
  hexagon;
  hexagonBorder;
  isOnFight;
  fight = {
    playerA: 0,
    playerB: 0,
  }

  constructor(type, x, y, row, col, size) {
    this.x = x;
    this.y = y;
    this.hexagon = row.toString() + col.toString();
    this.geometry(type, x, y, row, col, size);
  }

  geometry(type, x, y, row, col, size) {
    switch (type) {
      case 1: {
        this.boundary = {
          x1: x,
          y1: y + size * Math.sqrt(3),
          x2: x + 1.5 * size,
          y2: y + Math.sqrt(3) * size / 2
        }
        this.direction = { i: -1, j: 1 };
        if (row % 2 === 0) {
          this.hexagonBorder = (row).toString() + (col+1).toString();
        } else {
          this.hexagonBorder = (row+1).toString() + (col+1).toString();
        }

        if (row === rows.length -1 ) {
          this.hexagonBorder = null;
        }

        this.id = this.hexagon + 'L1';
        break;
      }

      case 2: {
        this.boundary = {
          x1: x + 1.5 * size,
          y1: y + Math.sqrt(3) * size / 2,
          x2: x + 1.5 * size,
          y2: y - Math.sqrt(3) * size / 2
        }
        this.direction = { i: -1, j: 0 };
        this.hexagonBorder = (row).toString() + (col+1).toString();
        if (row === 0 && col === cols.length -1) {
          this.hexagonBorder = null;
        }
        if (row === rows.length -1 && col === cols.length -1) {
          this.hexagonBorder = null;
        }
        this.id = this.hexagon + 'L2';
        break;
      }

      case 3: {
        this.boundary = {
          x1: x + 1.5 * size,
          y1: y - Math.sqrt(3) * size / 2,
          x2: x,
          y2: y - size * Math.sqrt(3)
        }
        this.direction = { i: -1, j: -1 };
        if (row % 2 === 0) {
          this.hexagonBorder = (row-1).toString() + (col).toString();
        } else {
          this.hexagonBorder = (row-1).toString() + (col+1).toString();
        }
        if (row === 0) {
          this.hexagonBorder = null;
        }
        if (row === 0 && col === cols.length -1) {
          this.hexagonBorder = null;
        }
        this.id = this.hexagon + 'L3';
        break;
      }

      case 4: {
        this.boundary = {
          x1: x,
          y1: y - size * Math.sqrt(3),
          x2: x - 1.5 * size,
          y2: y - Math.sqrt(3) * size / 2
        }
        this.id = this.hexagon + 'L4';
        if (row % 2 === 0) {
          this.hexagonBorder = (row-1).toString() + (col-1).toString();
        } else {
          this.hexagonBorder = (row-1).toString() + (col).toString();
        }
        if (row === 0) {
          this.hexagonBorder = null;
        }
        if (row === rows.length -1 && col === 0) {
          this.hexagonBorder = null;
        }
        this.direction = { i: 1, j: -1 };
        break;
      }

      case 5: {
        this.boundary = {
          x1: x - 1.5 * size,
          y1: y - Math.sqrt(3) * size / 2,
          x2: x - 1.5 * size,
          y2: y + Math.sqrt(3) * size / 2
        }
        this.id = this.hexagon + 'L5';
        this.hexagonBorder = (row).toString() + (col-1).toString();
        if (row === 0 && col === 0) {
          this.hexagonBorder = null;
        }
        if (row === rows.length -1 && col === 0) {
          this.hexagonBorder = null;
        }
        this.direction = { i: 1, j: 0 };
        break;
      }

      case 6: {
        this.boundary = {
          x1: x - 1.5 * size,
          y1: y + Math.sqrt(3) * size / 2,
          x2: x,
          y2: y + size * Math.sqrt(3)
        }
        this.id = this.hexagon + 'L6';
        if (row % 2 === 0) {
          this.hexagonBorder = (row+1).toString() + (col-1).toString();
        } else {
          this.hexagonBorder = (row+1).toString() + (col).toString();
        }
        if (row === rows.length -1 ) {
          this.hexagonBorder = null;
        }
        if (row === 0 && col === 0) {
          this.hexagonBorder = null;
        }
        this.direction = { i: 1, j: 1 };
        break;
      }
    }
  }

  draw(move = false) {
    if (move) {
      ctx.moveTo(this.boundary.x1, this.boundary.y1);
    }
    ctx.lineTo(this.boundary.x2, this.boundary.y2);
  }
}
