import 'module-alias/register';
import WebSocket, {WebSocketServer} from 'ws';
import World from '@entities/World';
import {getUniqueID} from "@lib/Math";

const connectedIps: string[] = [];

const wss = new WebSocketServer({port: 8080});

let world = new World(wss);
setInterval(() => {
  if (world.controller.checkIfWorldIsConqueredByPlayer()) {
    world.onReset();
    world = new World(wss);
    wss.clients.forEach((client: any) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(world.controller.worldIsConquered());
        setUpWorldForClient(client);
      }
    });
  }}, 200);


function onServerMessagesHandler(ws: any) {
  ws.on('message', (data: any) => {
    try {
      if (data) {
        let parse;
        try { parse = JSON.parse(data.toString()); } catch (e) {}
        if (parse?.event === 'bee-move') {
          world.controller.moveBee(ws.clientId, parse.bee, parse.target.x, parse.target.y);
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  ws.on('close', function close() {
    console.log('Client disconnected');
    delete world.players[ws.clientId.id];
  });

  ws.on('error', console.error);
}

function setUpWorldForClient(ws: any) {
  ws.send(world.serialize.serializeWorldProps());
  if (!world.controller.isWorldFull()) {
    if (!ws.clientId) {
      ws.clientId = getUniqueID();
      onServerMessagesHandler(ws);
    }
    const { clientId } = ws;
    const player = world.controller.onPlayerConnected(clientId);
    ws.send(world.serialize.serializePlayerConnected(player));
  } else {
    ws.send(world.serialize.serializeWorldIsFull());
  }
}

wss.on('connection', (ws: any, req) => {
  const ip = req.socket.remoteAddress;
  if (ip) {
    if (connectedIps.includes(ip)) {
      console.log('you are connected already');
    } else {
      connectedIps.push(ip);
    }
  }
  setUpWorldForClient(ws);
});
