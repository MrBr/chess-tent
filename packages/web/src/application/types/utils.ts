import { CSSObject } from '@emotion/styled';
import { Entity, NormalizedEntity } from '@chess-tent/models';
import { ReactEventHandler } from 'react';
import { saveAs } from 'file-saver';
import { Schema } from './model';

export type Country = { name: string; cca2: string; flag: string };

export type Utils = {
  getEntitySchema: (entity: unknown) => Schema;
  getTypeSchema: (type: string) => Schema;
  rightMouse: (f: Function) => (e: MouseEvent) => void;
  stopPropagation: ReactEventHandler;
  isElementInViewport: (el: HTMLElement) => boolean;
  generateIndex: () => string;
  denormalize: <T>(id: string, type: string, entities: {}) => T;
  normalize: (entity: Entity | NormalizedEntity) => {
    entities: any;
    result: any;
  };
  getEntityId: (entity: Entity | NormalizedEntity) => string;
  isRelationship: (path: string[], type: any) => boolean;
  normalizePath: (
    path: string[],
    value: any,
    type: string,
  ) => { result: any; entities: {} };
  mobileCss: (style: TemplateStringsArray, ...args: any[]) => string;
  propEnhancer: <T extends {}>(
    prop: string | ((props: T) => string),
    style: Record<string, CSSObject>,
  ) => CSSObject;
  getDiff: (
    oldSubject: {} | unknown[],
    newSubject: {} | unknown[],
    result: { [key: string]: unknown },
  ) => { [key: string]: unknown };
  downloadAs: typeof saveAs;
  isLocalReferrer: () => boolean;
  noop: () => void;
  noopNoop: () => () => void;
  getLanguages: () => string[];
  getCountries: () => Country[];
  getCountryByCode: (cca2: string) => Country;
  stringToSelectValue: (value: string) => { value: string; label: string };
};
