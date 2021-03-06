import Button from '@material-ui/core/Button';
import socketIOClient, { Socket } from "socket.io-client";
import React from 'react';
import { useParams } from 'react-router-dom';

import GameOverModal from './GameOverModal';
import PlayableBoard from './PlayableBoard';
import WaitingModal from './WaitingModal';
import SpectatorModal from "./SpectatorModal";
import StartingModal from "./StartingModal";
import ColouredText from './ColouredText';

interface ParamTypes {
  roomId: string;
}

enum ModalTypes {
  None,
  Waiting,
  Starting,
  GameOver,
  Spectator
};

const Match = () => {
  const [socket, setSocket] = React.useState<Socket | undefined>();
  const [player, setPlayer] = React.useState('');
  const [winner, setWinner] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [modalType, setModalType] = React.useState(ModalTypes.None);
  const { roomId } = useParams<ParamTypes>();
  const [playerTimer, setPlayerTimer] = React.useState(0);
  const [opponentTimer, setOpponentTimer] = React.useState(0);
  const [countdown, setCountdown] = React.useState(0);

  React.useEffect(() => {
    const serverEndpoint = process.env.REACT_APP_SERVER_ENDPOINT ?? '';
    const socket = socketIOClient(serverEndpoint, {transports: ['websocket']});
    setSocket(socket);

    socket.emit('Room', roomId);

    socket.on('Player', data => {
      if (!data.bothConnected) {
        setModalType(ModalTypes.Waiting);
      }
      setPlayer(data.colour);
    });

    socket.on('Spectator', () => {
      setModalType(ModalTypes.Spectator);

      socket.on('Time', data => {
        updateTimer(data);
      });
    });

    socket.on('Board', data => {
      setPosition(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    socket?.on('Begin', data => {
      setCountdown(data);
      if (player) {
        data > 0 ? setModalType(ModalTypes.Starting) : setModalType(ModalTypes.None);
      }
    });

    socket?.on('GameOver', data => {
      if (player) {
        setModalType(ModalTypes.GameOver);
      }
      setWinner(data);
    });

    socket?.on('Time', data => {
      updateTimer(data);
    });
  }, [player])

  
  const updateTimer = ({ colour, time }: { colour: string, time: number}) => {
    const side = player.length > 0 ? player : 'w';
    side === colour ? setPlayerTimer(time) : setOpponentTimer(time);
  };

  const newGameCallback = () => {
    socket?.emit('NewGame');
  };

  const dismissCallback = () => {
    setModalType(ModalTypes.None);
  };

  const onSurrender = () => {
    socket?.emit('Surrender');
  };
  
  return (
    <>
      <p>
        Cooldown Chess
      </p>
      {modalType === ModalTypes.Waiting && (
        <WaitingModal roomId={roomId} />
      )}
      {modalType === ModalTypes.Starting && (
        <StartingModal countdown={countdown} />
      )}
      {modalType === ModalTypes.GameOver && (
        <GameOverModal winner={winner} newGameCallback={newGameCallback} />
      )}
      {modalType === ModalTypes.Spectator && (
        <SpectatorModal dismissCallback={dismissCallback} />
      )}

      <div>Opponent's cooldown: <ColouredText colour={!opponentTimer ? 'green' : 'red'}>{opponentTimer}</ColouredText></div>
      <PlayableBoard socket={socket} player={player} position={position} />
      <div>Your cooldown: <ColouredText colour={!playerTimer ? 'green' : 'red'}>{playerTimer}</ColouredText></div>
      <Button variant="contained" onClick={onSurrender}>Surrender</Button>
    </>
  );
};

export default Match;
