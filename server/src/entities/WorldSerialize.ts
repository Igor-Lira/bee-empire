import World from "@entities/World";
import Wall from "@entities/Wall";
import config from "../config.json";
import Player from "@entities/Player";
import WebSocket from "ws";

class WorldSerialize {

  world: World;
  constructor(world: World) {
    this.world = world;
    this.loop();
  }

  loop() {
    if (this.world.destroyed) return;
    setTimeout(() => {
      this.world.wss.clients.forEach((ws: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(this.serialize(ws.clientId));
        }
      })
      this.loop();
    }, 10);
  }

  serialize(clientId: string): string {
    return JSON.stringify(this.formatForSerialize(clientId));
  }

  formatForSerialize(clientId: string): any {
    const obj = {
      players: this.formatPlayers(),
      bees: this.formatBees(clientId),
      honeycomb: this.formatHoneycomb(clientId)
    };
    return obj;
  }

  serializeWorldProps(): string {
    return JSON.stringify({
      type: 'create-world',
      x: this.world.pos.x,
      y: this.world.pos.y,
      cols: this.world.numberOfColumns,
      rows: this.world.numberOfRows,
      hexSize: this.world.hexagonSize,
    });
  }

  serializePlayerConnected(player: Player): string {
    return JSON.stringify({
      type: 'on-player-connected',
      x: player.initialHexagon?.pos.x,
      y: player.initialHexagon?.pos.y
    })
  }

  serializeWorldIsFull(): string {
    return JSON.stringify({
      type: 'world-is-full',
    })
  }

  formatBees(clientId: string): any {
    const bees: any[] = [];
    for (const beeId in this.world.bees) {
      const bee = this.world.bees[beeId];
      bees.push({
        id: beeId,
        x: this.world.bees[beeId].pos.x,
        y: this.world.bees[beeId].pos.y,
        mine: bee.player.id === clientId,
      })
    }
    return bees;
  }

  formatPlayers(): any {
    const players = [];
    for (const playerId in this.world.players) {
      const player = this.world.players[playerId];
      players.push({
        id: player.id
      });
    }
    return players;
  }

  formatHoneycomb(clientId: string): any {
    const honeycomb = { hexagons: [] } as any;
    for (const hexagonId in this.world.honeycomb.hexagons) {
      const hexagon = this.world.honeycomb.hexagons[hexagonId];
      honeycomb.hexagons.push({
        color: hexagon.owner?.color ?? "#E6CC47",
        mine: hexagon.owner?.id === clientId,
        x: hexagon.pos.x,
        y: hexagon.pos.y,
        size: hexagon.size,
        walls: this.formatWalls(clientId, hexagon.walls),
      })
    }
    return honeycomb;
  }

  formatWalls(clientId: string, walls: {[id: string]: Wall}): any {
    const _walls = [] as any;
    for (const wallId in walls) {
      const wall = walls[wallId];
      _walls.push({
        x: wall.pos.x,
        y: wall.pos.y,
        boundary: wall.boundary,
        isOnSafety: wall.hexagon.isOnSafety || wall.enemyWall?.hexagon.isOnSafety,
        maskFight: {x1: wall.maskForFights.x1, x2: wall.maskForFights.x2, y1: wall.maskForFights.y1, y2: wall.maskForFights.y2},
        color: this.getWallColor(clientId, wall),
        mine: wall.owner?.id === clientId && wall.enemyWall?.owner?.id === clientId,
        isOnFight: this.checkIfShouldDrawWallFightForClient(clientId, wall),
      });
    }
    return _walls;
  }

  getWallColor(clientId: string, wall: Wall): string {
    let color = config.colors.wall.base;
    if (wall.hexagon.isOnSafety || wall.enemyWall?.hexagon.isOnSafety) {
      color = config.colors.wall.safe;
    } else if (wall.isExternalBorder) {
      color = config.colors.wall.external;
    } else if (wall.owner?.id === wall.enemyWall?.owner?.id) {
      if (wall.owner?.color) {
        color = wall.owner?.color;
      }
    } else if (this.checkIfShouldDrawWallFightForClient(clientId, wall)) {
      const fightColors = config.colors.wall.fight;
      color = fightColors[fightColors.length * Math.random() | 0]
    }
    return color;
  }


  checkIfShouldDrawWallFightForClient(clientId: string, wall: Wall) {
    /** Don't draw others fights **/
    if (wall.owner?.id !== clientId && wall.enemyWall?.owner?.id !== clientId) {
      return false;
    }
    return this.checkIfWallOnFight(wall, clientId) || (wall.enemyWall && this.checkIfWallOnFight(wall.enemyWall, clientId));
  }

  checkIfWallOnFight(wall: Wall, clientId: string): boolean {
    return wall.isOnFight && (wall.owner?.id !== clientId || wall.enemyWall?.owner?.id !== clientId)
  }
}

export default WorldSerialize;
