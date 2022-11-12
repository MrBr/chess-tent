import { EntitiesState } from '@chess-tent/types';
import { AppState, State } from '@types';

export const selectNormalizedEntities: State['selectors']['selectNormalizedEntities'] =

    <T extends string | string[], K extends keyof EntitiesState>(
      entityDescriptor: T,
      type: K,
    ) =>
    (state: AppState) =>
      Array.isArray(entityDescriptor)
        ? entityDescriptor.map(id => state.entities[type][id])
        : (state.entities[type][entityDescriptor as string] as ReturnType<
            State['selectors']['selectNormalizedEntities']
          >);
