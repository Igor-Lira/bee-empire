class Bee {

  id;
  player;
  x;
  y;
  width;
  height;
  focused;
  selected;
  moving;
  trajectory;
  beeCollisions;

  constructor(id) {
    this.x = randMinMax(0, map.width-32);
    this.y = randMinMax(0, map.height-32);
    this.width = 30;
    this.height = 30;
    this.id = id;
    this.player = id;
    this.focused = false;
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
      Math.abs(selectionBox.height),
    );
    if (isInside) {
      this.selected = true;
      this.focused = true;
    }
  }

  onMouseUp() {
    if (this.focused) {
      this.focused = false;
    } else {
      this.selected = false;
    }
  }

  onRightClick(event) {
    if (this.selected) {
      this.focused = true;
      this.isMoving = true;

      if (this.trajectory) {
        clearInterval(this.trajectory);
      }

      this.move(event.pageX, event.pageY);
    }
  }

  move(mouseX, mouseY) {
    if (!this.isMoving) return;
    const targetX = mouseX - this.x;
    const targetY = mouseY - this.y;
    const deg = Math.atan2(targetY, targetX);
    const dist = Math.hypot(targetX, targetY);
    let deltaX = 0.8 * Math.cos(deg);
    let deltaY = 0.8 * Math.sin(deg);

    // this.stopMoveOnWalls();
    this.dodgeOtherBees();

      if (!isNaN(deltaX)) {
        this.x += deltaX;
      }
      if (!isNaN(deltaY)) {
        this.y += deltaY;
      }

    if (dist > 1) {
      this.trajectory = setTimeout(() => {
        this.move(mouseX, mouseY);
      }, 10)
    }
  }

  draw() {
    if (this.selected) {
      ctx.fillStyle = 'red';
    } else {
      ctx.fillStyle = 'blue';
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  dodgeOtherBees() {
    for (let beeId in map.bees) {
      if (Number(beeId) !== this.id) {
        let bee = map.bees[beeId];
        const intersect = getIntersection(this, bee);
        if (intersect) {
          if (!this.beeCollisions.includes(beeId)) {
            this.beeCollisions.push(beeId);
          }
          if(intersect.pushX < intersect.pushY) {
            if(intersect.dirX < 0) {
              this.x -= bee.width*0.2;
            } else if(intersect.dirX > 0) {
              this.x += bee.width*0.2;
            }
          } else {
            if(intersect.dirY < 0) {
              this.y -= bee.height*0.2;
            } else if(intersect.dirY > 0) {
              this.y +=  bee.height*0.2;
            }
          }
        } else {
          const beeIndex = this.beeCollisions.findIndex(c => c === beeId);
          if (beeIndex > -1) {
            this.beeCollisions.splice(beeIndex, 1);
          }
        }
      }
    }
  }

  stopMoveOnWalls(deltaX, deltaY) {
    let wallCollision = false;
    map.honeycomb.forEachWall(wall => {
      if (wall.collisions.includes(this.id)) {
        wallCollision = true;
      }
    });

    if (wallCollision) {
      deltaX = -10*deltaX;
      deltaY = -10*deltaY;
      this.isMoving = false;
    }
  }
}
