import { createStore, combineReducers } from 'redux';
import { records } from '../redux';

export const mockStore = () => {
  const store = createStore(combineReducers({ records }));
  // @ts-ignore
  store.dispatch({ type: '@@INIT' });
  return store;
};
