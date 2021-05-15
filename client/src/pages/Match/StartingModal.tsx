import Fade from '@material-ui/core/Fade';
import React from 'react';

import Modal from './MatchModal';
import ModalContent from './ModalContent';

interface StartingModalProps {
  countdown: number;
};

const StartingModal: React.FC<StartingModalProps> = ({ countdown }) => {
  return (
    <Modal
      open={true}
    >
      <Fade in={true}>
        <ModalContent>
          <div>Both players joined!</div>
          <div>Starting game in {countdown} seconds...</div>
        </ModalContent>
      </Fade>
    </Modal>
  );
};

export default StartingModal;
