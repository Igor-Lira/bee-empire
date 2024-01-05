const world = new World();
const player = world.addPlayer(myId);
world.addBee(player, 1);
world.addBee(player, 2);
world.addBee(player, 3);
world.addBee(player, 4);
world.addBee(player, 5);
world.addBee(player, 6);
world.loop();
world.checkFightLoop();

const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function(event) {
  console.log('Connected to the server');
  // Send a message to the server once the connection is established
  socket.send('Hello, server!');
};

socket.onmessage = function(event) {
  console.log('Received message:', event.data);
};

socket.onclose = function(event) {
  console.log('Connection closed');
};
