class Player {
  id: string;
  bees: any;
  hexagons: any;

  constructor(id: string) {
    this.id = id;
    this.bees = {};
    this.hexagons = {};
  }
}

export default Player;
