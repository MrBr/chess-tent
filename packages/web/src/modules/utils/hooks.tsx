import { useEffect, useRef, useState } from 'react';
import { defer } from 'lodash';
import { isTablet, isMobile } from 'react-device-detect';

export const useComponentStateSilent = () => {
  const ref = useRef<{ mounted: boolean }>({ mounted: false });
  useEffect(() => {
    defer(() => {
      ref.current.mounted = true;
    });
  }, []);
  return ref.current;
};

export const useComponentState = () => {
  const [state, setState] = useState<{ mounted: boolean }>({
    mounted: false,
  });
  useEffect(() => {
    defer(() => setState({ mounted: true }));
  }, [setState]);
  return state;
};

// TODO - change on redsize?
export const useIsMobile = () =>
  isTablet || isMobile || window.innerWidth < 769;
