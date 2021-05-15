import Button from '@material-ui/core/Button';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const HomeButton: React.FC<RouteComponentProps> = ({ history }) => {
  const onClick = async () => {
    history.push(`/`);
  };

  return (
    <Button variant="contained" onClick={onClick}>Return to Home Screen</Button>
  );
};

export default withRouter(HomeButton);
