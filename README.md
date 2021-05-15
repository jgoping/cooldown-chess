# cooldown-chess
<img src="https://user-images.githubusercontent.com/32006038/118208498-df256100-b434-11eb-842a-567d7ba723ad.png" width="200" height="200">

Cooldown Chess is a chess variation that makes the game real-time. Instead of being turn-based, players will be given a "cooldown" after moving that they must wait before they can move again.

This project was made using React for the client-side and Express.js for the server-side, with Socket.io sending data between the two.

You can try the game here: http://justingoping.com/cooldown-chess

## How to set up
Ensure you have `nodejs` and `npm/yarn` installed.

### Server
1. Fork/Clone the repository in the `server` directory
2. Run `npm install` to install the dependencies
3. Run `npm start`. The server will run on `localhost:8080`

### Client
1. Fork/Clone the repository in the `client` directory
2. Run `yarn` to install the dependencies
3. Run `yarn start`. The server will run on `localhost:3000`
