import { useParams } from 'react-router-dom';

import PlayableBoard from './PlayableBoard';

interface ParamTypes {
  roomId: string;
}

export const Match = () => {
  const { roomId } = useParams<ParamTypes>();
  
  return (
    <>
      <p>
        Cooldown Chess
      </p>
      <PlayableBoard roomId={roomId} />
    </>
  );
};

export default Match;