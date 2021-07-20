import { MiddlewareAPI } from 'redux';
import { MF, CreateRecord } from '../types';

const createRecord: typeof CreateRecord = function createRecord(...fns: MF[]) {
  return (store: MiddlewareAPI, recordKey: string) => {
    return fns.reduce((record, middleware) => middleware(store)(record), {
      recordKey,
    });
  };
};

export default createRecord;
