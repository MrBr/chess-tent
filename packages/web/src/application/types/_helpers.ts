import { Component, FormEvent, ReactEventHandler } from 'react';

export type ClassComponent<T> = T extends Component<infer P, unknown, infer C>
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
export type ContentEditableProps = {
  contentEditable?: boolean;
  dangerouslySetInnerHTML?: { __html: string };
  onInput?: (event: FormEvent<HTMLHeadingElement>) => void;
};
export type ClassNameProps = { className?: string };
