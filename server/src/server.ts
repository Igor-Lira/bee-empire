import 'module-alias/register';
import WebSocket, {WebSocketServer} from 'ws';
import World from '@entities/World';
import {getUniqueID} from "@lib/Math";

const world = new World();
world.controller.loop();

const wss = new WebSocketServer({port: 8080});

wss.on('connection', ws => {
  ws.send(world.serialize.serializeWorldProps());

  const clientId = getUniqueID();
  const player = world.controller.onPlayerConnected(clientId);

  ws.on('error', console.error);

  ws.on('message', (data) => {
    try {
      const parse = JSON.parse(data.toString());

      console.log(parse);
      if (parse.event === 'bee-move') {
        world.controller.moveBee(player, parse.bee, parse.target.x, parse.target.y);
      }

    } catch (e) {
      console.log(e);
    }
  });

  // ws.on('bee-move', data => {
  //   if (data && data?.toString()) {
  //     console.log(JSON.parse(data.toString()));
  //   }
  // })

  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(world.serialize.serialize(clientId));
    }
  }, 10);

  ws.on('close', function close() {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});
