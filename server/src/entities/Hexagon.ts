import {Vector} from "@lib/Math";
import Player from "@entities/Player";
import Wall from "@entities/Wall";
import {WallType} from "@typing/wall";
import World from "@entities/World";

class Hexagon {
  id: string;
  pos: Vector;
  size: number;
  owner: Player | null = null;
  world: World;
  walls: {[id: string]: Wall} = {}

  constructor(pos: Vector, row: number, col: number, size: number, world: World) {
    this.id = row.toString() + col.toString();
    this.size = size;
    this.pos = pos;
    this.world = world;
    for (let i = 1; i < 7; i++) {
      let wallType: WallType =  WallType.L1;
      switch (i) {
        case 1: wallType = WallType.L1; break;
        case 2: wallType = WallType.L2; break;
        case 3: wallType = WallType.L3; break;
        case 4: wallType = WallType.L4; break;
        case 5: wallType = WallType.L5; break;
        case 6: wallType = WallType.L6; break;
      }
      const wall = new Wall(this, wallType, pos, row, col, size, world);
      this.walls[wallType] = wall;
    }
  }

  conquer(player: Player){
    console.log('[HEXAGON CONQUERED]', player.id);
    this.owner = player;
    this.world.controller.conquerBeesInHexagon(this, player);
    for (const wallId in this.walls) {
      this.walls[wallId].conquer(player);
    }
  }

  forWalls(cb: (wall: Wall) => void) {
    for (const wallId in this.walls) {
      cb(this.walls[wallId]);
    }
  }

  getVertices() {
    const hexagonVertices: {x: number, y: number}[] = [];
    this.forWalls((wall) => {
      hexagonVertices.push({
        x: wall.boundary.x2,
        y: wall.boundary.y2
      })
    });
    return hexagonVertices;
  }
}

export default Hexagon;
