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
          <button type="button" onClick={dismissCallback}>Okay</button>
        </ModalContent>
      </Fade>
    </Modal>
  );
};

export default SpectatorModal;
