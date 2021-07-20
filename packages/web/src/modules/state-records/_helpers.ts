import isNil from 'lodash/isNil';
import { utils } from '@application';
import { Entity } from '@chess-tent/models';

export const formatEntityValue = (
  value: Entity | Entity[] | null | undefined,
) => {
  if (isNil(value)) {
    return value;
  }
  return Array.isArray(value)
    ? value.map(utils.getEntityId)
    : utils.getEntityId(value);
};
