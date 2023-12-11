class World {
  x;
  y;
  width;
  height;
  honeycomb = null;
  bees = [];

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

  addBee(bee) {
    const _bee = new Bee(id);
    this.bees[_bee.id] = _bee;
    id++;
  }

  drawEntities() {
    this.honeycomb.draw();
    this.honeycomb.drawFights();
    this.honeycomb.drawMyWalls();
    for (let beeId in this.bees) {
      this.bees[beeId].draw();
    }
  }
}
