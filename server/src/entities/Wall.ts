import {Line, unitaryOrthogonalVector, Vector} from '@lib/Math';
import Player from '@entities/Player';
import {WallType} from '@typing/wall';
import Hexagon from "@entities/Hexagon";
import World from "@entities/World";
import * as config from '../config.json';
import FightController from "@entities/FightController";


class Wall {
  pos: Vector;
  type: WallType;
  eHexId: string | null = null;
  size: number;
  row: number;
  col: number;
  owner: Player | null;
  hexagon: Hexagon;
  enemyHexagon: Hexagon | null = null;
  enemyWall: Wall | null = null;
  isExternalBorder: boolean = false;
  boundary: Line;
  maskForFights: Line;
  direction: Vector;
  collisions: string[] = [];
  collisionsWithMask: string[] = [];
  isOnFight: boolean = false;
  world: World;
  fight: FightController;
  INNER_OFFSET_SCALE = 0.85;

  constructor(
    hexagon: Hexagon,
    type: WallType,
    pos: Vector,
    row: number,
    col: number,
    size: number,
    world: World,
  ) {
    this.pos = pos;
    this.size = size;
    this.type = type;
    this.owner = null;
    this.row = row;
    this.col = col;
    this.hexagon = hexagon;
    this.world = world;
    this.boundary = this.setBoundary();
    this.maskForFights = this.setBoundary(this.INNER_OFFSET_SCALE*this.size);
    const {x, y} = unitaryOrthogonalVector(this.boundary);
    this.direction = new Vector(x,y);
    this.fight = new FightController(this);
  }


  setBoundary(size = this.size): Line {
    switch (this.type) {
      case WallType.L1: {
        return new Line(
          this.pos.x,
          this.pos.y + size * Math.sqrt(3),
          this.pos.x + 1.5 * size,
          this.pos.y + (Math.sqrt(3) * size) / 2
        );
        break;
      }

      case WallType.L2: {
        return new Line(
          this.pos.x + 1.5 * size,
          this.pos.y + (Math.sqrt(3) * size) / 2,
          this.pos.x + 1.5 * size,
          this.pos.y - (Math.sqrt(3) * size) / 2
        );
        break;
      }

      case WallType.L3: {
        return new Line(
          this.pos.x + 1.5 * size,
          this.pos.y - Math.sqrt(3) * size / 2,
          this.pos.x,
          this.pos.y - size * Math.sqrt(3)
        );
        break;
      }

      case WallType.L4: {
        return new Line(
          this.pos.x,
          this.pos.y - size * Math.sqrt(3),
          this.pos.x - 1.5 * size,
          this.pos.y - Math.sqrt(3) * size / 2
        );
        break;
      }

      case WallType.L5: {
        return new Line(
          this.pos.x - 1.5 * size,
          this.pos.y - Math.sqrt(3) * size / 2,
          this.pos.x - 1.5 * size,
          this.pos.y + Math.sqrt(3) * size / 2
        );
        break;
      }

      case WallType.L6: {
        return new Line(
          this.pos.x - 1.5 * size,
          this.pos.y + Math.sqrt(3) * size / 2,
          this.pos.x,
          this.pos.y + size * Math.sqrt(3)
        );
        break;
      }
    }
  }

  setEnemyHexagon() {
    const cols = config.world.cols;
    const rows = config.world.rows;

    let hexId: string | null = null;
    switch (this.type) {
      case WallType.L1: {
        if (this.row % 2 === 0) {
          hexId = (this.row+1).toString() + (this.col).toString();
        } else {
          hexId = (this.row+1).toString() + (this.col+1).toString();
        }
        break;
      }
      case WallType.L2: {
        hexId = (this.row).toString() + (this.col+1).toString();
        if (this.row === 0 && this.col === cols -1) {
          hexId = null;
        }
        if (this.row === rows -1 && this.col === cols -1) {
          hexId = null;
        }
        if (this.col === cols -1) {
          hexId = null;
        }
        break;
      }

      case WallType.L3: {
        if (this.row % 2 === 0) {
          hexId = (this.row-1).toString() + (this.col).toString();
        } else {
          hexId = (this.row-1).toString() + (this.col+1).toString();
        }
        if (this.row === 0) {
          hexId = null;
        }
        if (this.row === 0 && this.col === cols -1) {
          hexId = null;
        }

        if (this.col === cols - 1 && this.row % 2 === 1) {
          hexId = null;
        }
        break;
      }

      case WallType.L4: {
        if (this.row % 2 === 0) {
          hexId = (this.row-1).toString() + (this.col-1).toString();
        } else {
          hexId = (this.row-1).toString() + (this.col).toString();
        }
        if (this.row === 0) {
          hexId = null;
        }
        if (this.row % 2 === 0 && this.col === 0) {
          hexId = null;
        }
        break;
      }

      case WallType.L5: {
        hexId = (this.row).toString() + (this.col-1).toString();
        if (this.row === 0 && this.col === 0) {
          hexId = null;
        }
        if (this.row === rows -1 && this.col === 0) {
          hexId = null;
        }
        if (this.col === 0) {
          hexId = null;
        }
        break;
      }

      case WallType.L6: {
        if (this.row % 2 === 0) {
          hexId = (this.row+1).toString() + (this.col-1).toString();
        } else {
          hexId = (this.row+1).toString() + (this.col).toString();
        }
        if (this.row === rows -1 ) {
          hexId = null;
        }
        if (this.row === 0 && this.col === 0) {
          hexId = null;
        }
        if (this.col === 0 && this.row % 2 === 0) {
          hexId = null;
        }

        break;
      }
    }
    if (hexId) {
      this.enemyHexagon = this.world.honeycomb.hexagons[hexId];
      this.isExternalBorder = false;
    } else {
      this.enemyHexagon = null;
      this.isExternalBorder = true;
    }
    this.eHexId = hexId;
  }
  conquer(player: Player) {
    this.owner = player;
  }


  setEnemyWall() {
    let enemyWallType = null;
    switch (this.type) {
      case WallType.L1: {
        enemyWallType =  WallType.L4;
        break;
      }
      case WallType.L2: {
        enemyWallType =  WallType.L5;
        break;
      }
      case WallType.L3: {
        enemyWallType =  WallType.L6;
        break;
      }
      case WallType.L4: {
        enemyWallType =  WallType.L1;
        break;
      }
      case WallType.L5: {
        enemyWallType =  WallType.L2;
        break;
      }
      case WallType.L6: {
        enemyWallType =  WallType.L3;
        break;
      }
    }
    if (this.enemyHexagon) {
      this.enemyWall = this.enemyHexagon.walls[enemyWallType];
    } else {
      this.enemyWall = null;
    }
  }
}

export default Wall;
