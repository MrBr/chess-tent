import { Component } from 'react';

export type ClassComponent<T> = T extends Component<infer P, infer S, infer C>
  ? { new (props: P, context?: C): T }
  : never;
