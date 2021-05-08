import { Chess } from 'chess.js';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 8080;

app.get('/', (_req, res) => {
  res.send('Testing');
});

const chess = new Chess()
let playerCount = 0;

io.on('connection', socket => {
  console.log('Connected');
  if (playerCount < 2) {
    ++playerCount;
    socket.emit('Player', playerCount === 1 ? 'w' : 'b');
    socket.emit('Board', chess.fen());

  socket.on('disconnect', () => {
    console.log('Disconnected');
      --playerCount;
    });
  }
  
  // Listen for moves
  socket.on('move', (data) => {
    chess.move({ from: data.sourceSquare, to: data.targetSquare });
    io.emit('Board', chess.fen());
    if (chess.game_over()) {
      io.emit('gameOver');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
