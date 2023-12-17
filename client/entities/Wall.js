class Wall {
  id;
  x;
  y;
  size;
  type;
  mask;
  owner;
  boundary;
  direction;
  collisions = [];
  collisionsWithMask = [];
  hexagon;
  hexagonBorder;
  wallBorder;
  isExternalBorder;
  isOnFight = false;
  fight = {
    playerA: 0,
    playerB: 0,
  }

  constructor(type, x, y, row, col, size) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = size;
    this.owner = 2;
    this.hexagon = row.toString() + col.toString();
    this.geometry(x, y, row, col, size);
    this.createMaskForCollision();
    this.isExternalBorder = this.hexagonBorder === null;
  }

  geometry(x, y, row, col, size) {
    switch (this.type) {
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

        this.id = 'L1';
        this.wallBorder = 'L4';
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

        this.id = 'L2';
        this.wallBorder = 'L5';

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

        this.id = 'L3';
        this.wallBorder = 'L6';

        break;
      }

      case 4: {
        this.boundary = {
          x1: x,
          y1: y - size * Math.sqrt(3),
          x2: x - 1.5 * size,
          y2: y - Math.sqrt(3) * size / 2
        }
        this.id = 'L4';
        this.wallBorder = 'L1';

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
        this.id = 'L5';
        this.wallBorder = 'L2';

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
        this.id = 'L6';
        this.wallBorder = 'L3';

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

  getEnemyWall() {
    return world.honeycomb.hexagons[this.hexagonBorder]?.walls[this.wallBorder];
  }

  createMaskForCollision() {
    switch (this.type) {
      case 1: {
        this.mask = {
          x1: this.boundary.x1 + 50*Math.cos(Math.PI/6),
          y1: this.boundary.y1 - 50*Math.sin(Math.PI/6) - 10,
          x2: this.boundary.x2 - 25*Math.sin(Math.PI/3) - 15,
          y2: this.boundary.y2 + 25*Math.cos(Math.PI/3),
        }
        break;
      }
      case 2: {
        this.mask = {
          x1: this.boundary.x1 - 10,
          y1: this.boundary.y1 - 20,
          x2: this.boundary.x2 - 10,
          y2: this.boundary.y2 + 20,
        }
        break;
      }
      case 3: {
        this.mask = {
          x1: this.boundary.x1 - 25*Math.sin(Math.PI/3) - 20,
          y1: this.boundary.y1 - 25*Math.cos(Math.PI/3),
          x2: this.boundary.x2 + 50*Math.cos(Math.PI/6),
          y2: this.boundary.y2 + 50*Math.sin(Math.PI/6) + 10,
        }
        break;
      }

      case 4: {
        this.mask = {
          x1: this.boundary.x1 - 50*Math.sin(Math.PI/3) + 15,
          y1: this.boundary.y1 + 50*Math.cos(Math.PI/3),
          x2: this.boundary.x2 + 50*Math.cos(Math.PI/6),
          y2: this.boundary.y2 - 50*Math.sin(Math.PI/6) + 10,
        }
        break;
      }
      case 5: {
        this.mask = {
          x1: this.boundary.x1 + 10,
          y1: this.boundary.y1 + 20,
          x2: this.boundary.x2 + 10,
          y2: this.boundary.y2 - 20,
        }
        break;
      }
      case 6: {
        this.mask = {
          x1: this.boundary.x1 + 50*Math.cos(Math.PI/6),
          y1: this.boundary.y1 + 50*Math.sin(Math.PI/6) - 10,
          x2: this.boundary.x2 - 50*Math.sin(Math.PI/3) + 20,
          y2: this.boundary.y2 - 50*Math.cos(Math.PI/3),
        }
        break;
      }
    }
    ctx.moveTo(this.mask.x1 + xOffset, this.mask.y1 + yOffset);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'green';
    ctx.lineTo(this.mask.x2 + xOffset, this.mask.y2 + yOffset);
  }

  draw(move = false) {
    if (move) {
      ctx.moveTo(this.boundary.x1 + xOffset, this.boundary.y1 + yOffset);
    }
    ctx.lineTo(this.boundary.x2 + xOffset, this.boundary.y2 + yOffset);
  }

  checkBeesCollisions() {
    const WALL_OFFSET = 10;
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
      )
      {
        if (!this?.collisions?.includes(bee.id)){
          this.collisions.push(bee.id)
        }
        if (
            lineIntersectsRect(
                { x: this.mask.x1, y: this.mask.y1 },
                { x: this.mask.x2, y: this.mask.y2 },
                bee
            )){
          if (!this?.collisionsWithMask?.includes(bee.id)){
            this.collisionsWithMask.push(bee.id)
          }
        }

      } else {
        let findBee = this?.collisions?.findIndex(c => c === bee.id);
        if (findBee > -1) {
          this.collisions.splice(findBee, 1);
        }

        findBee = this?.collisionsWithMask?.findIndex(c => c === bee.id);
        if (findBee > -1) {
          this.collisionsWithMask.splice(findBee, 1);
        }
      }
    }
  }

  // TODO: This method should be in world Controller
  computeFightResult() {
    if (this.isExternalBorder) { return; }
    if (this.collisionsWithMask.length > 0) {
      let numberOfBeesPlayerA = 0;
      let numbersOfBeesPlayerB = 0;
      for (let collision of this.collisionsWithMask) {
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
