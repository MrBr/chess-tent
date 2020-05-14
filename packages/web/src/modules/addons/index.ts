export { default as Evaluator } from './evaluator';

export const rightMouse = (f: Function) => (e: MouseEvent) =>
  e.button === 2 && f(e);
