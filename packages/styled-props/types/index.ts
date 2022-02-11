import {
  ComponentType,
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  AnchorHTMLAttributes,
} from 'react';

export const CLASSNAME_MAP = Symbol('CLASSNAME_MAP');

export type StyledProxyTarget = { [key: string]: any } & {
  [CLASSNAME_MAP]: { [key: string]: string };
  Component?: string | ComponentType;
};

export type DynamicClassNameResolver<T extends {}> = (props: T) => string;
export type DynamicCssDescriptorResolver<T extends {}> = (
  props: T,
) => CssDescriptor<T>;

export type CssDescriptor<T> = {
  className: string;
  staticStyle: string;
  resolveDynamicClassNames: DynamicClassNameResolver<T>;
};

export type CompositeStyle<T extends { className?: string }> =
  | string
  | number
  | TemplateStringsArray
  | DynamicClassNameResolver<T>
  | DynamicCssDescriptorResolver<T>
  | CssDescriptor<T>;

export type ClassNamesCssResult = <T>(
  style: TemplateStringsArray,
  ...dynamicStyles: CompositeStyle<T>[]
) => CssDescriptor<T>;

export type ComponentCssResult<BaseProps = {}> = <CustomProps extends {}>(
  style: TemplateStringsArray,
  ...dynamicStyles: CompositeStyle<BaseProps & CustomProps>[]
) => ComponentType<BaseProps & CustomProps>;

export type WithCss<T extends {}, CssReturnType extends {}> = {
  [key: string]: T;
} & {
  css: CssReturnType;
};

export type RecursiveWithCss<T> = WithCss<
  WithCss<WithCss<WithCss<WithCss<{}, T>, T>, T>, T>,
  T
>;

export interface Styled {
  <T extends {}>(component: ComponentType<T>): RecursiveWithCss<
    ComponentCssResult<T>
  >;
  <T extends {}>(component: string): RecursiveWithCss<ComponentCssResult<T>>;

  // Composite style initializer
  props: RecursiveWithCss<ClassNamesCssResult>;
  css: ClassNamesCssResult;

  // Base components
  button: RecursiveWithCss<
    ComponentCssResult<ButtonHTMLAttributes<HTMLButtonElement>>
  >;
  div: RecursiveWithCss<ComponentCssResult<HTMLAttributes<HTMLDivElement>>>;
  span: RecursiveWithCss<ComponentCssResult<HTMLAttributes<HTMLSpanElement>>>;
  p: RecursiveWithCss<ComponentCssResult<HTMLAttributes<HTMLParagraphElement>>>;
  input: RecursiveWithCss<
    ComponentCssResult<InputHTMLAttributes<HTMLInputElement>>
  >;
  a: RecursiveWithCss<
    ComponentCssResult<AnchorHTMLAttributes<HTMLInputElement>>
  >;
}
