import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import Room from './room';

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

let PORT = process.env.PORT ?? 8080;

const roomMap = new Map();

const generateRoomId = () => {
  const roomIdNum = Math.floor(Math.random() * Math.pow(10, 8));
  return roomIdNum.toString();
};

app.get('/create-room', (req, res) => {
  const roomId = generateRoomId();
  const cooldown = typeof req.query.cooldown === 'string' ? parseInt(req.query.cooldown) : undefined;
  
  roomMap.set(roomId, new Room(io, roomId, cooldown));
  res.send({ 'roomId': roomId });
});

io.on('connection', socket => {
  socket.on('Room', (roomId) => {
    if (roomMap.has(roomId)) {
      const room = roomMap.get(roomId);
      room.addPlayer(socket);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
