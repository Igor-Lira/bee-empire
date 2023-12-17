class Player {
  id;
  bees;
  hexagons;
  constructor(id) {
    this.id = id;
    this.bees = {};
    this.hexagons = {};
  }

  randomConqueredHexagon() {
    const hexagons = this.hexagons;
    console.log(hexagons);
    let keys = Object.keys(hexagons);
    return hexagons[keys[ keys.length * Math.random() << 0]];
  }
}
