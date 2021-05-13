import { RecordValue } from '@types';
import { utils } from '@application';
import { Entity } from '@chess-tent/models';

export const formatEntityValue = (value: RecordValue) => {
  // if (value === null) {
  //   return null;
  // }
  return Array.isArray(value)
    ? value.map(utils.getEntityId)
    : utils.getEntityId(value);
};

export const getEntityType = (value: RecordValue): Entity['type'] => {
  return Array.isArray(value) ? value[0]?.type : value.type;
};
