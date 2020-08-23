import { Component } from 'react';

export type ClassComponent<T> = T extends Component<infer P, infer S, infer C>
  ? { new (props: P, context?: C): T }
  : never;

export type GenericArguments<T> = T extends [] ? T : T extends void ? [] : [T];
