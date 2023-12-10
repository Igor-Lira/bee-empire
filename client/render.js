function addBee (bee) {
  const _bee = new Bee(id);
  map.bees[_bee.id] = _bee;
  id++;
  objects.push(bee);
}

function checkFights() {
  map.honeycomb.forEachWall((wall) => {
    wall.checkBeesCollisions();
    wall.computeFightResult()
  });
}

function drawObjects() {
  for (let beeId in map.bees) {
    map.bees[beeId].draw();
  }
};

function loop() {
  ctx.clearRect(map.x,map.y, map.width, map.height);
  map.honeycomb.draw();
  map.honeycomb.drawFights();
  map.honeycomb.drawMyWalls();
  drawObjects();
  requestAnimFrame(loop);
};

function checkFightLoop() {
  setInterval(checkFights, 10);
}
map.honeycomb = new Honeycomb();

loop();
checkFightLoop();


addBee();
addBee();
