import Chessboard from 'chessboardjsx';
import React from 'react';
import socketIOClient, { Socket } from "socket.io-client";

const ENDPOINT = 'http://127.0.0.1:8080/';

const PlayableBoard = () => {
  const [position, setPosition] = React.useState('');
  const [socket, setSocket] = React.useState<Socket | undefined>();

  React.useEffect(() => {
    const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});;
    setSocket(socket);
    socket.on('Player', data => {
      setPosition(data);
    });

    socket.on('move', data => {
      setPosition(data);
    });

    socket.on('gameOver', () => {
      console.log('game is over')
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onDrop = ({sourceSquare, targetSquare}: { sourceSquare: string; targetSquare: string } ): void => {
    socket?.emit('move', {sourceSquare, targetSquare});
  };

  return <Chessboard 
            width={500}
            position={position}
            onDrop={onDrop}
          />
};

export default PlayableBoard;
