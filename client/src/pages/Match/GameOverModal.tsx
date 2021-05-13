import Fade from '@material-ui/core/Fade';
import React from 'react';

import Modal from './MatchModal';
import ModalContent from './ModalContent';

interface GameOverModalProps {
  winner: string;
  newGameCallback: () => void;
};

const GameOverModal: React.FC<GameOverModalProps> = ({ winner, newGameCallback }) => {
  const winnerText = winner === 'w' ? 'White' : 'Black';

  return (
    <Modal
      open={true}
    >
      <Fade in={true}>
        <ModalContent>
          <div>Game Over! {winnerText} wins!</div>
          <button type="button" onClick={newGameCallback}>Rematch</button>
        </ModalContent>
      </Fade>
    </Modal>
  );
};

export default GameOverModal;
