import World from "@entities/World";
import Player from "@entities/Player";
import Bee from "@entities/Bee";
import {
  computeBeeMove,
  getIntersection,
  getUniqueID,
  LineCrossLine,
  lineIntersectsRect,
  pointInsideHexagon,
  Vector
} from "@lib/Math";
import Wall from "@entities/Wall";
import Hexagon from "@entities/Hexagon";
import WorldPlayerController from "@entities/WorldPlayerController";
import config from "../config.json";


class WorldController {

  world: World;
  player: WorldPlayerController;
  MOVE_REFRESH_RATE = 10;
  usedColors: string[] = [];

  constructor(world: World) {
    this.world = world;
    this.player = new WorldPlayerController(world);
  }

  loop() {
    setInterval(() => this.checkFights(), 50);
    setInterval(() => this.updateBees(), 500);
  }

  updateBees(){
    for (const beeId in this.world.bees) {
      const bee = this.world.bees[beeId];
      this.world.honeycomb.forEachHexagon((hexagon) => {
        const vertices = hexagon.getVertices();
        const isInside = pointInsideHexagon(bee.pos.x, bee.pos.y, vertices);
        if (isInside && bee.hexagon.id !== hexagon.id) {
          bee.hexagon = hexagon;
        }
      });
    }
  }

  forAllBees(cb: (bee: Bee) => void) {
    for (const beeId in this.world.bees) {
      cb(this.world.bees[beeId]);
    }
  }

  conquerBeesInHexagon(hexagon: Hexagon, player: Player) {
    this.updateBees();
    this.forAllBees(bee => {
      if (bee.hexagon.id === hexagon.id) {
        bee.player = player;
      }
    })
  }

  checkFights() {
    this.world.honeycomb.forEachWall((wall) => {
      this.checkBeesCollisions(wall);
      this.computeFightResult(wall);
    });
  }

  checkBeesCollisions(wall: Wall) {
    const WALL_OFFSET = 10;
    for (let beeId in this.world.bees) {
      let bee = this.world.bees[beeId];
      const offset= new Vector(wall.direction.x, wall.direction.y).multiply(WALL_OFFSET);

      if (
        lineIntersectsRect(
          new Vector( wall.boundary.x1, wall.boundary.y1).add(offset),
          new Vector( wall.boundary.x2, wall.boundary.y2).add(offset),
          {x: bee.pos.x, y: bee.pos.y, height: bee.height, width: bee.width}
        ) ||
        lineIntersectsRect(
          new Vector( wall.boundary.x1, wall.boundary.y1).subtract(offset),
          new Vector( wall.boundary.x2, wall.boundary.y2).subtract(offset),
          {x: bee.pos.x, y: bee.pos.y, height: bee.height, width: bee.width}
      ))
      {
        if (!wall?.collisions?.includes(bee.id)){
          console.log('[COLLISION BEE-WALL]');
          wall.collisions.push(bee.id)
        }
        if (
          lineIntersectsRect(
            { x: wall.maskForFights.x1, y: wall.maskForFights.y1 },
            { x: wall.maskForFights.x2, y: wall.maskForFights.y2 },
            { x: bee.pos.x, y: bee.pos.y, height: bee.height, width: bee.width }
          )){
          if (!wall?.collisionsWithMask?.includes(bee.id)){
            console.log('[COLLISION BEE - MASK]');
            wall.collisionsWithMask.push(bee.id);
          }
        }

      } else {
        let findBee = wall?.collisions?.findIndex(c => c === bee.id);
        if (findBee > -1) {
          console.log('[REMOVE: COLLISION BEE - WALL]');
          wall.collisions.splice(findBee, 1);
        }

        findBee = wall?.collisionsWithMask?.findIndex(c => c === bee.id);
        if (findBee > -1) {
          console.log('[REMOVE: COLLISION BEE - MASK]');
          wall.collisionsWithMask.splice(findBee, 1);
        }
      }
    }
  }


  computeFightResult(wall: Wall) {
    wall.fight.compute();
  }


