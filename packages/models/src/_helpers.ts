import {
  createDraft,
  finishDraft,
  isDraft,
  PatchListener,
  Patch,
  enablePatches,
  applyPatches,
  Draft,
} from 'immer';
import { Objectish } from 'immer/dist/types/types-internal';

enablePatches();

export type ReversiblePatch = {
  next: Patch[];
  prev: Patch[];
};

export type ServiceType =
  | ((a1: any, a2: any, a3?: PatchListener) => any)
  | ((a1: any, a2: any, a3: any, a4?: PatchListener) => any)
  | ((a1: any, a2: any, a3: any, a4: any, a5?: PatchListener) => any)
  | ((a1: any, a2: any, a3: any, a5: any, a6?: PatchListener) => any);

const createReversiblePatch = (
  next: Patch[],
  prev: Patch[],
): ReversiblePatch => ({
  next,
  prev,
});

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
const createService = <T extends { 0: any } & Array<any>, U>(
  service: (...args: T) => U,
): ((...args: [...T, PatchListener?]) => U) => {
  return (...args): U => {
    // Working on existing draft, let the "owner" finish the draft once ready.
    let isRecursive = !!isDraft(args[0]);
    let patchListener = args.pop();
    // Making patch listener optional
    // TODO - this is not valid validation; function is not strict enough
    if (typeof patchListener !== 'function') {
      // No patch listener, returning args to initial value
      args.push(patchListener);
      patchListener = undefined;
    }
    // Some recursive services will already have a draft so there is no need to create a new one
    if (!isDraft(args[0])) {
      args[0] = createDraft<T[0]>(args[0] as Objectish);
    }
    const returnValue = service(...(args as unknown as T));
    if (isRecursive) {
      return returnValue;
    }
    return finishDraft(args[0], patchListener as PatchListener) as U;
  };
};

/**
 * Use to updated nested substate when the substate is updated with a patchable service.
 * Rather then creating a new service to updated substate as a whole, this utility enables
 * partial patch update by using the substate service patch and applying it to the parent.
 *
 * Useful when the substate is updated simultaneously from different aspects to avoid overriding
 * the earlier updates.
 *
 * The need for such utility probably indicated a poor architecture. Seems like the normalization
 * should take care for this. Updating substate as an independent state would solve the problem.
 */
const applyNestedPatches =
  <T extends any[], U>(service: (...args: T) => U) =>
  (...args: T) =>
  <E extends {}>(
    entity: E,
    getNestedDraft: (entity: Draft<E>) => {},
    patchListener?: PatchListener,
  ): E => {
    const meta: { patch?: ReversiblePatch } = {};
    // @ts-ignore
    service(...args, (next: Patch[], prev: Patch[]) => {
      meta.patch = createReversiblePatch(next, prev);
    });

    const draft = createDraft(entity);
    applyPatches(getNestedDraft(draft), meta.patch?.next || []);

    return finishDraft(draft, patchListener) as E;
  };

/**
 * Similar to the applyNestedPatches but feels a lot simpler.
 *
 * The function enables a new more verbose approach. Instead of making a single patch update
 * it creates a draft which is later on modified by the other services.
 *
 * This is actually a way to go in the future. Services shouldn't create draft but rather get it as an argument.
 *
 * TODO - Needs verification
 */
const applyUpdates =
  <T>(entity: T) =>
  (update: (draft: T) => void) =>
  (patchListener?: PatchListener): T => {
    const draft = createDraft(entity);
    update(draft as T);
    return finishDraft(draft, patchListener) as T;
  };

export {
  createService,
  PatchListener,
  Patch,
  createReversiblePatch,
  applyPatches,
  applyNestedPatches,
  applyUpdates,
};
