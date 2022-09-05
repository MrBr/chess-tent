import { Hooks, ValidationError } from '@types';
import { useEffect, useRef, useState, useCallback, ReactElement } from 'react';
import defer from 'lodash/defer';
import debounce from 'lodash/debounce';
import set from 'lodash/set';
import { ObjectSchema } from 'yup';
import { isMobile } from 'react-device-detect';

import { isElementInViewport } from './html';

export const useShowOnActive = <T extends HTMLElement>(active?: boolean) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (
      !active ||
      !ref.current ||
      isMobile ||
      isElementInViewport(ref.current)
    ) {
      return;
    }
    ref.current.scrollIntoView();
  }, [active, ref]);

  return ref;
};

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

export const useInputStateUpdate = (
  delay: number,
  updateState: (update: {}) => void,
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(debounce(updateState, delay), [
    delay,
    updateState,
  ]);
  return (e: React.ChangeEvent<HTMLInputElement>) =>
    debouncedUpdate(set({}, e.target.name, e.target.value));
};

export const useValidation: Hooks['useValidation'] = (schema: ObjectSchema) => {
  const [error, setError] = useState<ValidationError | null>(null);

  const validate = useCallback(
    (state: {}) => {
      try {
        schema.validateSync(state);
        setError(null);
      } catch (e) {
        setError(e as ValidationError);
        return false;
      }
      return true;
    },
    [schema],
  );

  return [error, validate];
};
