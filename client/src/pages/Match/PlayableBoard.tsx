import Chessboard, { Piece } from 'chessboardjsx';
import React from 'react';
import { Socket } from "socket.io-client";

interface PlayableBoardProps {
  socket?: Socket;
  player: string;
  position: string;
}

const PlayableBoard: React.FC<PlayableBoardProps> = ({ socket, player, position }) => {
  const allowDrag = ({ piece }: { piece: Piece }) => {
    const pieceColour = piece[0];
    return player === pieceColour;
  };

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
  </>
  );
};

export default PlayableBoard;
