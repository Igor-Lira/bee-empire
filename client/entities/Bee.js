class Bee {
  id;
  player;
  x;
  y;
  width;
  height;
  selected;
  moving;
  trajectory = { interval: null, xOffset: null, yOffset: null, xTarget: null, yTarget: null, fixedX: null, fixedY: null };
  beeCollisions;

  constructor(player, id) {
    const hexId = world.players[player].getRandomConqueredHexagon();
    this.x = world.honeycomb.hexagons[hexId].x;
    this.y = world.honeycomb.hexagons[hexId].y;
    this.width = 30;
    this.height = 30;
    this.id = id;
    this.player = player;
    this.selected = false;
    this.moving = false;
    this.beeCollisions = [];
  }

  isInsideSelectionBox(selectionBox) {
    const isInside = isPointInsideSelectionBox(
      this.x,
      this.y,
      selectionBox.offsetLeft,
      selectionBox.offsetTop,
      Math.abs(selectionBox.width),
      Math.abs(selectionBox.height)
    );
    if (isInside) {
      this.selected = true;
    }
  }

  onRightClick(event) {
    if (this.selected) {
      this.isMoving = true;

      if (this.trajectory?.interval) {
        clearInterval(this.trajectory.interval);
      }

      this.trajectory.xOffest = xOffset;
      this.trajectory.yOffset = yOffset;
      this.trajectory.xTarget = event.pageX;
      this.trajectory.yTarget = event.pageY;
      this.trajectory.fixedX = event.pageX - xOffset;
      this.trajectory.fixedY = event.pageY - yOffset;

      const walls = this.checkForWallCollision();
      let pathCrossWall = false;
      if (walls?.length) {
        walls.forEach((wall) => {
          if (this.pathCrossWall(wall)) {
            pathCrossWall = true;
          }
        })
      }
      if (walls.length === 0 || (walls.length && !pathCrossWall)) {
        this.move();
      }
    }
  }

  move() {
    if (!this.isMoving) return;
    const targetX = this.trajectory.xTarget - this.x - this.trajectory.xOffest;
    const targetY = this.trajectory.yTarget - this.y - this.trajectory.yOffset;
    const deg = Math.atan2(targetY, targetX);
    const dist = Math.hypot(targetX, targetY);
    let deltaX = 0.8 * Math.cos(deg);
    let deltaY = 0.8 * Math.sin(deg);

    let walls = this.checkForWallCollision();
    let pathCrossWall = false;
    if (walls?.length) {
      walls.forEach((wall) => {
        if (this.pathCrossWall(wall)) {
          pathCrossWall = true;
        }
      })
    }
    if (walls.length === 0 || (walls.length && !pathCrossWall)) {
      this.dodgeOtherBees();
      if (!isNaN(deltaX)) {
        this.x += deltaX;
      }
      if (!isNaN(deltaY)) {
        this.y += deltaY;
      }
      if (dist > 1) {
        this.trajectory.interval = setTimeout(() => {
          this.move();
        }, 1);
      } else {
        clearTimeout(this.trajectory.interval);
      }
    }
  }

  draw() {
    const _strokeStyle = ctx.strokeStyle;
    const _fillStyle = ctx.strokeStyle;
    const _lineWidth = ctx.lineWidth;

    if (this.selected) {
      ctx.fillStyle = "red";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
    } else {
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;
    }


    if (this.trajectory?.xTarget && this.trajectory?.yTarget) {
      ctx.beginPath();
      ctx.setLineDash([5, 15]);
      ctx.moveTo(this.x + xOffset, this.y + yOffset);
      ctx.lineTo(this.trajectory.fixedX + xOffset, this.trajectory.fixedY + yOffset);
      ctx.strokeStyle = 'black';
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      /** display fixed **/
      ctx.fillRect(this.trajectory.fixedX + xOffset, this.trajectory.fixedY + yOffset, 10, 10);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }

    ctx.strokeStyle = _strokeStyle;
    ctx.fillStyle = _fillStyle;
    ctx.lineWidth = _lineWidth;

    const img = new Image();
    if (this.selected) {
      img.src = 'assets/bee-selected.png';
    } else {
      img.src = "assets/bee.png";
    }

    const imgWidth = 25;
    ctx.drawImage(img, this.x - imgWidth/2 + xOffset, this.y- imgWidth/2 + yOffset);
  }

  dodgeOtherBees() {
    for (let beeId in world.bees) {
      if (Number(beeId) !== this.id) {
        let bee = world.bees[beeId];
        const intersect = getIntersection(this, bee);
        if (intersect) {
          if (!this.beeCollisions.includes(beeId)) {
            this.beeCollisions.push(beeId);
          }
          if (intersect.pushX < intersect.pushY) {
            if (intersect.dirX < 0) {
              this.x -= bee.width * 0.2;
            } else if (intersect.dirX > 0) {
              this.x += bee.width * 0.2;
            }
          } else {
            if (intersect.dirY < 0) {
              this.y -= bee.height * 0.2;
            } else if (intersect.dirY > 0) {
              this.y += bee.height * 0.2;
            }
          }
        } else {
          const beeIndex = this.beeCollisions.findIndex((c) => c === beeId);
          if (beeIndex > -1) {
            this.beeCollisions.splice(beeIndex, 1);
          }
        }
      }
    }
  }

  pathCrossWall(wall) {
    const result =  intersectPointFor2Lines(
      wall.boundary.x1 + xOffset,
      wall.boundary.y1 + yOffset,
      wall.boundary.x2 + xOffset,
      wall.boundary.y2 + yOffset,
      this.trajectory.fixedX + xOffset,
      this.trajectory.fixedY + yOffset,
      this.x + xOffset,
      this.y + yOffset,
    )
    return result;
  }
  checkForWallCollision() {
    let wallCollision = [];
    const WALL_OFFSET = 10;
    world.honeycomb.forEachWall((wall) => {
      const intersectsUpperOffset = lineIntersectsRect(
        {x: wall.boundary.x1 + WALL_OFFSET*wall.direction.i, y: wall.boundary.y1 + WALL_OFFSET*wall.direction.j},
        {x: wall.boundary.x2 + WALL_OFFSET*wall.direction.i, y: wall.boundary.y2 + WALL_OFFSET*wall.direction.j},
        this
      );
      const intersectsLowerOffset =         lineIntersectsRect(
        {x: wall.boundary.x1 - WALL_OFFSET*wall.direction.i, y: wall.boundary.y1 - WALL_OFFSET*wall.direction.j},
        {x: wall.boundary.x2 - WALL_OFFSET*wall.direction.i, y: wall.boundary.y2 - WALL_OFFSET*wall.direction.j},
        this);

      if (
        ((intersectsUpperOffset || intersectsLowerOffset) && wall.owner !== myId) ||
        ((intersectsUpperOffset || intersectsLowerOffset) && wall.isExternalBorder)
      ) {
        wallCollision.push(wall);
      }
    });
    return wallCollision;
  }
}
