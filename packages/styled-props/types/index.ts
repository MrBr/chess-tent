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
) => ReactElement<T, any> | null) & {
  defaultProps?: Partial<T>;
  [COMPONENT_CLASSNAME]?: string;
};
export type OmittedProps<T extends { className?: string }> = (keyof T)[];
export type DynamicClassNameResolver<T extends {}> = (props: T) => string;
export type DynamicCssDescriptorResolver<T extends {}> = (
  props: T,
) => CssDescriptor<T>;

// TODO - make all attributes optional; it will make much simpler composition
// Currently different type of composites are needed to make it simple (such as omitProps composite).
// It is created just to write shorter descriptor.
export type CssDescriptor<T extends {}> = {
  className: string;
  staticStyle: string;
  resolveDynamicClassNames: DynamicClassNameResolver<T>;
  omittedProps: OmittedProps<T>;
};

export type OmittedPropsComposite<T extends {}> = {
  omitProps: OmittedProps<T>;
};
export type CompositeStyle<T extends { className?: string }> =
  | string
  | number
  | OmittedPropsComposite<T>
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

export type RecursiveWithCss<T extends {}> = WithCss<
  WithCss<WithCss<WithCss<WithCss<{}, T>, T>, T>, T>,
  T
>;

export interface Styled {
  <T extends ComponentType<any> | {}>(
    component: T extends ComponentType<infer U>
      ? T
      : T extends {}
      ? ComponentType<T> | string
      : never,
  ): RecursiveWithCss<
    ComponentCssResult<T extends ComponentType<infer U> ? U : T>
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
  hr: RecursiveWithCss<ComponentCssResult<ImgHTMLAttributes<HTMLImageElement>>>;
}
