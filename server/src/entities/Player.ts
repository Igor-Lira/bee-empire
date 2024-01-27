import Hexagon from "@entities/Hexagon";

class Player {
  id: string;
  bees: any;
  hexagons: any;
  initialHexagon: Hexagon | null = null;
  color: string;

  constructor(id: string, color: string) {
    this.id = id;
    this.bees = {};
    this.hexagons = {};
    this.color = color;
  }
}

export default Player;
