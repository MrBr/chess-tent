import isNil from 'lodash/isNil';
import { RecordValue } from '@types';
import { utils } from '@application';

export const formatEntityValue = (value: RecordValue) => {
  if (isNil(value)) {
    return value;
  }
  return Array.isArray(value)
    ? value.map(utils.getEntityId)
    : utils.getEntityId(value);
};
