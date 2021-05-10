import { createDraft, finishDraft, isDraft, PatchListener } from 'immer';
import { Objectish } from 'immer/dist/types/types-internal';

export type ServiceType =
  | ((a1: any, a2: any, a3?: PatchListener) => any)
  | ((a1: any, a2: any, a3: any, a4?: PatchListener) => any)
  | ((a1: any, a2: any, a3: any, a4: any, a5?: PatchListener) => any)
  | ((a1: any, a2: any, a3: any, a5: any, a6?: PatchListener) => any);

type CreateServiceArgs<
  T extends readonly any[],
  TNew = PatchListener
> = T extends [infer A]
  ? [A, TNew?]
  : T extends [infer A0, infer A1]
  ? [A0, A1, TNew?]
  : T extends [infer A0, infer A1, infer A2]
  ? [A0, A1, A2, TNew?]
  : T extends [infer A0, infer A1, infer A2, infer A3]
  ? [A0, A1, A2, A3, TNew?]
  : T extends [infer A0, infer A1, infer A2, infer A3, infer A4]
  ? [A0, A1, A2, A3, A4, TNew?]
  : T extends [infer A0, infer A1, infer A2, infer A3, infer A4, infer A5]
  ? [A0, A1, A2, A3, A4, A5, TNew?]
  : never;

/**
 * Standardise all services to work with drafts and optionally to track patches.
 * Patch listener may be appended as the last argument.
 * Given service should expect draft as the first argument.
 * Contract:
 *   - the first received argument must be the entity (on which change is happening)
 *   - the first forwarded argument will be immer draft
 *   - the last argument is immer patch listener and it's OPTIONAL
 *   - all arguments between the first and the last must be REQUIRED and can be ANY type
 */
const createService = <T extends any[], U>(
  service: (...args: T) => U,
): ((...args: CreateServiceArgs<T>) => U) => {
  return (...args): U => {
    let patchListener = args.pop();
    // Making patch listener optional
    if (typeof patchListener !== 'function') {
      // No patch listener, returning args to initial value
      args.push(patchListener);
      patchListener = undefined;
    }
    // Some recursive services will already have a draft so there is no need to create a new one
    if (!isDraft(args[0])) {
      args[0] = createDraft(args[0] as Objectish);
    }
    const returnValue = service(...((args as unknown) as T));
    // Allowing return value to leave draft mode (return current) provides
    // extra flexibility to recursive services (such as early return).
    return (isDraft(returnValue)
      ? finishDraft(args[0], patchListener as PatchListener)
      : returnValue) as U;
  };
};

export { createService };
