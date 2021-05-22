import { ChessInstance, Square } from "chess.js";
import { Server, Socket } from "socket.io";

import PlayerTimer from './playerTimer';
import { checkGameOver, switchTurn } from './utils';

class Player {
  colour: string;
  instance: ChessInstance;
  oppositeInstance: ChessInstance;
  timer: PlayerTimer;
  io: Server;
  roomId: string;
  socket?: Socket;

  constructor(colour: string, instance: ChessInstance, oppositeInstance: ChessInstance, timer: PlayerTimer, io: Server, roomId: string, socket?: Socket) {
    this.colour = colour;
    this.instance = instance;
    this.oppositeInstance = oppositeInstance;
    this.timer = timer;
    this.io = io;
    this.roomId = roomId;
    this.socket = socket;
  }

  move(sourceSquare: Square, targetSquare: Square): boolean {
    let gameInProgress = true;

    const result = this.instance.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });

    if (result) {
      this.timer.start();
      const curFen = this.instance.fen();

      this.instance.load(switchTurn(curFen));
      this.oppositeInstance.load(curFen);

      const gameOverData = checkGameOver(this.instance.board());
      if (gameOverData.gameOver) {
        gameInProgress = false;
        this.io.to(this.roomId).emit('GameOver', gameOverData.winner);
      }

      if (this.socket) {
        this.socket.emit('Board', this.instance.fen());
        this.socket.to(this.roomId).emit('Board', this.oppositeInstance.fen());
      } else {
        this.io.to(this.roomId).emit('Board', this.oppositeInstance.fen());
      }
    }

    return gameInProgress;
  }

  randomMove() {
    let gameInProgress = true;

    const moves = this.instance.moves({ verbose: true })
    if (moves.length > 0) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      gameInProgress = this.move(move.from, move.to);
    }

    return gameInProgress;
  }
}

export default Player;
