import RBCard from 'react-bootstrap/Card';
import { UI } from '@types';
import styled from '@chess-tent/styled-props';

const CardComponent = styled<UI['Card']>(RBCard).css`
  background-color: transparent;
  position: relative;
  border: 1px solid var(--grey-400-color);
  border-radius: 14px;

  :hover {
    border-color: var(--black-color);
  }
` as unknown as UI['Card'];

CardComponent.Body = styled(RBCard.Body).css`
  padding: 16px;
`;
CardComponent.Header = RBCard.Header;
CardComponent.Img = styled(RBCard.Img).css`
  border-radius: 0;
  border: none;
`;

export default CardComponent;
