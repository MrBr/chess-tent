import React, { ComponentType } from 'react';
import { css } from '@emotion/css';
import cn from 'classnames';
import {
  CssDescriptor,
  DynamicClassNameResolver,
  CompositeStyle,
  CLASSNAME_MAP,
  COMPONENT_CLASSNAME,
  Styled,
  StyledProxyTarget,
  DynamicCssDescriptorResolver,
  StyledComponent,
  OmittedProps,
  OmittedPropsComposite,
} from '../types';

function createCssDescriptor<T extends { className?: string }>(
  styles: TemplateStringsArray,
  variables: any[],
  resolveDynamicClassNames: CssDescriptor<T>['resolveDynamicClassNames'],
  omittedProps: OmittedProps<T>,
): CssDescriptor<T> {
  const staticStyle = String.raw(styles, ...variables);
  return {
    get className() {
      // Has to use static style. Variables are already resolved in this phase.
      // Case with multiple styles and without variables CSS function can't resolve properly
      return css(staticStyle);
    },
    staticStyle: staticStyle,
    resolveDynamicClassNames,
    omittedProps,
  };
}

function isCssDescriptor<T extends { className?: string }>(
  compositeStyle: any,
): compositeStyle is CssDescriptor<T> {
  return typeof compositeStyle?.staticStyle === 'string';
}

function isStyledComponent<T extends { className?: string }>(
  component: any,
): component is StyledComponent<T> {
  return !!component?.[COMPONENT_CLASSNAME];
}

function isDynamicCssDescriptorResolver<T extends { className?: string }>(
  resolver: any,
): resolver is DynamicCssDescriptorResolver<T> {
  return typeof resolver === 'function';
}

function isOmittedPropsComposite<T extends {}>(
  composite: any,
): composite is OmittedPropsComposite<T> {
  return !!composite?.omitProps;
}

export const resolveClassNames =
  <T extends { className?: string }>(mappedProps: Partial<T>) =>
  (styles: TemplateStringsArray, ...variables: CompositeStyle<T>[]) => {
    const [styleVariables, compositeStyles, omittedProps] = variables.reduce<
      [
        any[],
        (DynamicClassNameResolver<T> | DynamicCssDescriptorResolver<T>)[],
        OmittedProps<T>,
      ]
    >(
      (res, variable) => {
        if (isStyledComponent(variable)) {
          // Create a className
          res[0].push('.' + variable[COMPONENT_CLASSNAME]);
        } else if (isDynamicCssDescriptorResolver(variable)) {
          res[1].push(variable);
        } else if (isCssDescriptor(variable)) {
          res[1].push(variable.resolveDynamicClassNames);
          res[0].push(variable.staticStyle);
          variable.omittedProps.forEach(prop => res[2].push(prop));
        } else if (isOmittedPropsComposite(variable)) {
          variable.omitProps.forEach(prop => res[2].push(prop));
        } else {
          res[0].push(variable);
        }
        return res;
      },
      [[], [], []],
    );
    const resolveDynamicClassNames = (props: T): string => {
      const dynamicClassNames = {} as Record<string, string | boolean>;
      for (const key in mappedProps) {
        const value = props[key];
        const propClassName = typeof value === 'string' ? value : key;
        dynamicClassNames[propClassName] =
          typeof value === 'string' ? value : !!value;
      }
      const compositeClassNames = compositeStyles.map(compositeStyle => {
        const composite = compositeStyle(props);
        if (typeof composite === 'string') {
          return composite;
        }
        return composite.className;
      });
      return cn(dynamicClassNames, ...compositeClassNames);
    };
    return createCssDescriptor(
      styles,
      styleVariables,
      resolveDynamicClassNames,
      omittedProps,
    );
  };

const renderWithClassNames =
  <T extends { className?: string }>(Component: ComponentType<T>) =>
  (mappedProps: Partial<T>) =>
  (
    styles: TemplateStringsArray,
    ...variables: CompositeStyle<T>[]
  ): StyledComponent<T> => {
    const { resolveDynamicClassNames, className, omittedProps } =
      resolveClassNames<T>(mappedProps)(styles, ...variables);
    const WrappedComponent: StyledComponent<T> = (props: T) => {
      const dynamicClassNames = resolveDynamicClassNames(props);
      const filteredProps =
        omittedProps.length > 0
          ? omittedProps.reduce(
              (res, prop) => {
                delete res[prop];
                return res;
              },
              { ...props },
            )
          : props;
      return (
        <Component
          {...filteredProps}
          className={cn(props.className, className, dynamicClassNames)}
        />
      );
    };
    WrappedComponent[COMPONENT_CLASSNAME] = className;
    return WrappedComponent;
  };

let styled = ((Component: ComponentType) =>
  new Proxy(
    {
      [CLASSNAME_MAP]: {},
      Component,
    } as StyledProxyTarget,
    {
      get(target, p: string, receiver): any {
        if (target[p]) {
          return target[p];
        }

        if (p === 'css') {
          return renderWithClassNames(target.Component as ComponentType)(
            target[CLASSNAME_MAP],
          );
        }

        target[CLASSNAME_MAP][p] = p;
        return receiver;
      },
    },
  )) as unknown as Styled;

styled.button = styled('button');
styled.input = styled('input');
styled.a = styled('a');
styled.span = styled('span');
styled.p = styled('p');
styled.div = styled('div');
styled.img = styled('img');

styled = new Proxy(styled, {
  get(target, p, receiver): any {
    if (p === 'props') {
      return new Proxy(
        {
          [CLASSNAME_MAP]: {},
        } as StyledProxyTarget,
        {
          get(target, p: string, receiver): any {
            if (target[p]) {
              return target[p];
            }

            if (p === 'css') {
              return resolveClassNames(target[CLASSNAME_MAP]);
            }

            target[CLASSNAME_MAP][p] = p;
            return receiver;
          },
        },
      );
    } else if (p === 'css') {
      return resolveClassNames({});
    }

    return Reflect.get(target, p, receiver);
  },
}) as Styled;

const useCss =
  <T extends {}>(cssDescriptor: CssDescriptor<T>) =>
  (props: T) => {
    const className = cssDescriptor.className;
    const dynamicClassNames = cssDescriptor.resolveDynamicClassNames(props);
    return cn(className, dynamicClassNames);
  };

const cssDescriptorCreator = (
  styles: TemplateStringsArray,
  ...args: any[]
): CssDescriptor<any> => resolveClassNames({})(styles, ...args);

export { cssDescriptorCreator as css, useCss };
export default styled;
