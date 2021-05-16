import axios from 'axios';
import Button from '@material-ui/core/Button';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { withRouter } from 'react-router-dom';

import { getValue } from './utils';
import HomeCard from './HomeCard';
import HomeCardActions from './HomeCardActions';
import HomeCardContent from './HomeCardContent';
import Logo from './logo';
import logoSrc from './logo.png';
import Option from './Option';
import OptionFormControl from './OptionFormControl';

interface CreateRoomResponse {
  roomId: string;
};

export const Home = (props: any) => {
  const [numPlayers, setNumPlayers] = React.useState(1);
  const [cooldown, setCooldown] = React.useState(5);

  const handleNumPlayersChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNumPlayers(getValue(event));
  };

  const handleCooldownChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCooldown(getValue(event));
  };

  const onClick = async () => {
    const params = {
      numPlayers,
      cooldown
    };

    const { data: { roomId } } = await axios.get<CreateRoomResponse>(`${process.env.REACT_APP_SERVER_ENDPOINT}/create-room`, { params });
    props.history.push(`/match/${roomId}`);
  };

  return (
    <>
      <h1>Cooldown Chess</h1>
      <Logo src={logoSrc}/>

      <HomeCard>
        <HomeCardContent>
          <Option>
            <Typography variant="body1" component="p">Choose what opponent you will play:</Typography>
            <OptionFormControl variant="filled">
              <InputLabel id="demo-simple-select-filled-label">
                Opponent
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={numPlayers}
                onChange={handleNumPlayersChange}
                label="Opponent"
              >
                <MenuItem value={1}>Bot</MenuItem>
                <MenuItem value={2}>Human</MenuItem>
              </Select>
            </OptionFormControl>
          </Option>

          <Option>
            <Typography variant="body1" component="p">Choose how many seconds to wait between moves:</Typography>
            <OptionFormControl variant="filled">
              <InputLabel id="demo-simple-select-filled-label">
                Cooldown
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={cooldown}
                onChange={handleCooldownChange}
                label="Cooldown"
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </OptionFormControl>
          </Option>
        </HomeCardContent>
        <HomeCardActions>
          <Button variant="contained" onClick={onClick}>Create Room</Button>
        </HomeCardActions>
      </HomeCard>
    </>
  )
};

export default withRouter(Home);
