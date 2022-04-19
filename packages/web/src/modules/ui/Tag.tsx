import Badge from 'react-bootstrap/Badge';
import styled from '@chess-tent/styled-props';
import { UI } from '@types';

const Tag = styled<UI['Tag']>(Badge).bg.css`
  padding: 0.5rem;
  color: inherit !important;
  background-color: var(--grey-300-color) !important;
  
  &.secondary {
    background-color: var(--secondary-color) !important;
  }
  
  &.primary {
    background-color: var(--primary-color) !important;;
  }
`;

export default Tag;
