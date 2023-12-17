class Wall {
  id;
  x;
  y;
  owner;
  boundary;
  direction;
  collisions = [];
  hexagon;
  hexagonBorder;
  isExternalBorder;
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
    this.isExternalBorder = this.hexagonBorder === null;
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
          this.hexagonBorder = (row+1).toString() + (col).toString();
        } else {
          this.hexagonBorder = (row+1).toString() + (col+1).toString();
        }

        if (row === rows - 1) {
          this.hexagonBorder = null;
        }

        if (col === cols - 1 && row % 2 === 1) {
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
        if (row === 0 && col === cols -1) {
          this.hexagonBorder = null;
        }
        if (row === rows -1 && col === cols -1) {
          this.hexagonBorder = null;
        }

        if (col === cols -1) {
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
        if (row === 0 && col === cols -1) {
          this.hexagonBorder = null;
        }

        if (col === cols - 1 && row % 2 === 1) {
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
        if (row % 2 === 0 && col === 0) {
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
        if (row === rows -1 && col === 0) {
          this.hexagonBorder = null;
        }
        if (col === 0) {
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
        if (row === rows -1 ) {
          this.hexagonBorder = null;
        }
        if (row === 0 && col === 0) {
          this.hexagonBorder = null;
        }
        if (col === 0 && row % 2 === 0) {
          this.hexagonBorder = null;
        }
        this.direction = { i: 1, j: 1 };
        break;
      }
    }
  }

  draw(move = false) {
    if (move) {
      ctx.moveTo(this.boundary.x1 + xOffset, this.boundary.y1 + yOffset);
    }
    ctx.lineTo(this.boundary.x2 + xOffset, this.boundary.y2 + yOffset);
  }

  checkBeesCollisions() {
    const WALL_OFFSET = 20;
    for (let beeId in world.bees) {
      let bee = world.bees[beeId];
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

  // TODO: This method should be in world Controller
  computeFightResult() {
    if (this.isExternalBorder) { return; }
    if (this.collisions.length > 0) {
      let numberOfBeesPlayerA = 0;
      let numbersOfBeesPlayerB = 0;
      for (let collision of this.collisions) {
        if (collision === this.owner) {
          numberOfBeesPlayerA++;
        } else {
          numberOfBeesPlayerA++;
        }
      }

      // if ((numberPlayerA > 0 && !hexagons[wall.hexagonBorder]?.mine) || numberPlayerB > 0) {

      if (numberOfBeesPlayerA > 0 || numbersOfBeesPlayerB > 0) {
        this.isOnFight = true;
      } else {
        this.isOnFight = false;
        this.fight.playerA = 0;
        this.fight.playerB = 0;
      }

      if (numberOfBeesPlayerA > numbersOfBeesPlayerB) {
        if (this.fight.playerA < 100) {
          this.fight.playerA++;
        }
        if (this.fight.playerB > 0) {
          this.fight.playerB--;
        }
      } else {
        if (this.fight.playerA > 0) {
          this.fight.playerA--;
        }
        if (this.fight.playerB < 100) {
          this.fight.playerB++;
        }
      }
      if (this.fight.playerA > 99) {
        if (this.owner && this.hexagonBorder && world.honeycomb.hexagons[this.hexagonBorder]) {
          world.honeycomb.hexagons[this.hexagonBorder]?.conquer(this.owner);
        }
      }
    } else {
      this.isOnFight = false;
    }
  }

  conquer(playerId) {
    this.owner = playerId;
  }
}
