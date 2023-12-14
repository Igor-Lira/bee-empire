const world = new World();
const player = world.addPlayer(1);
world.addBee(player, 1);
world.addBee(player, 2);
world.loop();
world.checkFightLoop();
