import React, { ComponentType } from 'react';
import { css } from '@emotion/css';
import cn from 'classnames';
import {
  CssDescriptor,
  DynamicCssDescriptor,
  CompositeStyle,
  CLASSNAME_MAP,
  Styled,
  StyledProxyTarget,
} from '../types';

function isCssDescriptor(compositeStyle: any): compositeStyle is CssDescriptor {
  return !!compositeStyle?.className;
}

const resolveClassNames = <T extends { className?: string }>(
  mappedProps: Partial<T>,
) => (styles: TemplateStringsArray, ...variables: CompositeStyle<T>[]) => {
  const [styleVariables, compositeStyles] = variables.reduce<
    [any[], (DynamicCssDescriptor<T> | CssDescriptor)[]]
  >(
    (res, variable) => {
      if (isCssDescriptor(variable) || typeof variable === 'function') {
        res[1].push(variable);
      } else {
        res[0].push(variable);
      }
      return res;
    },
    [[], []],
  );
  const className = css(styles, ...styleVariables);
  console.log(className);
  return (props: T) => {
    const dynamicClassNames = {} as Record<string, string | boolean>;
    for (const key in mappedProps) {
      const value = props[key];
      const propClassName = typeof value === 'string' ? value : key;
      dynamicClassNames[propClassName] =
        typeof value === 'string' ? value : !!value;
    }
    const compositeClassNames = compositeStyles.map(compositeStyle =>
      typeof compositeStyle === 'function'
        ? compositeStyle(props).className
        : compositeStyle.className,
    );
    console.log(compositeClassNames);
    return {
      className: cn(
        className,
        dynamicClassNames,
        props.className,
        ...compositeClassNames,
      ),
    };
  };
};

const renderWithClassNames = <T extends { className?: string }>(
  Component: ComponentType<T>,
) => (mappedProps: Partial<T>) => (
  styles: TemplateStringsArray,
  ...variables: CompositeStyle<T>[]
) => {
  const resolveClassNameCached = resolveClassNames(mappedProps)(
    styles,
    ...variables,
  );
  return (props: T) => {
    const { className } = resolveClassNameCached(props);
    return <Component {...props} className={className} />;
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
    }
    return Reflect.get(target, p, receiver);
  },
});

const cssDescriptorCreator = (
  style: TemplateStringsArray,
  ...args: any[]
): CssDescriptor => ({
  className: css(style, ...args),
});
export { cssDescriptorCreator as css };
export default styled;
