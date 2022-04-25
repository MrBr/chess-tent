import { useEffect, useRef, useState, useCallback, ReactElement } from 'react';
import { defer } from 'lodash';
import { Hooks } from '@types';

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

export const useOutsideClick: Hooks['useOutsideClick'] = (
  onOutsideClick,
  ...refs
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refs.every(ref => !ref.current || !ref.current.contains(event.target))
      ) {
        onOutsideClick();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onOutsideClick, ...refs]);
};

export const usePrompt = (
  renderOffcanvas: (close: () => void) => ReactElement,
): ReturnType<Hooks['usePrompt']> => {
  const [shouldRender, setShouldRender] = useState<true>();

  const promptOffcanvas = useCallback(() => {
    setShouldRender(true);
  }, [setShouldRender]);

  return [
    shouldRender && renderOffcanvas(() => setShouldRender(undefined)),
    promptOffcanvas,
  ];
};
