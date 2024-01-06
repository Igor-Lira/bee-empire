import {Vector} from '../lib/Math';
import Bee from '@entities/Bee';
import WorldSerialize from "@entities/WorldSerialize";
import Player from "@entities/Player";
import WorldController from "@entities/WorldController";
import Honeycomb from "@entities/Honeycomb";

class World {
  pos: Vector;
  width: number;
  height: number;
  players: {[id: string]: Player} = {}
  bees: {[id: string]: Bee} = {}
  honeycomb: Honeycomb;

  serialize: WorldSerialize;
  controller: WorldController;

  constructor() {
    this.pos = new Vector(0, 0);
    this.width = 100;
    this.height = 100;
    this.honeycomb = new Honeycomb(this);
    this.honeycomb.setup();
    this.serialize = new WorldSerialize(this);
    this.controller = new WorldController(this);
  }
}

export default World;
