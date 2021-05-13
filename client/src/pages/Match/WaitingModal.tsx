import Fade from '@material-ui/core/Fade';
import React from 'react';

import Modal from './MatchModal';
import ModalContent from './ModalContent';
import RoomLink from './RoomLink';

interface WaitingModalProps {
  roomId: string;
};

const WaitingModal: React.FC<WaitingModalProps> = ({ roomId }) => {
  return (
    <Modal
      open={true}
    >
      <Fade in={true}>
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
