import { RecordValue } from '@types';
import { utils } from '@application';

export const formatEntityValue = (value: RecordValue) => {
  return Array.isArray(value)
    ? value.map(utils.getEntityId)
    : utils.getEntityId(value);
};

export const getEntityType = (value: RecordValue) => {
  return Array.isArray(value) ? value[0]?.type : value.type;
};
