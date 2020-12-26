import { isTablet, isMobile } from 'react-device-detect';

// TODO - change on redsize?
export const useIsMobile = () =>
  isTablet || isMobile || window.innerWidth < 769;
