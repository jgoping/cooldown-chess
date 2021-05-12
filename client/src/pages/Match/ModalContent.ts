import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

const ModalContent = withTheme(styled.div`
  background: ${props => props.theme.palette.background.paper};
  border: '2px solid #000';
  boxShadow: ${props => props.theme.shadows[5]};
  padding: ${props => props.theme.spacing(2, 4, 3)};
`);

export default ModalContent;
