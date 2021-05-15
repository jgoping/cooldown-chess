import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import React from 'react';

import HomeButton from './HomeButton';
import Modal from './MatchModal';
import ModalContent from './ModalContent';
import ModalFooter from './ModalFooter';

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
          <ModalFooter>
            <Button variant="contained" onClick={newGameCallback}>Rematch</Button>
            <HomeButton />
          </ModalFooter>
        </ModalContent>
      </Fade>
    </Modal>
  );
};

export default GameOverModal;
