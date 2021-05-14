import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import React from 'react';

import Modal from './MatchModal';
import ModalContent from './ModalContent';

interface SpectatorModalProps {
  dismissCallback: () => void;
};

const SpectatorModal: React.FC<SpectatorModalProps> = ({ dismissCallback }) => {
  return (
    <Modal
      open={true}
    >
      <Fade in={true}>
        <ModalContent>
          <div>You have joined in spectator mode as two players have already joined this room.</div>
          <Button variant="contained" onClick={dismissCallback}>Okay</Button>
        </ModalContent>
      </Fade>
    </Modal>
  );
};

export default SpectatorModal;
