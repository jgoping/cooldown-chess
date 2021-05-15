import styled from 'styled-components';

interface ColouredTextProps {
  colour: string;
};

const ColouredText = styled.p<ColouredTextProps>`
  color: ${props => props.colour};
  display: inline;
`;

export default ColouredText;
