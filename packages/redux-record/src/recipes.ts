import { MiddlewareAPI } from 'redux';
import { MF } from '../types';

import { concatRecordAction, pushRecordAction } from './redux/actions';

const push: MF<(item: any, meta?: Partial<{}>) => void> =
  (recordKey: string) => (store: MiddlewareAPI) => () => item => {
    store.dispatch(pushRecordAction(recordKey, item));
  };
const pop: MF<(meta?: Partial<{}>) => void> =
  (recordKey: string) => (store: MiddlewareAPI) => record => () => {
    console.warn('Record collection pop not implemented');
  };
const concat: MF<(items: any[], meta?: Partial<{}>) => void> =
  (recordKey: string) => (store: MiddlewareAPI) => () => items => {
    store.dispatch(concatRecordAction(recordKey, items));
  };

const collectionRecipe = {
  pop,
  push,
  concat,
};

export { collectionRecipe };