  onPlayerConnected(id: string) {
    const player = this.addPlayer(id);
    const hexagon = this.addHexagonToPlayer(player);
    this.addBeeToPlayer(player, hexagon);
    this.addBeeToPlayer(player, hexagon);
    this.addBeeToPlayer(player, hexagon);
    return player;
  }

  addPlayer(id: string) {
    const player = new Player(id, this.getColorForPlayer());
    this.world.players[id] = player;
    return player;
  }

  getColorForPlayer(): string {
    const colors = config.colors.players.base;
    let color = colors[0];
    if (this.usedColors.length && this.usedColors.length === colors.length) {
      color = colors[Math.floor(Math.random()*colors.length)];
    }
    colors.some(c => {
      if (!this.usedColors.includes(c)){
        color = c;
        this.usedColors.push(c);
        return true;
      }
    });
    return color;
  }

  addBeeToPlayer(player: Player, hexagon: Hexagon) {
    const id = getUniqueID();
    const pos = this.getRandomPositionForNewBee(hexagon);
    const bee = new Bee(id, player, pos, hexagon);
    this.world.bees[id] = bee;
  }

  addHexagonToPlayer(player: Player): Hexagon {
    const hexagon = this.getUnconqueredHexagon();
    hexagon.conquer(player);
    return hexagon;
  }

  getUnconqueredHexagon(): Hexagon {
    let result: Hexagon;
    this.world.honeycomb.forEachHexagon((hexagon) => {
      if (hexagon.owner === null) {
        result = hexagon;
      }
    })
    return result!;
  }

  getRandomPositionForNewBee(hexagon: Hexagon): Vector {
    let x, y;
    if (Math.random() > 0.5) {
      x = hexagon.pos.x + 50*Math.random();
    } else {
      x = hexagon.pos.x - 50*Math.random();
    }
    if (Math.random() > 0.5) {
      y = hexagon.pos.y + 50*Math.random();
    } else {
      y = hexagon.pos.y - 50*Math.random();
    }

    let allowed = true;
    for (let beeId in this.world.bees) {
      let bee = this.world.bees[beeId];
      const intersect = getIntersection(
        { x: x, y: y, width: bee.width, height: bee.height },
        { x: bee.pos.x, y: bee.pos.y, width: bee.width, height: bee.height}
      );
      if (intersect) {
        allowed = false;
      }
    }
    if (!allowed) {
      return this.getRandomPositionForNewBee(hexagon);
    }
    return new Vector(x, y);
  }

  moveBee(player: Player, beeId: string, xTarget: number, yTarget: number) {
    const bee = this.world.bees[beeId];
    if (this.world.bees[beeId].player.id === player.id) {
      bee.trajectory.target.x = xTarget;
      bee.trajectory.target.y = yTarget;
      const beeCollidesWithWalls = this.checkBeeToWallCollision(player, bee);
      const pathCrossWall = this.checkIfTrajectoryCrossWall(beeCollidesWithWalls, bee, xTarget, yTarget);
      if (beeCollidesWithWalls.length === 0 || (beeCollidesWithWalls.length && !pathCrossWall)) {
        const {distance, delta} = computeBeeMove(xTarget, bee, yTarget);
        this.dodgeOtherBees(player, bee, distance);
        const newPosition = bee.pos.add(delta);
        let validNewPosition = true;

        beeCollidesWithWalls.forEach(wall => {
          if (wall.enemyHexagon && wall.enemyHexagon.owner?.id !== player.id) {
            const vertices = wall.enemyHexagon?.getVertices();
            const isInside = pointInsideHexagon(bee.pos.x, bee.pos.y, vertices);
            if (isInside) {
              validNewPosition = false;
            }
          }
        })

        if (validNewPosition) {
          bee.setPosition(newPosition);
        }

        if (distance > 15) {
          clearInterval(bee.trajectory.interval);
          bee.isMoving = true;
          bee.trajectory.interval = setTimeout(() => this.moveBee(player, beeId, xTarget, yTarget), this.MOVE_REFRESH_RATE);
        } else {
          bee.isMoving = false;
        }
      }
    }
  }

