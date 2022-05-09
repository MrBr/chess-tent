import { useCallback, useEffect, useRef } from 'react';
import {
  getSubjectValueAt,
  Subject,
  SubjectPath,
  SubjectPathUpdate,
} from '@chess-tent/models';
import { hooks } from '@application';
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
  subject: Subject,
  save: (updates: SubjectPathUpdate[]) => void,
  delay = 5000,
) => {
  const subjectRef = useRef<Subject | null>(null);
  // Use store to get latest entity
  const store = useStore();

  useEffect(() => {
    // Save initial normalized subject version
    subjectRef.current = store.getState().entities[subject.type][
      subject.id
    ] as Subject;
  }, [store, subject.id, subject.type]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const entityUpdated = useCallback(
    throttle(
      () => {
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

        if (minimumUpdate.length > 0) {
          save(minimumUpdate);
        }
        subjectRef.current = normalizedEntity;
      },
      delay,
      {
        trailing: true,
        leading: false,
      },
    ),
    // Must be zero dependencies to call the same throttled function
    [subjectRef],
  );

  useEffect(() => {
    if (subjectRef.current) {
      entityUpdated();
    }
  }, [subject, entityUpdated]);
};
