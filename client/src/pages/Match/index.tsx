import socketIOClient, { Socket } from "socket.io-client";
import React from 'react';
import { useParams } from 'react-router-dom';

import GameOverModal from './GameOverModal';
import PlayableBoard from './PlayableBoard';
import WaitingModal from './WaitingModal';
import SpectatorModal from "./SpectatorModal";
import StartingModal from "./StartingModal";

const ENDPOINT = 'http://127.0.0.1:8080/';

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
    const socket = socketIOClient(ENDPOINT, {transports: ['websocket']});
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
      
      <PlayableBoard socket={socket} player={player} position={position} />
      <div>{opponentTimer}</div>
      <div>{playerTimer}</div>
    </>
  );
};

export default Match;
