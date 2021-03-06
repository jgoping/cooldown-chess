import { Chess } from "chess.js";
import { Server, Socket } from "socket.io";

import Player from './player';
import PlayerTimer from './playerTimer';
import { switchTurn } from './utils';

class Room {
  whiteChess = new Chess();
  blackChess = new Chess(switchTurn(this.whiteChess.fen()));
  cooldown: number;
  gameInProgress = false;
  io: Server;
  playerMap: Map<Socket, Player> = new Map();
  botData?: Player;
  roomId: string;
  numPlayers: number;

  constructor(io: Server, roomId: string, numPlayers: number, cooldown?: number) {
    this.io = io;
    this.roomId = roomId;
    this.numPlayers = numPlayers;
    this.cooldown = cooldown ?? 5;

    if (numPlayers === 1) {
      const colour = 'b';
      const instance = this.blackChess;
      const oppositeInstance = this.whiteChess;
      const timer = new PlayerTimer(colour, this.io, this.roomId, this.cooldown);
      
      this.botData = new Player(colour, instance, oppositeInstance, timer, this.io, this.roomId);
    }
  }

  addToPlayerMap(socket: Socket): Player {
    const index = this.playerMap.size;
    const colour = index === 0 ? 'w' : 'b';
    const instance = index === 0 ? this.whiteChess : this.blackChess;
    const oppositeInstance = index === 0 ? this.blackChess : this.whiteChess;
    const timer = new PlayerTimer(colour, this.io, this.roomId, this.cooldown);

    const player = new Player(colour, instance, oppositeInstance, timer, this.io, this.roomId, socket);

    this.playerMap.set(socket, player);

    return player;
  }

  addPlayer(socket: Socket) {
    socket.join(this.roomId);

    if (this.playerMap.size < this.numPlayers) {
      const player = this.addToPlayerMap(socket);

      socket.emit('Player', { colour: player.colour, bothConnected: this.playerMap.size === this.numPlayers });
      socket.emit('Board', player.instance.fen());

      if (this.playerMap.size === this.numPlayers) {
        this.startGame();
      }

      socket.on('Move', (data) => {
        if (this.gameInProgress && player.timer.canMove()) {
          this.gameInProgress = player.move(data.sourceSquare, data.targetSquare);
        }
      });

      socket.on('NewGame', () => {
        if (!this.gameInProgress) {
          this.resetGame();
          this.startGame();
        }
      });

      socket.on('Surrender', () => {
        if (this.gameInProgress) {
          this.gameInProgress = false;
          this.io.to(this.roomId).emit('GameOver', player.colour !== 'w' ? 'w' : 'b');
        }
      });
    } else {
      socket.emit('Spectator');
      socket.emit('Board', this.whiteChess.fen());
    }
  }

  startGame() {
    let countdown = 5;
    this.io.to(this.roomId).emit('Begin', countdown);

    let timer = setInterval(() => {
      --countdown;
      this.io.to(this.roomId).emit('Begin', countdown);

      if (countdown <= 0) {
        clearInterval(timer);
        this.gameInProgress = true;
      }
    }, 1000);

    if (this.botData) {
      const botData = this.botData;
      let botThinkingTime = 6000;
      const botLogic = () => {
        if (this.gameInProgress) {
          this.gameInProgress = botData.randomMove();
          botThinkingTime = (this.cooldown + Math.floor(Math.random() * Math.floor(this.cooldown/2)) + 1)*1000;
          setTimeout(botLogic, botThinkingTime);
        }
      };

      setTimeout(botLogic, botThinkingTime);
    }
  }

  resetGame() {
    this.whiteChess.reset();
    this.blackChess.load(switchTurn(this.whiteChess.fen()));

    for (const [socket, player] of this.playerMap.entries()) {
      player.timer.reset();
      player.colour === 'b' ? socket.emit('Board', player.instance.fen())
                                : this.io.to(this.roomId).emit('Board', this.whiteChess.fen());
    }
  }
}

export default Room;
