import { MiddlewareAPI } from 'redux';
import { MF, CreateRecord } from '../types';

const createRecord: typeof CreateRecord = function createRecord(...fns: MF[]) {
  return (recordKey: string) => (store: MiddlewareAPI) => {
    return fns.reduce(
      (record, middleware) => middleware(recordKey)(store)(record),
      {},
    );
  };
};

export default createRecord;
