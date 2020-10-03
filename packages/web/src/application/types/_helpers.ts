import { Component, ReactEventHandler } from 'react';

export type ClassComponent<T> = T extends Component<infer P, infer S, infer C>
  ? { new (props: P, context?: C): T }
  : never;

export type GenericArguments<T> = T extends
  | []
  | [unknown, unknown?, unknown?, unknown?, unknown?, unknown?]
  ? T
  : T extends void
  ? []
  : [T];

export type Unarray<T> = T extends Array<infer U> ? U : T;

export type ClickProps = { onClick?: ReactEventHandler };
export type ClassNameProps = { className?: string };
