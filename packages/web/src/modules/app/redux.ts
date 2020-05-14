import { Reducer } from 'redux';

const appReducer: { [key: string]: Reducer } = {};

const registerReducer = (path: string, reducer: Reducer<any, any>) => {
  appReducer[path] = reducer;
};

export { registerReducer, appReducer };
