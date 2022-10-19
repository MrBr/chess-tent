import { Component, ReactEventHandler } from 'react';
import { GenericArguments as TGenericArguments } from '@chess-tent/types/dist/_helpers';

export type ClassComponent<T> = T extends Component<infer P, unknown, infer C>
  ? { new (props: P, context?: C): T }
  : never;

export type Unarray<T> = T extends Array<infer U> ? U : T;

export type ClickProps = { onClick?: ReactEventHandler };

export type ClassNameProps = { className?: string };

export type GenericArguments<T> = TGenericArguments<T>;