  checkBeeToWallCollision(player: Player, bee: Bee): Wall[] {
    let wallCollision: Wall[] = [];
    const WALL_OFFSET = 10;
    this.world.honeycomb.forEachWall((wall) => {
      const offset= new Vector(wall.direction.x, wall.direction.y).multiply(WALL_OFFSET);
      const intersectsUpperOffset = lineIntersectsRect(
        new Vector( wall.boundary.x1, wall.boundary.y1).add(offset),
        new Vector( wall.boundary.x2, wall.boundary.y2).add(offset),
        {x: bee.pos.x, y: bee.pos.y, height: bee.height, width: bee.width}
      );
      const intersectsLowerOffset = lineIntersectsRect(
        new Vector(wall.boundary.x1, wall.boundary.y1).subtract(offset),
        new Vector(wall.boundary.x2, wall.boundary.y2).subtract(offset),
        {x: bee.pos.x, y: bee.pos.y, height: bee.height, width: bee.width}
      );
      if (
        ((intersectsUpperOffset || intersectsLowerOffset) && wall.owner?.id !== player.id) ||
        ((intersectsUpperOffset || intersectsLowerOffset) && wall.isExternalBorder)
      ) {
        wallCollision.push(wall);
      }
    });
    return wallCollision;
  }


  checkIfTrajectoryCrossWall(walls: Wall[], bee: Bee, targetX: number, targetY: number): Boolean {
    let pathCrossWall = false;
    if (walls?.length) {
      walls.forEach((wall) => {
        if (LineCrossLine(wall, bee, targetX, targetY)) {
          pathCrossWall = true;
        }
      })
    }
    return pathCrossWall;
  }


  dodgeOtherBees(player: Player, bee: Bee, distance: number) {
    for (let beeId in this.world.bees) {
      let otherBee = this.world.bees[beeId];
      if (otherBee.player.id === player.id && beeId !== bee.id) {
        const intersect = getIntersection(
          { x: bee.pos.x, y: bee.pos.y, width: bee.width, height: bee.height},
          { x: otherBee.pos.x, y: otherBee.pos.y, width: otherBee.width, height: otherBee.height}
        );
        if (intersect) {
          bee.addBeeToCollisions(otherBee);
          this.beeToBeeCollisionOnMovement(bee, otherBee, distance, intersect);
        } else {
          bee.removeBeeFromCollisions(otherBee);
        }
      }
    }
  }

  beeToBeeCollisionOnMovement(bee: Bee, otherBee: Bee, distance: number, intersect: any) {
    const diffOnDestination = bee.calculateDistFromBeesDestinations(otherBee);
    if (!isNaN(diffOnDestination)) {
      const bothHaveSameDestination = diffOnDestination < 5;
      if (this.checkIfNeedToPushBeeAwayFromCollision(bothHaveSameDestination, distance)) {
        this.bounceBeeFromCollision(intersect, bee);
      }
      this.stopMovingIfAnotherBeeIsOnDestination(bee, otherBee, bothHaveSameDestination);
    }
  }


  checkIfNeedToPushBeeAwayFromCollision(bothHaveSameDestination: boolean, dist: number) {
    return !(bothHaveSameDestination && dist > 30);
  }

  stopMovingIfAnotherBeeIsOnDestination(bee: Bee, otherBee: Bee, bothHaveSameDestination: boolean) {
    if ((!otherBee.isMoving || !bee.isMoving) && bothHaveSameDestination) {
      bee.isMoving = false;
      otherBee.isMoving = false;
    }
  }

  bounceBeeFromCollision(intersect: any, bee: Bee) {
    if (intersect.pushX < intersect.pushY) {
      if (intersect.dirX < 0) {
        bee.pos.x -= bee.width * 0.2;
      } else if (intersect.dirX > 0) {
        bee.pos.x += bee.width * 0.2;
      }
    } else {
      if (intersect.dirY < 0) {
        bee.pos.y -= bee.height * 0.2;
      } else if (intersect.dirY > 0) {
        bee.pos.y += bee.height * 0.2;
      }
    }
  }

}

export default WorldController;
