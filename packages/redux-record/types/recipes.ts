export type RecipeCollection<T> = {
  push: (item: T) => void;
  pop: () => void;
  concat: (items: T[]) => void;
};
