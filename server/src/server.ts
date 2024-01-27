import 'module-alias/register';
import WebSocket, {WebSocketServer} from 'ws';
import World from '@entities/World';
import {getUniqueID} from "@lib/Math";

const connectedIps: string[] = [];

const world = new World();
world.controller.loop();

const wss = new WebSocketServer({port: 8080});

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  if (ip) {
    if (connectedIps.includes(ip)) {
      console.log('you are connected already')
    } else {
      connectedIps.push(ip);
    }
  }

  ws.send(world.serialize.serializeWorldProps());

  if (!world.controller.isWorldFull()) {
    const clientId = getUniqueID();
    const player = world.controller.onPlayerConnected(clientId);
    ws.send(world.serialize.serializePlayerConnected(player));
    ws.on('message', (data) => {
      try {
        if (data) {
          let parse;
          try {
            parse = JSON.parse(data.toString());
          } catch(e) {}
          // console.log(parse);
          if (parse?.event === 'bee-move') {
            world.controller.moveBee(player, parse.bee, parse.target.x, parse.target.y);
          }
        }
      } catch (e) {
        console.log(e);
      }
    });

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(world.serialize.serialize(clientId));
      }
    }, 10);

    ws.on('close', function close() {
      console.log('Client disconnected');
      delete world.players[player.id];
      clearInterval(interval);
    });
  } else {
    ws.send(world.serialize.serializeWorldIsFull());
  }
  ws.on('error', console.error);
});
