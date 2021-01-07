import { hooks, utils } from '@application';
import { isStep, Step } from '@chess-tent/models';
import { cloneDeepWith } from 'lodash';
import { useCallback, useMemo } from 'react';
import { Hooks } from '@types';

const { useMeta } = hooks;

/**
 * Create new references and change step ID recursively.
 * NOTE:
 *      if this method fails to deliver new references,
 *      use JSON.stringify + JSON.parse
 */
const cloneSteps = (step: any): Step => {
  return cloneDeepWith(step, value => {
    if (value && isStep(value)) {
      return {
        ...value,
        id: utils.generateIndex(),
        state: cloneSteps(value.state),
      };
    }
  });
};

export const useCopyStep: Hooks['useCopyStep'] = () => {
  const [step, copy, remove] = useMeta<Step | undefined>('copiedStep');

  const paste = useCallback(() => (step ? cloneSteps(step) : null), [
    step,
  ]) as () => Step | null;

  const hasCopy = !!step;

  return useMemo(() => [hasCopy, copy, paste, remove], [
    copy,
    paste,
    remove,
    hasCopy,
  ]);
};
