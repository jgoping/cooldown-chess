import Chessboard from 'chessboardjsx';
import React from 'react';
import socketIOClient, { Socket } from "socket.io-client";

const ENDPOINT = 'http://127.0.0.1:8080/';

const ROOM = 'test-room';

const PlayableBoard = () => {
  const [player, setPlayer] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [socket, setSocket] = React.useState<Socket | undefined>();

  React.useEffect(() => {
    const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});
    setSocket(socket);

    socket.emit('Room', ROOM);

    socket.on('Player', data => {
      setPlayer(data);
    });

    socket.on('Board', data => {
      setPosition(data);
    });

    socket.on('GameOver', () => {
      console.log('game is over');
    });

    return () => {
      socket.disconnect();
    };
  }, []);



  const onDrop = ({sourceSquare, targetSquare, piece}: { sourceSquare: string; targetSquare: string; piece: string }): void => {
    const pieceColour = piece[0];
    if (player === pieceColour) {
      socket?.emit('Move', {sourceSquare, targetSquare});
    }
  };

  return <Chessboard 
            width={500}
            position={position}
            onDrop={onDrop}
            orientation={player === 'w' ? 'white' : 'black'}
          />
};

export default PlayableBoard;
