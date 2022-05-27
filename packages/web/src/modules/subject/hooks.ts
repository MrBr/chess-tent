import { useCallback, useEffect, useRef } from 'react';
import {
  getSubjectValueAt,
  Subject,
  SubjectPath,
  SubjectPathUpdate,
} from '@chess-tent/models';
import { hooks } from '@application';
import { RecordValue } from '@chess-tent/redux-record/types';
import { throttle } from 'lodash';
import { getDiff } from '../utils/utils';

const { useStore } = hooks;

const isSamePathBase = (path1: SubjectPath, path2: SubjectPath) => {
  const shorterPath = path1.length < path2.length ? path1 : path2;
  for (let i = shorterPath.length - 1; i >= 0; i--) {
    if (path2[i] !== path1[i]) {
      return false;
    }
  }
  return true;
};

const removeWeakerPaths = (updates: SubjectPath[]) => {
  return updates.filter((update1, index) => {
    return !updates.some((update2, i) => {
      if (index === i) {
        return false;
      }
      return (
        update1.length > update2.length && isSamePathBase(update1, update2)
      );
    });
  });
};

export const useDiffUpdates = (
  subject: RecordValue<Subject>,
  save: (updates: SubjectPathUpdate[]) => void,
  delay = 5000,
) => {
  const subjectRef = useRef<Subject | null>(null);
  // saveRef is needed so that update function get the last save
  // otherwise the save may be obsolete
  const saveRef = useRef<typeof save>(save);
  saveRef.current = save;
  // Use store to get latest entity
  const store = useStore();

  const diffUpdateRef = useRef(() => {
    if (!subjectRef.current) {
      console.warn('Updating entity without previous reference.');
      return;
    }

    const { type, id } = subjectRef.current;
    const normalizedEntity = store.getState().entities[type][id];
    if (!normalizedEntity) {
      // Entity most likely deleted
      return;
    }
    const diffs = getDiff(subjectRef.current, normalizedEntity);

    const updatedPaths = Object.keys(diffs).map(path =>
      path.split('.'),
    ) as SubjectPath[];

    const minimumUpdate = removeWeakerPaths(updatedPaths).map(path => {
      return {
        path,
        value: getSubjectValueAt(normalizedEntity, path),
      };
    });

    saveRef.current(minimumUpdate);
    subjectRef.current = normalizedEntity;
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledUpdate = useCallback(
    throttle(diffUpdateRef.current, delay, {
      trailing: true,
      leading: false,
    }),
    // Must be zero dependencies to call the same throttled function
    [subjectRef],
  );

  useEffect(() => {
    if (subjectRef.current) {
      throttledUpdate();
    }
  }, [subject, throttledUpdate, store]);

  useEffect(() => {
    if (!subject?.id || !subject?.type) {
      return;
    }
    // Save initial normalized subject version
    subjectRef.current = store.getState().entities[subject.type][
      subject.id
    ] as Subject;
  }, [store, subject?.id, subject?.type]);

  // Instant save
  return useCallback(() => {
    diffUpdateRef.current();
    // Canceling any previous throttled calls as the diffUpdate has just been called
    throttledUpdate.cancel();
  }, [throttledUpdate]);
};
