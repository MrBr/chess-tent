export type GenericArguments<T> = T extends
  | []
  | [unknown?, unknown?, unknown?, unknown?, unknown?, unknown?]
  ? T
  : T extends void
  ? []
  : [T];
