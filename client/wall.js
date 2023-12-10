class Wall {
  id;
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
  constructor(hexagon, size, type, x, y, row, col) {
    this.hexagon = row.toString() + col.toString();
    this.hexagon = (row+1).toString() + (col+1).toString();
    this.geometry(type, x, y, size, hexagon);
  }

  geometry(type, x, y, size, hexagon) {
    switch (type) {
      case 1: {
        this.boundary = {
          x1: x,
          y1: y + size * Math.sqrt(3),
          x2: x + 1.5 * size,
          y2: y + Math.sqrt(3) * size / 2
        }
        this.direction = { i: -1, j: 1 };
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
        this.direction = { i: 1, j: 1 };
        break;
      }
    }
  }
}
