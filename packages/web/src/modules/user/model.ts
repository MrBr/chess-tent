import { TYPE_USER } from '@chess-tent/models';
import { schema } from 'normalizr';

export const userSchema = new schema.Entity(TYPE_USER);
