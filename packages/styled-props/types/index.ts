import {
  ComponentType,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  AnchorHTMLAttributes,
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactElement,
} from 'react';

export const CLASSNAME_MAP = Symbol('CLASSNAME_MAP');
export const COMPONENT_CLASSNAME = Symbol('COMPONENT_CLASSNAME');

export type StyledProxyTarget = { [key: string]: any } & {
  [CLASSNAME_MAP]: { [key: string]: string };
  Component?: string | ComponentType;
};

export type StyledComponent<T extends {}> = ((
  props: T,
) => ReactElement<any, any> | null) & {
  defaultProps?: Partial<T>;
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
  | DynamicCssDescriptorResolver<T>
  | StyledComponent<T>
  | TemplateStringsArray
  | DynamicClassNameResolver<T>
  | CssDescriptor<T>;

export type ClassNamesCssResult = <T extends {}>(
  style: TemplateStringsArray,
  ...dynamicStyles: CompositeStyle<T>[]
) => CssDescriptor<T>;

export type ComponentCssResult<BaseProps = {}> = <CustomProps extends {}>(
  style: TemplateStringsArray,
  ...dynamicStyles: CompositeStyle<BaseProps & CustomProps>[]
) => StyledComponent<BaseProps & CustomProps>;

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
    ComponentCssResult<ButtonHTMLAttributes<HTMLButtonElement>>
  >;
  div: RecursiveWithCss<ComponentCssResult<HTMLAttributes<HTMLDivElement>>>;
  span: RecursiveWithCss<ComponentCssResult<HTMLAttributes<HTMLSpanElement>>>;
  p: RecursiveWithCss<ComponentCssResult<HTMLAttributes<HTMLParagraphElement>>>;
  input: RecursiveWithCss<
    ComponentCssResult<InputHTMLAttributes<HTMLInputElement>>
  >;
  a: RecursiveWithCss<
    ComponentCssResult<AnchorHTMLAttributes<HTMLAnchorElement>>
  >;
  img: RecursiveWithCss<
    ComponentCssResult<ImgHTMLAttributes<HTMLImageElement>>
  >;
}
