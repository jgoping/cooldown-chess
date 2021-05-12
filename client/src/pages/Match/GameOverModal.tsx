import Fade from '@material-ui/core/Fade';
import React from 'react';

import Modal from './MatchModal';
import ModalContent from './ModalContent';

interface GameOverModalProps {
  open: boolean;
  winner: string;
};

const WaitingModal: React.FC<GameOverModalProps> = ({ open, winner }) => {
  const winnerText = winner === 'w' ? 'White' : 'Black';

  return (
    <Modal
      open={open}
    >
      <Fade in={open}>
        <ModalContent>
          <div>Game Over! {winnerText} wins!</div>
        </ModalContent>
      </Fade>
    </Modal>
  );
};

export default WaitingModal;
