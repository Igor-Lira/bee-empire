import Player from '@entities/Player';
import {Rectangle, Vector} from '@lib/Math';
import * as config from '../config.json';
import {Trajectory} from "@typing/bee";
import Hexagon from "@entities/Hexagon";
class Bee {
  id: string;
  player: Player;
  pos: Vector;
  mask: Rectangle;
  width: number;
  height: number;
  selected: boolean;
  isMoving: boolean;
  trajectory: Trajectory;
  beeCollisions: string[] = [];
  hexagon: Hexagon;

  constructor(id: string, player: Player, pos: Vector, hexagon: Hexagon) {
    this.id = id;
    this.player = player;
    this.pos = pos;
    this.width = config.bee.width;
    this.height = config.bee.height;
    this.mask = new Rectangle(this.pos, this.width, this.height);
    this.trajectory = {
      interval: 0,
      target: new Vector(0, 0)
    }
    this.isMoving = false;
    this.selected = false;
    this.hexagon = hexagon;
  }

  setPosition(pos: Vector) {
    // TODO: check if pos is inside world.
    // TODO: check if pos is inside a player hexagon
    if (!isNaN(pos.x) && !isNaN(pos.y)) {
      this.pos = pos;
    }
  }

  addBeeToCollisions(bee: Bee) {
    if (!this.beeCollisions.includes(bee.id)) { this.beeCollisions.push(bee.id); }
    // bee.addBeeToCollisions(this)
  }

  removeBeeFromCollisions(bee: Bee) {
    const beeIndex = this.beeCollisions.findIndex((c) => c === bee.id);
    if (beeIndex > -1) {
      this.beeCollisions.splice(beeIndex, 1);
    }
  }

  calculateDistFromBeesDestinations(bee: Bee) {
    return Math.sqrt(
      (bee.trajectory.target.x - this.trajectory.target.x) ^ 2 +
      (bee.trajectory.target.y - this.trajectory.target.y) ^ 2
    );
  }

}

export default Bee;
