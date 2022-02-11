import React, { ComponentType } from 'react';
import { css } from '@emotion/css';
import cn from 'classnames';
import {
  CssDescriptor,
  DynamicClassNameResolver,
  CompositeStyle,
  CLASSNAME_MAP,
  Styled,
  StyledProxyTarget,
  DynamicCssDescriptorResolver,
} from '../types';

function createCssDescriptor<T extends { className?: string }>(
  styles: TemplateStringsArray,
  variables: any[],
  resolveDynamicClassNames: CssDescriptor<T>['resolveDynamicClassNames'],
): CssDescriptor<T> {
  return {
    get className() {
      return css(styles, ...variables);
    },
    staticStyle: String.raw(styles, ...variables),
    resolveDynamicClassNames,
  };
}

function isCssDescriptor<T extends { className?: string }>(
  compositeStyle: any,
): compositeStyle is CssDescriptor<T> {
  return !!compositeStyle?.staticStyle;
}

export const resolveClassNames = <T extends { className?: string }>(
  mappedProps: Partial<T>,
) => (styles: TemplateStringsArray, ...variables: CompositeStyle<T>[]) => {
  const [styleVariables, compositeStyles] = variables.reduce<
    [any[], (DynamicClassNameResolver<T> | DynamicCssDescriptorResolver<T>)[]]
  >(
    (res, variable) => {
      if (typeof variable === 'function') {
        res[1].push(variable);
      } else if (isCssDescriptor(variable)) {
        res[1].push(variable.resolveDynamicClassNames);
        res[0].push(variable.staticStyle);
      } else {
        res[0].push(variable);
      }
      return res;
    },
    [[], []],
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
  return createCssDescriptor(styles, styleVariables, resolveDynamicClassNames);
};

const renderWithClassNames = <T extends { className?: string }>(
  Component: ComponentType<T>,
) => (mappedProps: Partial<T>) => (
  styles: TemplateStringsArray,
  ...variables: CompositeStyle<T>[]
) => {
  const { resolveDynamicClassNames, className } = resolveClassNames<T>(
    mappedProps,
  )(styles, ...variables);
  return (props: T) => {
    const dynamicClassNames = resolveDynamicClassNames(props);
    return (
      <Component
        {...props}
        className={cn(props.className, className, dynamicClassNames)}
      />
    );
  };
};

let styled = (((Component: ComponentType) =>
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
  )) as unknown) as Styled;

styled.button = styled('button');
styled.input = styled('input');
styled.a = styled('a');
styled.span = styled('span');
styled.p = styled('p');
styled.div = styled('div');

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
});

const cssDescriptorCreator = (
  styles: TemplateStringsArray,
  ...args: any[]
): CssDescriptor<any> => createCssDescriptor(styles, [...args], () => '');
export { cssDescriptorCreator as css };
export default styled;
