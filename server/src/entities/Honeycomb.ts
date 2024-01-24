import Hexagon from "@entities/Hexagon";
import * as config from '../config.json';
import {Vector} from "@lib/Math";
import Wall from "@entities/Wall";
import World from "@entities/World";

class Honeycomb {

  hexagons: {[id: string]: Hexagon} = {};

  constructor(world: World) {
    const rows = config.world.rows;
    const cols = config.world.cols;
    const hexSize = config.world.hexSize;
    const hexHeight = hexSize * Math.sqrt(3);
    const hexWidth = hexSize * 1.5;
    let xOffset = 0;
    let yOffset = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let x;
        if (row % 2 === 0) {
          x = xOffset + col * 2*hexWidth;
        } else {
          x = xOffset + hexWidth + col *2*hexWidth;
        }
        const y = yOffset + row * 1.5*hexHeight;

        const pos = new Vector(x, y);
        const hexagon = new Hexagon(pos, row, col, hexSize, world);
        this.hexagons[hexagon.id] = hexagon;
      }
    }
  }

  setup() {
    this.forEachWall(wall => {
      wall.setEnemyHexagon();
      wall.setEnemyWall();
    })
  }

  forEachWall(cb: (wall: Wall) => void) {
    for (let hexId in this.hexagons) {
      for (let wallId in this.hexagons[hexId].walls) {
        cb(this.hexagons[hexId].walls[wallId]);
      }
    }
  }

  forEachHexagon(cb: (hexagon: Hexagon) => void) {
    for (let hexId in this.hexagons) {
      cb(this.hexagons[hexId]);
    }
  }
}

export default Honeycomb;
