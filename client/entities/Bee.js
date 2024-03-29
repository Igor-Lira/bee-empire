class Bee {
  id;
  player;
  x;
  y;
  width;
  height;
  selected;
  isMoving;
  lockSideEffects;
  trajectory = { interval: null, xOffset: null, yOffset: null, xTarget: null, yTarget: null, fixedX: null, fixedY: null };
  beeCollisions;
  mine = false;

  constructor(player, id) {
    this.width = 30;
    this.height = 30;
    this.id = id;
    this.player = player;
    this.selected = false;
    this.isMoving = false;
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
      this.trajectory.xOffest = xOffset;
      this.trajectory.yOffset = yOffset;
      this.trajectory.xTarget = event.pageX;
      this.trajectory.yTarget = event.pageY;
      this.trajectory.fixedX = event.pageX - xOffset;
      this.trajectory.fixedY = event.pageY - yOffset;
      const rightClickData = {
        event: 'bee-move',
        bee: this.id,
        target: {
          x: event.pageX - xOffset,
          y: event.pageY - yOffset,
        }
      };
      socket.send(JSON.stringify(rightClickData));
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

    const walls = this.checkForWallCollision();
    const pathCrossWall = this.checkIfTrajectoryCrossWall(walls);

    if (walls.length === 0 || (walls.length && !pathCrossWall)) {
      /** If collision with wall exists, don't create side moves because bee can cross wall **/
      this.lockSideEffects = walls.length !== 0;
      this.dodgeOtherBees(dist);
      if (!isNaN(deltaX)) {
        this.x += deltaX;
      }
      if (!isNaN(deltaY)) {
        this.y += deltaY;
      }
      if (dist > 15 && this.isMoving) {
        this.trajectory.interval = setTimeout(() => {
          this.move();
        }, 1);
      } else {
        clearTimeout(this.trajectory.interval);
        this.isMoving = false;
      }
    }
  }

  draw() {
    const _strokeStyle = ctx.strokeStyle;
    const _fillStyle = ctx.strokeStyle;
    const _lineWidth = ctx.lineWidth;
    this.setColor();
    this.drawTrajectory();
    this.drawBeeSprint();
    ctx.strokeStyle = _strokeStyle;
    ctx.fillStyle = _fillStyle;
    ctx.lineWidth = _lineWidth;
  }

  setColor() {
    if (this.selected) {
      ctx.fillStyle = "red";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
    } else {
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;
    }
  }

  drawBeeSprint() {
    const img = new Image();

    if (this.mine) {
      if (this.selected) {
        img.src = 'assets/bee-selected.png';
      } else {
        img.src = "assets/bee.png";
      }
    } else {
      img.src = 'assets/enemy-bee.png'
    }


    const imgWidth = 25;
    ctx.drawImage(img, this.x - imgWidth / 2 + xOffset, this.y - imgWidth / 2 + yOffset);
  }

  drawTrajectory() {
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
  }

  dodgeOtherBees(dist) {
    for (let beeId in world.bees) {
      if (Number(beeId) !== this.id) {
        let bee = world.bees[beeId];
        const intersect = getIntersection(this, bee);
        if (intersect) {
          this.BeeToBeeCollisionOnMovement(beeId, bee, dist, intersect);
        } else {
          this.removeBeeFromCollisions(beeId);
        }
      }
    }
  }

  removeBeeFromCollisions(beeId) {
    const beeIndex = this.beeCollisions.findIndex((c) => c === beeId);
    if (beeIndex > -1) {
      this.beeCollisions.splice(beeIndex, 1);
    }
  }

  BeeToBeeCollisionOnMovement(beeId, bee, dist, intersect) {
    if (!this.beeCollisions.includes(beeId)) {
      this.beeCollisions.push(beeId);
    }
    const diffOnDestination = this.calculateDistFromBeesDestinations(bee);
    const bothHaveSameDestination = diffOnDestination < 5;
    if (this.checkIfNeedToPushBeeAwayFromCollision(bothHaveSameDestination, dist) && !this.lockSideEffects) {
      this.bounceBeeFromCollision(intersect, bee);
    }
    this.stopMovingIfAnotherBeeIsOnDestination(bee, bothHaveSameDestination);
  }

  calculateDistFromBeesDestinations(bee) {
    return Math.sqrt(
      (bee.trajectory.xTarget - this.trajectory.xTarget) ^ 2 +
      (bee.trajectory.yTarget - this.trajectory.yTarget) ^ 2
    );
  }

  checkIfNeedToPushBeeAwayFromCollision(bothHaveSameDestination, dist) {
    return !(bothHaveSameDestination && dist > 30);
  }

  stopMovingIfAnotherBeeIsOnDestination(bee, bothHaveSameDestination) {
    if ((!bee.isMoving || !this.isMoving) && bothHaveSameDestination) {
      this.isMoving = false;
      bee.isMoving = false;
    }
  }

  bounceBeeFromCollision(intersect, bee) {
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
  }
}
