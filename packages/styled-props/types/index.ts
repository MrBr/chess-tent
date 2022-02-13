import {
  ComponentType,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  AnchorHTMLAttributes,
} from 'react';

export const CLASSNAME_MAP = Symbol('CLASSNAME_MAP');
export const COMPONENT_CLASSNAME = Symbol('COMPONENT_CLASSNAME');

export type StyledProxyTarget = { [key: string]: any } & {
  [CLASSNAME_MAP]: { [key: string]: string };
  Component?: string | ComponentType;
};

export type StyledComponent<T extends {}> = ComponentType<T> & {
  [COMPONENT_CLASSNAME]?: string;
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
  | StyledComponent<T>
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

export type BaseComponentCssResult<BaseProps = {}> = ComponentCssResult<
  Partial<BaseProps>
>;

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
  <T extends {}>(component: ComponentType<T> | string): RecursiveWithCss<
    ComponentCssResult<T>
  >;

  // Composite style initializer
  props: RecursiveWithCss<ClassNamesCssResult>;
  css: ClassNamesCssResult;

  // Base components
  button: RecursiveWithCss<
    BaseComponentCssResult<ButtonHTMLAttributes<HTMLButtonElement>>
  >;
  div: RecursiveWithCss<BaseComponentCssResult<HTMLDivElement>>;
  span: RecursiveWithCss<BaseComponentCssResult<HTMLSpanElement>>;
  p: RecursiveWithCss<BaseComponentCssResult<HTMLParagraphElement>>;
  input: RecursiveWithCss<
    BaseComponentCssResult<InputHTMLAttributes<HTMLInputElement>>
  >;
  a: RecursiveWithCss<
    BaseComponentCssResult<AnchorHTMLAttributes<HTMLAnchorElement>>
  >;
  img: RecursiveWithCss<BaseComponentCssResult<HTMLImageElement>>;
}
