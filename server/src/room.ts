import { Chess, ChessInstance } from "chess.js";
import { Server, Socket } from "socket.io";

import PlayerTimer from './playerTimer';
import { switchTurn } from './utils';

interface PlayerData {
  colour: string,
  instance: ChessInstance,
  oppositeInstance: ChessInstance,
  timer: PlayerTimer
};

class Room {
  whiteChess = new Chess();
  blackChess = new Chess(switchTurn(this.whiteChess.fen()));
  cooldown?: number;
  gameInProgress = false;
  io: Server;
  playerMap: Map<Socket, PlayerData> = new Map();
  roomId: string;

  constructor(io: Server, roomId: string, cooldown?: number) {
    this.io = io;
    this.roomId = roomId;
    this.cooldown = cooldown;
  }

  addToPlayerMap(socket: Socket): PlayerData {
    const index = this.playerMap.size;
    const colour = index === 0 ? 'w' : 'b';
    const instance = index === 0 ? this.whiteChess : this.blackChess;
    const oppositeInstance = index === 0 ? this.blackChess : this.whiteChess;
    const timer = new PlayerTimer(colour, this.io, this.roomId, this.cooldown);

    const player = { colour, instance, oppositeInstance, timer };

    this.playerMap.set(socket, player);

    return player;
  }

  checkGameOver() {
    const board = this.whiteChess.board();
    let containsWhiteKing = false;
    let containsBlackKing = false;
    board.forEach((row) => {
      row.forEach((square) => {
        if (square && square.type === 'k') {
          square.color === 'w' ? containsWhiteKing = true : containsBlackKing = true;
        }
      })
    });

    return {
      gameOver: !containsWhiteKing || !containsBlackKing,
      winner: containsWhiteKing ? 'w' : 'b'
    };
  }

  addPlayer(socket: Socket) {
    if (this.playerMap.size < 2) {
      socket.join(this.roomId);

      const playerData = this.addToPlayerMap(socket);

      socket.emit('Player', playerData.colour);
      socket.emit('Board', playerData.instance.fen());

      if (this.playerMap.size === 2) {
        this.startGame();
      }

      socket.on('Move', (data) => {
        if (this.gameInProgress && playerData.timer.canMove()) {
          const result = playerData.instance.move({ from: data.sourceSquare, to: data.targetSquare });

          if (result) {
            playerData.timer.start();
            const curFen = playerData.instance.fen();

            playerData.instance.load(switchTurn(curFen));
            playerData.oppositeInstance.load(curFen);

            const gameOverData = this.checkGameOver();
            if (gameOverData.gameOver) {
              this.gameInProgress = false;
              this.io.to(this.roomId).emit('GameOver', gameOverData.winner);
            }

            socket.emit('Board', playerData.instance.fen());
            socket.to(this.roomId).emit('Board', playerData.oppositeInstance.fen());
          }
        }
      });

      socket.on('NewGame', () => {
        if (!this.gameInProgress) {
          this.resetGame();
          this.startGame();
        }
      });
    }
  }

  startGame() {
    this.gameInProgress = true;
    this.io.to(this.roomId).emit('Begin');
  }

  resetGame() {
    this.whiteChess.reset();
    this.blackChess.load(switchTurn(this.whiteChess.fen()));

    for (const [socket, playerData] of this.playerMap.entries()) {
      playerData.timer.reset();
      socket.emit('Board', playerData.instance.fen());
    }
  }
}

export default Room;