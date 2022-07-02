import { utils } from '@application';
import { ReversiblePatch } from '@chess-tent/models';

export const normalizePatches = (
  patchs: ReversiblePatch['next'] | ReversiblePatch['prev'],
  type: string,
) => {
  const entities = {};
  const result = patchs.map(({ op, path, value }) => {
    const patch = { op, path, value };
    const objectPath = path.filter(
      segment => typeof segment === 'string',
    ) as string[];
    if (utils.isRelationship(objectPath, type)) {
      const { entities, result } = utils.normalizePath(objectPath, value, type);
      Object.assign(entities, entities);
      patch.value = result;
    }
    return patch;
  });

  return { result, entities };
};
