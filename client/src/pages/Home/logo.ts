import styled from 'styled-components';

interface props {
  src: string;
};

const Logo = styled.img<props>`
  src: ${props => props.src};
  height: 400px;
  width: 400px;
  margin-bottom: 20px;
`;

export default Logo;
