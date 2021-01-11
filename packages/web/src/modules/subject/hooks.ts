import { useCallback, useState } from 'react';
import { EntitiesState, PathAction } from '@chess-tent/types';
import {
  getSubjectValueAt,
  SubjectPath,
  SubjectPathUpdate,
} from '@chess-tent/models';
import { hooks } from '@application';
import { throttle } from 'lodash';

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
export const usePathUpdates = (
  type: keyof EntitiesState,
  id: string,
  save: (updates: SubjectPathUpdate[]) => void,
  delay = 5000,
) => {
  // Use store to get latest entity
  const store = useStore();
  const [updates, setUpdates] = useState<SubjectPath[]>([]);

  const entityUpdated = useCallback(
    throttle(
      (updates: SubjectPath[]) => {
        const normalizedEntity = store.getState().entities[type][id];
        save(
          removeWeakerPaths(updates).map(path => ({
            path,
            value: getSubjectValueAt(normalizedEntity, path),
          })),
        );
        setUpdates([]);
      },
      delay,
      {
        trailing: true,
        leading: false,
      },
    ),
    [],
  );

  const pushUpdate = useCallback(
    (updateAction: PathAction<any, any, any>) => {
      const newUpdates = [...updates, updateAction.meta.path];
      entityUpdated(newUpdates);
      setUpdates(newUpdates);
    },
    [entityUpdated, updates],
  );

  return pushUpdate;
};
