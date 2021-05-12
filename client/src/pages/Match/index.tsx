import socketIOClient, { Socket } from "socket.io-client";
import React from 'react';
import { useParams } from 'react-router-dom';

import GameOverModal from './GameOverModal';
import PlayableBoard from './PlayableBoard';
import WaitingModal from './WaitingModal';

const ENDPOINT = 'http://127.0.0.1:8080/';

interface ParamTypes {
  roomId: string;
}

const Match = () => {
  const [socket, setSocket] = React.useState<Socket | undefined>();
  const [player, setPlayer] = React.useState('');
  const [winner, setWinner] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [waitingModalOpen, setWaitingModalOpen] = React.useState(true);
  const [gameOverModalOpen, setGameOverModalOpen] = React.useState(false);
  const { roomId } = useParams<ParamTypes>();
  const [playerTimer, setPlayerTimer] = React.useState(0);
  const [opponentTimer, setOpponentTimer] = React.useState(0);

  React.useEffect(() => {
    const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});
    setSocket(socket);

    socket.emit('Room', roomId);

    socket.on('Player', data => {
      setPlayer(data);
    });

    socket.on('Begin', () => {
      setWaitingModalOpen(false);
      setGameOverModalOpen(false);
    });

    socket.on('Board', data => {
      setPosition(data);
    });

    socket.on('GameOver', data => {
      setGameOverModalOpen(true);
      setWinner(data);
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
  };

  const newGameCallback = () => {
    socket?.emit('NewGame');
  };
  
  return (
    <>
      <p>
        Cooldown Chess
      </p>
      <WaitingModal open={waitingModalOpen} roomId={roomId} />
      <GameOverModal open={gameOverModalOpen} winner={winner} newGameCallback={newGameCallback} />
      <PlayableBoard socket={socket} player={player} position={position} />
      <div>{opponentTimer}</div>
      <div>{playerTimer}</div>
    </>
  );
};

export default Match;
