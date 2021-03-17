import { EntityDocument, Updater } from '@types';
import { Schema } from 'mongoose';

export const createAdapter = <T extends EntityDocument>(
  ...updaters: Updater<T>[]
) => async (entity: T): Promise<T | false> => {
  let updatedEntity: false | T = false;
  const newerUpdaters = [];

  for (const update of updaters) {
    updatedEntity = await update(entity);
    if (updatedEntity) {
      break;
    }
    newerUpdaters.push(update);
  }

  let update = newerUpdaters.pop();
  while (update && !!updatedEntity) {
    updatedEntity = await update(updatedEntity);
    update = newerUpdaters.pop();
  }

  return updatedEntity;
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
