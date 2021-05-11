class PlayerTimer {
  timeLeft = 0;

  start() {
    this.timeLeft = 5;
    let timer = setInterval(() => {
      --this.timeLeft;
      if (this.timeLeft <= 0) {
        clearInterval(timer);
      }
      console.log(`timeLeft: ${this.timeLeft}`);
    }, 1000);
  }

  canMove(): boolean {
    return this.timeLeft === 0;
  }
};

export default PlayerTimer;
