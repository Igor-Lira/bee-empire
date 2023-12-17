class Bee {
  id;
  player;
  x;
  y;
  width;
  height;
  selected;
  moving;
  trajectory = { interval: null, xOffset: null, yOffset: null, xTarget: null, yTarget: null };
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

      this.move();
    }
  }

  move(mouseX, mouseY) {
    if (!this.isMoving) return;
    const targetX = this.trajectory.xTarget - this.x - this.trajectory.xOffest;
    const targetY = this.trajectory.yTarget - this.y - this.trajectory.yOffset;
    const deg = Math.atan2(targetY, targetX);
    const dist = Math.hypot(targetX, targetY);
    let deltaX = 0.8 * Math.cos(deg);
    let deltaY = 0.8 * Math.sin(deg);

    const wallCollision = this.checkForWallCollision();
    if (!(wallCollision && this.trajectoryCrossWall(wallCollision))) {
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
        }, 10);
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

    // ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.strokeRect(this.x + xOffset, this.y + yOffset, this.width, this.height);

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

  trajectoryCrossWall(wall) {
    return lineIntersectsLine(
        { x: wall.boundary.x1, y: wall.boundary.y1 },
        { x: wall.boundary.x2, y: wall.boundary.y2 },
        { x: this.trajectory.xTarget - xOffset, y: this.trajectory.yTarget - yOffset },
        { x: this.x, y: this.y }
    )
  }
  checkForWallCollision() {
    let wallCollision = false;
    world.honeycomb.forEachWall((wall) => {
      if (
          (wall.collisions.includes(this.id) && wall.owner !== myId) ||
          (wall.collisions.includes(this.id) && wall.isExternalBorder)
      ) {
        wallCollision = wall;
      }
    });
    return wallCollision;
  }
}
