import axios from 'axios';
import { withRouter } from 'react-router-dom';

import Logo from './logo';
import logoSrc from './logo.png';

interface CreateRoomResponse {
  roomId: string;
};

export const Home = (props: any) => {
  const onClick = async () => {
    const params = {
      cooldown: 5
    };

    const { data: { roomId } } = await axios.get<CreateRoomResponse>('http://127.0.0.1:8080/create-room', { params });
    props.history.push(`/match/${roomId}`);
  };

  return (
    <>
      <Logo src={logoSrc}/>
      <div>Home Page</div>
      <button type="button" onClick={onClick}>Create Room</button>
    </>
  )
};

export default withRouter(Home);
