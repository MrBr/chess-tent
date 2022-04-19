import ProgressBar from 'react-bootstrap/ProgressBar';
import styled from '@chess-tent/styled-props';

const StyledProgressBar = styled(ProgressBar).variant.css`
  height: 2px;
  
  &.success.progress-bar {
    background-color: var(--success-color) !important;
  }
  
  .progress-bar {
    border-radius: 10px;
    background-color: var(--primary-color);
  }
`;

export default StyledProgressBar;
