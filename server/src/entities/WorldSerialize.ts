import World from "@entities/World";
import Wall from "@entities/Wall";
import Bee from "@entities/Bee";

class WorldSerialize {

  world: World;
  constructor(world: World) {
    this.world = world;
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

  serializeWorldProps() {
    return JSON.stringify({
      type: 'create-world',
      x: this.world.pos.x,
      y: this.world.pos.y,
      cols: this.world.numberOfColumns,
      rows: this.world.numberOfRows,
      hexSize: this.world.hexagonSize,
    });
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
        mine: wall.owner?.id === clientId && wall.enemyWall?.owner?.id === clientId,
        isOnFight: this.checkIfWallOnFight(wall, clientId) || (wall.enemyWall && this.checkIfWallOnFight(wall.enemyWall, clientId)),
      });
    }
    return _walls;
  }

  checkIfWallOnFight(wall: Wall, clientId: string): boolean {
    return wall.isOnFight && (wall.owner?.id !== clientId || wall.enemyWall?.owner?.id !== clientId)
  }
}

export default WorldSerialize;
