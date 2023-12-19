class World {
  x;
  y;
  width;
  height;
  honeycomb = null;
  bees = [];
  players = {};
  controller;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = cols * 2 * hexWidth;
    this.height = rows * 1.5 * hexHeight;
    MAX_OFFSET_X_INF = -this.width + window.innerWidth - 200;
    MAX_OFFSET_Y_INF = -this.height + window.innerHeight - 200;
    this.honeycomb = new Honeycomb();
    this.controller = new WorldController();
  }

  loop() {
    this.controller.scroll();
    this.drawEntities();
    requestAnimFrame(() => this.loop(this));
  }

  checkFightLoop() {
    setInterval(() => this.checkFights(this), 50);
  }

  checkFights() {
    this.honeycomb.forEachWall((wall) => {
      wall.checkBeesCollisions();
      wall.computeFightResult();
    });
  }

  addPlayer(playerId) {
    const player = new Player(playerId);
    this.players[player.id] = player;
    const hexagon = this.randomHexagon();
    player.hexagons[hexagon.id] = hexagon.id;
    hexagon.conquer(player.id);
    xOffset = -hexagon.x + window.innerWidth/2;
    yOffset = -hexagon.y + window.innerHeight/2;
    return player.id;
  }

  addBee(player, id) {
    const bee = new Bee(player, id);
    this.bees[bee.id] = bee;
    this.players[player].bees[bee.id] = bee;
    return bee.id;
  }

  drawEntities() {
    ctx.clearRect(this.x, this.y, this.width, this.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
