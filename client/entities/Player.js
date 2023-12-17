class Player {
  id;
  bees;
  hexagons;
  constructor(id) {
    this.id = id;
    this.bees = {};
    this.hexagons = {};
  }

  getRandomConqueredHexagon() {
    const hexagons = this.hexagons;
    let keys = Object.keys(hexagons);
    return hexagons[keys[ keys.length * Math.random() << 0]];
  }
}
