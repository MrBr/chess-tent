import { RecordBase } from './record';

export type RecipeCollection<T> = {
  push: (item: T) => void;
  pop: () => void;
  concat: (items: T[]) => void;
};

export type RecipeMethod<
  T extends RecordBase<any>,
  M extends string,
  F extends (...args: any[]) => void,
> = {
  [prop in M]: F;
};
