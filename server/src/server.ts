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
io.on('connection', socket => {
  console.log('Connected');
    socket.emit('Player', chess.fen());

  socket.on('disconnect', () => {
    console.log('Disconnected');
    });
  // Listen for moves
  socket.on('move', (data) => {
    chess.move({ from: data.sourceSquare, to: data.targetSquare });
    io.emit('move', chess.fen());
    if (chess.game_over()) {
      io.emit('gameOver');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
