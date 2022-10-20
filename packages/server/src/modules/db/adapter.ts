import { EntityDocument, Updater } from '@types';
import { Schema } from 'mongoose';

export const createAdapter =
  <T extends EntityDocument>(...updaters: Updater<T>[]) =>
  async (entity: T): Promise<T | false> => {
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
  // @ts-ignore - it works?
  schema.post(['find', 'finOne'], async function (docs) {
    const formattedDocs = Array.isArray(docs) ? docs : [docs];
    formattedDocs.forEach(doc => {
      if (!doc.isSelected('v')) {
        // Version is a must because of migration
        throw new Error(
          'Document missing version. This usually means some properties are selected but not version.',
        );
      }
    });
    return Promise.all(
      (formattedDocs as unknown as T[]).map(doc =>
        adapter(doc as T)
          // @ts-ignore
          .then(updatedDoc => updatedDoc && updatedDoc.save()),
      ),
    );
  });
};
