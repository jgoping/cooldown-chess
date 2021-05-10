import { Chess, ChessInstance } from "chess.js";
import { Server, Socket } from "socket.io";

interface PlayerData {
  colour: string,
  instance: ChessInstance,
  oppositeInstance: ChessInstance
};

class Room {
  chess = new Chess();
  io: Server;
  playerCount = 0;
  roomId: string;

  constructor(io: Server, roomId: string) {
    this.io = io;
    this.roomId = roomId;
  }

  addPlayer(socket: Socket) {
    if (this.playerCount < 2) {
      socket.join(this.roomId);

      ++this.playerCount;
      socket.emit('Player', this.playerCount === 1 ? 'w' : 'b');
      socket.emit('Board', this.chess.fen());

      socket.on('Move', (data) => {
        this.chess.move({ from: data.sourceSquare, to: data.targetSquare });
        this.io.to(this.roomId).emit('Board', this.chess.fen());
        if (this.chess.game_over()) {
          this.io.to(this.roomId).emit('GameOver');
        }
      });
    }
  }
}

export default Room;