import { Chess, ChessInstance } from "chess.js";
import { Server, Socket } from "socket.io";

import { switchTurn } from './utils';

interface PlayerData {
  colour: string,
  instance: ChessInstance,
  oppositeInstance: ChessInstance
};

class Room {
  whiteChess = new Chess();
  blackChess = new Chess(switchTurn(this.whiteChess.fen()));
  io: Server;
  playerMap: Map<Socket, PlayerData> = new Map();
  roomId: string;

  constructor(io: Server, roomId: string) {
    this.io = io;
    this.roomId = roomId;
  }

  addToPlayerMap(socket: Socket): PlayerData {
    const index = this.playerMap.size;
    const colour = index === 0 ? 'w' : 'b';
    const instance = index === 0 ? this.whiteChess : this.blackChess;
    const oppositeInstance = index === 0 ? this.blackChess : this.whiteChess;

    const player = { colour, instance, oppositeInstance };

    this.playerMap.set(socket, player);

    return player;
  }

  addPlayer(socket: Socket) {
    if (this.playerMap.size < 2) {
      socket.join(this.roomId);

      const playerData = this.addToPlayerMap(socket);

      socket.emit('Player', playerData.colour);
      socket.emit('Board', playerData.instance.fen());

      socket.on('Move', (data) => {
        const result = playerData.instance.move({ from: data.sourceSquare, to: data.targetSquare });

        if (result) {
          const curFen = playerData.instance.fen();

          playerData.instance.load(switchTurn(curFen));
          playerData.oppositeInstance.load(curFen);
          
          socket.emit('Board', playerData.instance.fen());
          socket.to(this.roomId).emit('Board', playerData.oppositeInstance.fen());
        }
      });
    }
  }
}

export default Room;