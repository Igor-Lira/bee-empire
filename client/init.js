const world = new World();

world.loop();

const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function(event) {
  console.log('Connected to the server');
  socket.send('Hello, server!');
};

socket.onmessage = (event) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const data = JSON.parse(event.data);
  world.drawEntities(data);
};

socket.onclose = function(event) {
  console.log('Connection closed');
};


