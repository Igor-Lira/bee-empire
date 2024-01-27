const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function(event) {
  console.log('Connected to the server');
  socket.send('Hello, server!');
};

socket.onmessage = (event) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const data = JSON.parse(event.data);
  switch(data.type) {
    case 'create-world': {
      console.log('create-world');
      if (!world) {
        world = new World(data);
      }
      break;
    }
    case 'world-conquered': {
      break;
    }
    case 'on-player-connected': {
      if (!isNaN(data.x) && !isNaN(data.y)) {
        console.log('player connected !!', data);
        xOffset -= data.x - window.innerWidth/2;
        yOffset -= data.y - window.innerHeight/2;
      }
      break;
    }
    case 'world-is-full': {
      console.log('WORLD IS FULL');
      break;
    }
    default: {
      world.drawEntities(data);
    }
  }
};

socket.onclose = function(event) {
  console.log('Connection closed');
};


