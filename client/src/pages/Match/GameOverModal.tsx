import Fade from '@material-ui/core/Fade';
import React from 'react';

import Modal from './MatchModal';
import ModalContent from './ModalContent';

interface GameOverModalProps {
  open: boolean;
  winner: string;
  newGameCallback: () => void;
};

const onClick = (newGameCallback: () => void) => {
  newGameCallback();
};

const GameOverModal: React.FC<GameOverModalProps> = ({ open, winner, newGameCallback }) => {
  const winnerText = winner === 'w' ? 'White' : 'Black';

  return (
    <Modal
      open={open}
    >
      <Fade in={open}>
        <ModalContent>
          <div>Game Over! {winnerText} wins!</div>
          <button type="button" onClick={() => onClick(newGameCallback)}>Rematch</button>
        </ModalContent>
      </Fade>
    </Modal>
  );
};

export default GameOverModal;
