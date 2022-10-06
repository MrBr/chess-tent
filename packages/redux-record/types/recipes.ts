import { MF, RecordBase, RecordEntryType } from './record';

export interface RecipeCollection<V, M extends {} = {}>
  extends RecordEntryType<V[], M> {
  push: MF<(item: V, meta?: Partial<this['$meta']>) => void>;
  pop: MF<() => void>;
  concat: MF<(items: V[], meta: Partial<this['$meta']>) => void>;
}

export type RecipeMethod<
  NAME extends string,
  FUNC extends (...args: any[]) => any,
  VALUE,
  META extends {} = {},
> = RecordEntryType<VALUE, META> & {
  [prop in NAME]: MF<FUNC>;
};
