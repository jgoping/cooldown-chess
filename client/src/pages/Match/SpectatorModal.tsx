import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import React from 'react';

import HomeButton from './HomeButton';
import Modal from './MatchModal';
import ModalContent from './ModalContent';
import ModalFooter from './ModalFooter';

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
          <ModalFooter>
            <Button variant="contained" onClick={dismissCallback}>Spectate</Button>
            <HomeButton />
          </ModalFooter>
        </ModalContent>
      </Fade>
    </Modal>
  );
};

export default SpectatorModal;
