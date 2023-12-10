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

  checkBeesCollisions() {
    const WALL_OFFSET = 20;
    for (let beeId in map.bees) {
      let bee = map.bees[beeId];
      if (
        lineIntersectsRect(
          {x: this.boundary.x1 + WALL_OFFSET*this.direction.i, y: this.boundary.y1 + WALL_OFFSET*this.direction.j},
          {x: this.boundary.x2 + WALL_OFFSET*this.direction.i, y: this.boundary.y2 + WALL_OFFSET*this.direction.j},
          bee
        ) ||
        lineIntersectsRect(
          {x: this.boundary.x1 - WALL_OFFSET*this.direction.i, y: this.boundary.y1 - WALL_OFFSET*this.direction.j},
          {x: this.boundary.x2 - WALL_OFFSET*this.direction.i, y: this.boundary.y2 - WALL_OFFSET*this.direction.j},
          bee)
      ) {
        if (!this?.collisions?.includes(bee.id)){
          this.collisions.push(bee.id)
        }
      } else {
        let findBee = this?.collisions?.findIndex(c => c === bee.id);
        if (findBee > -1) {
          this.collisions.splice(findBee, 1);
        }
      }
    }
  }

  computeFightResult() {
    if (this.collisions.length > 0) {
      let numberPlayerA = 0;
      let numberPlayerB = 0;
      for (let collision of this.collisions) {
        if (collision === 0) {
          numberPlayerA++;
        }
        if (collision === 1) {
          numberPlayerB++;
        }
      }
      // if ((numberPlayerA > 0 && !hexagons[wall.hexagonBorder]?.mine) || numberPlayerB > 0) {

      if (numberPlayerA > 0 || numberPlayerB > 0) {
        this.isOnFight = true;
      } else {
        this.isOnFight = false;
        this.fight.playerA = 0;
        this.fight.playerB = 0;
      }

      if (numberPlayerA > numberPlayerB) {
        this.fight.playerA++;
        this.fight.playerB--;
      } else {
        this.fight.playerA--;
        this.fight.playerB++;
      }
      if (this.fight.playerA > 100) {
        if (this.hexagonBorder && map.honeycomb.hexagons[this.hexagonBorder]) {
          map.honeycomb.hexagons[this.hexagonBorder].isMine = true;
        }
      }
    } else {
      this.isOnFight = false;
    }
  }
}
