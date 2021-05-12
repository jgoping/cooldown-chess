import Fade from '@material-ui/core/Fade';
import React from 'react';

import Modal from './MatchModal';
import ModalContent from './ModalContent';
import RoomLink from './RoomLink';

interface WaitingModalProps {
  open: boolean;
  roomId: string;
};

const WaitingModal: React.FC<WaitingModalProps> = ({ open, roomId }) => {
  return (
    <Modal
      open={open}
    >
      <Fade in={open}>
        <ModalContent>
          <div>Send this link to your opponent:</div>
          <RoomLink
            id="standard-basic"
            label="Room ID"
            variant="filled"
            defaultValue={`http://localhost:3000/#/match/${roomId}`}
            InputProps={{
              readOnly: true,
            }}
          />
          <div>Waiting for opponent to join...</div>
        </ModalContent>
      </Fade>
    </Modal>
  );
};

export default WaitingModal;
