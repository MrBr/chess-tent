import { CSSObject } from '@emotion/styled';
import { Entity } from '@chess-tent/models';
import { ReactEventHandler } from 'react';
import { saveAs } from 'file-saver';
import { Schema } from './model';

export type Utils = {
  getEntitySchema: (entity: unknown) => Schema;
  getTypeSchema: (type: string) => Schema;
  rightMouse: (f: Function) => (e: MouseEvent) => void;
  stopPropagation: ReactEventHandler;
  generateIndex: () => string;
  denormalize: (id: string, type: string, entities: {}) => any;
  normalize: (entity: Entity) => any;
  getEntityId: (entity: Entity) => string;
  mediaQueryEnhancer: (
    screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    style: CSSObject,
  ) => CSSObject;
  getDiff: (
    oldSubject: {} | unknown[],
    newSubject: {} | unknown[],
    result: { [key: string]: unknown },
  ) => { [key: string]: unknown };
  downloadAs: typeof saveAs;
};
