import axios from 'axios';
import Button from '@material-ui/core/Button';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { withRouter } from 'react-router-dom';

import HomeCard from './HomeCard';
import HomeCardActions from './HomeCardActions';
import HomeCardContent from './HomeCardContent';
import Logo from './logo';
import logoSrc from './logo.png';
import { getValue } from './utils';

interface CreateRoomResponse {
  roomId: string;
};

export const Home = (props: any) => {
  const [cooldown, setCooldown] = React.useState(5);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCooldown(getValue(event));
  };

  const onClick = async () => {
    const params = {
      cooldown
    };

    const { data: { roomId } } = await axios.get<CreateRoomResponse>('http://127.0.0.1:8080/create-room', { params });
    props.history.push(`/match/${roomId}`);
  };

  return (
    <>
      <h1>Cooldown Chess</h1>
      <Logo src={logoSrc}/>

      <HomeCard>
        <HomeCardContent>
          <Typography variant="body1" component="p">Choose how many seconds to wait between moves:</Typography>
          <FormControl variant="filled" fullWidth={true} >
            <InputLabel id="demo-simple-select-filled-label">
              Cooldown
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={cooldown}
              onChange={handleChange}
              label="Cooldown"
            >
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
            </Select>
          </FormControl>
        </HomeCardContent>
        <HomeCardActions>
          <Button variant="contained" onClick={onClick}>Create Room</Button>
        </HomeCardActions>
      </HomeCard>
    </>
  )
};

export default withRouter(Home);
