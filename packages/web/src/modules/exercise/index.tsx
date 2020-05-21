import { SCHEMA_EXERCISE } from '@chess-tent/models';
import { registerEntityReducer } from '../state';

import { reducer } from './state/reducer';

export * from './model';
export * from './state/actions';
export * from './state/selectors';

registerEntityReducer(SCHEMA_EXERCISE, reducer);
