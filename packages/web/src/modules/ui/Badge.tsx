import BBadge from 'react-bootstrap/Badge';
import styled from '@chess-tent/styled-props';
import { UI } from '@types';

const Badge: UI['Badge'] = styled(BBadge).bg.circle.css`
  ${{ omitProps: ['circle'] }}
  
  padding: 0.5rem;
  color: inherit !important;
  background-color: var(--grey-300-color) !important;
  font-weight: 300;
  
  &.circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    overflow: hidden;
    border-radius: 50%;
    float: left;
  }
  
  &.secondary {
    background-color: var(--secondary-color) !important;
    color: var(--light-color) !important;
  }
  
  &.primary {
    background-color: var(--primary-color) !important;
    color: var(--light-color) !important;
  }
`;

export default Badge;
