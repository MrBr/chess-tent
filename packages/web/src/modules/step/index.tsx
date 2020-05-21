import { SCHEMA_STEP } from '@chess-tent/models';
import { registerEntityReducer } from '../state';

import { reducer } from './state/reducer';

export * from './model';
export * from './state/actions';
export * from './state/selectors';

registerEntityReducer(SCHEMA_STEP, reducer);
