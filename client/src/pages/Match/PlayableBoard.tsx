import Chessboard, { Piece } from 'chessboardjsx';
import React from 'react';
import socketIOClient, { Socket } from "socket.io-client";

const ENDPOINT = 'http://127.0.0.1:8080/';

interface PlayableBoardProps {
  roomId: string;
}

const PlayableBoard: React.FC<PlayableBoardProps> = ({ roomId }) => {
  const [player, setPlayer] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [socket, setSocket] = React.useState<Socket | undefined>();
  const [playerTimer, setPlayerTimer] = React.useState(0);
  const [opponentTimer, setOpponentTimer] = React.useState(0);

  React.useEffect(() => {
    const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});
    setSocket(socket);

    socket.emit('Room', roomId);

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

  React.useEffect(() => {
    socket?.on('Time', data => {
      updateTimer(data);
    });
  }, [player])

  const updateTimer = ({ colour, time }: { colour: string, time: number}) => {
    player === colour ? setPlayerTimer(time) : setOpponentTimer(time);
  }

  const allowDrag = ({ piece }: { piece: Piece }) => {
    const pieceColour = piece[0];
    return player === pieceColour;
  }

  const onDrop = ({sourceSquare, targetSquare, piece}: { sourceSquare: string; targetSquare: string; piece: string }): void => {
    const pieceColour = piece[0];
    if (player === pieceColour) {
      socket?.emit('Move', {sourceSquare, targetSquare});
    }
  };

  return (
  <>
    <Chessboard 
      width={500}
      position={position}
      allowDrag={(allowDrag)}
      onDrop={onDrop}
      orientation={player === 'w' ? 'white' : 'black'}
    />
    <div>{opponentTimer}</div>
    <div>{playerTimer}</div>
  </>
  );
};

export default PlayableBoard;
