import { EntityDocument, Updater } from '@types';
import { Schema } from 'mongoose';

export const createAdapter = <T extends EntityDocument>(
  ...updaters: Updater<T>[]
) => async (entity: T): Promise<T | false> => {
  if (!entity) {
    return false;
  }
  const version = entity.v;
  let lastEntity = entity;

  for (const update of updaters) {
    const updatedEntity = await update(lastEntity);
    if (updatedEntity) {
      lastEntity = updatedEntity;
    }
  }

  return version === lastEntity.v ? false : lastEntity;
};

export const applyAdapter = <T extends EntityDocument>(
  schema: Schema,
  adapter: Updater<T>,
) => {
  schema.post('find', async function (docs) {
    return Promise.all(
      ((docs as unknown) as T[]).map(doc =>
        adapter(doc as T)
          // @ts-ignore
          .then(updatedDoc => updatedDoc && updatedDoc.save()),
      ),
    );
  });
  schema.post('findOne', async function (doc) {
    const updatedDoc = await adapter((doc as unknown) as T);
    if (updatedDoc) {
      // @ts-ignore
      updatedDoc.save();
    }
  });
};
