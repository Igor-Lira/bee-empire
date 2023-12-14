class World {
  x;
  y;
  width;
  height;
  honeycomb = null;
  bees = [];
  players = {};

  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.honeycomb = new Honeycomb();
  }

  loop() {
    ctx.clearRect(this.x, this.y, this.width, this.height);
    this.drawEntities();
    requestAnimFrame(() => this.loop(this));
  }

  checkFightLoop() {
    setInterval(() => this.checkFights(this), 10);
  }

  checkFights() {
    this.honeycomb.forEachWall((wall) => {
      wall.checkBeesCollisions();
      wall.computeFightResult();
    });
  }

  addPlayer() {
    const player = new Player(id);
    this.players[player.id] = player;
    const hexagon = this.randomHexagon();
    player.hexagons[hexagon.id] = hexagon.id;
    hexagon.conquer(player.id)
    return player.id;
  }

  addBee(player, id) {
    const bee = new Bee(player, id);
    this.bees[bee.id] = bee;
    this.players[player].bees[bee.id] = bee;
    return bee.id;
  }

  drawEntities() {
    this.honeycomb.draw();
    this.honeycomb.drawFights();
    this.honeycomb.drawMyWalls();
    for (let beeId in this.bees) {
      this.bees[beeId].draw();
    }
  }

  randomHexagon (){
    const hexagons = this.honeycomb.hexagons;
    let keys = Object.keys(hexagons);
    return hexagons[keys[ keys.length * Math.random() << 0]];
  };
}
