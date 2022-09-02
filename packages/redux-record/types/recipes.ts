import { RecordBase } from './record';

export interface RecipeCollection<T> extends RecordBase<T[]> {
  push: (item: T) => void;
  pop: () => void;
  concat: (items: T[]) => void;
}

export type RecipeMeta<T extends {}> = RecordBase<unknown, T>;

export type RecipeMethod<
  NAME extends string,
  FUNC extends (...args: any[]) => any,
  META extends {} = {},
> = RecordBase<unknown, META> & {
  [prop in NAME]: FUNC;
};
