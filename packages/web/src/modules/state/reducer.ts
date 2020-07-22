import { combineReducers, Reducer } from 'redux';

const appReducer: {
  [key: string]: Reducer;
} = {};

const entityReducer: {
  [key: string]: Reducer;
} = {};

export const registerReducer = <T>(path: string, reducer: Reducer<T, any>) => {
  appReducer[path] = reducer;
};

export const registerEntityReducer = <T>(
  path: string,
  reducer: Reducer<T, any>,
) => {
  entityReducer[path] = reducer;
};

export const getRootReducer = () => {
  return combineReducers({
    ...appReducer,
    entities: combineReducers(entityReducer),
  });
};
