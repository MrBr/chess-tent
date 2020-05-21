import { SCHEMA_SECTION } from '@chess-tent/models';
import { registerEntityReducer } from '../state';

import { reducer } from './state/reducer';

export * from './model';
export * from './state/actions';

registerEntityReducer(SCHEMA_SECTION, reducer);
