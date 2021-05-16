import { PieceType } from 'chess.js';

type Board = Array<Array<{ type: PieceType; color: 'w' | 'b' } | null>>;

export const checkGameOver = (board: Board) => {
  let containsWhiteKing = false;
  let containsBlackKing = false;
  board.forEach((row) => {
    row.forEach((square) => {
      if (square && square.type === 'k') {
        square.color === 'w' ? containsWhiteKing = true : containsBlackKing = true;
      }
    })
  });

  return {
    gameOver: !containsWhiteKing || !containsBlackKing,
    winner: containsWhiteKing ? 'w' : 'b'
  };
}

export const switchTurn = (fenString: string) => {
  const splitString = fenString.split(' ');
  splitString[1] = splitString[1] !== 'w' ? 'w' : 'b';

  // Clear the en passant square
  splitString[3] = '-';

  return splitString.join(' ');
};
