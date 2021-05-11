import { Server } from 'socket.io';

class PlayerTimer {
  cooldown: number;
  colour: string;
  io: Server;
  roomId: string;
  timeLeft = 0;

  constructor(colour: string, io: Server, roomId: string, cooldown?: number) {
    this.colour = colour;
    this.io = io;
    this.roomId = roomId;
    this.cooldown = cooldown ?? 5;
  }

  start() {
    this.timeLeft = this.cooldown;
    this.io.to(this.roomId).emit('Time', { colour: this.colour, time: this.timeLeft });

    let timer = setInterval(() => {
      --this.timeLeft;
      if (this.timeLeft <= 0) {
        clearInterval(timer);
      }
      this.io.to(this.roomId).emit('Time', { colour: this.colour, time: this.timeLeft });
    }, 1000);
  }

  canMove(): boolean {
    return this.timeLeft === 0;
  }
};

export default PlayerTimer;
