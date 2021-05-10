import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import Room from './room';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 8080;

const roomMap = new Map();

io.on('connection', socket => {
  socket.on('Room', (roomId) => {
    if (!roomMap.has(roomId)) {
      roomMap.set(roomId, new Room(io, roomId));
    }

    const room = roomMap.get(roomId);
    room.addPlayer(socket);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
