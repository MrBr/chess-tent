import { Entity } from '@chess-tent/models';
import { Schema } from './model';

export type Utils = {
  getEntitySchema: (entity: unknown) => Schema;
  getTypeSchema: (type: string) => Schema;
  rightMouse: (f: Function) => (e: MouseEvent) => void;
  generateIndex: () => string;
  denormalize: (id: string, type: string, entities: {}) => any;
  normalize: (entity: Entity) => any;
};
