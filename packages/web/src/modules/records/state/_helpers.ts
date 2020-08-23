import { RecordValue } from '@types';

export const formatEntityValue = (value: RecordValue) => {
  return Array.isArray(value) ? value.map(entity => entity.id) : value.id;
};

export const getEntityType = (value: RecordValue) => {
  return Array.isArray(value) ? value[0].type : value.type;
};
