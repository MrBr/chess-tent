import { useEffect, useRef } from 'react';
import { defer } from 'lodash';

export const useComponentStateSilent = () => {
  const ref = useRef<{ mounted: boolean }>({ mounted: false });
  useEffect(() => {
    defer(() => {
      ref.current.mounted = true;
    });
  }, []);
  return ref.current;
};
