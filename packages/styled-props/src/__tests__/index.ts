import styled, { css, resolveClassNames } from '../index';
import { COMPONENT_CLASSNAME } from '../../types';

type TestProps = {
  color: string;
  size: string;
  className?: string;
};

describe('styled', () => {
  test('creates single class for static style', () => {
    const color = styled.props.color.css`
          &.black {
            color: black;
          }
        `;
    const size = styled.props.size.css`
          &.large {
            fontSize: black;
          }
        `;
    const { className } = resolveClassNames<TestProps>({})`
    background: red;
    ${color}
    ${size}
    `;

    expect(className.split(' ').length).toBe(1);
  });
  test('creates an extra class for dynamic style', () => {
    const color = styled.css<TestProps>`
      &.black {
        ${props =>
          css`
            color: ${props.color};
          `}
      }
    `;
    const size = styled.props.size.css`
          &.large {
            fontSize: black;
          }
        `;
    const { resolveDynamicClassNames } = resolveClassNames<TestProps>({})`
    background: red;
    ${color}
    ${size}
    `;

    const classNames = resolveDynamicClassNames({
      color: 'black',
      size: 'large',
    });

    expect(classNames.split(' ').length).toBe(3);
  });
  test('nested component style', () => {
    const color = styled.a.css<TestProps>`
          color: red;
        `;
    const size = styled.props.size.css`
          ${color} {
            color: black;
          }
        `;

    expect(size.staticStyle).toMatch(
      new RegExp(color[COMPONENT_CLASSNAME] as string),
    );
    expect(size.staticStyle).toMatch('black');
  });
  test('maps props to classes', () => {
    const color = styled.props.color.css<TestProps>`
          &.black {
            fontSize: black;
          }
        `;
    const size = styled.props.size.css`
          &.large {
            fontSize: black;
          }
        `;
    const { resolveDynamicClassNames } = resolveClassNames<TestProps>({})`
    background: red;
    ${color}
    ${size}
    `;

    const classNames = resolveDynamicClassNames({
      color: 'black',
      size: 'large',
    });

    expect(classNames).toMatch('black large');
  });
  test('styled.css wrapper works', () => {
    const mobileWrapper = (style: TemplateStringsArray) => styled.css`
      @media screen and (max-width: 768px) {
        ${style}
      }
    `;
    const { staticStyle } = resolveClassNames<TestProps>(
      {},
    )`  base${mobileWrapper`  mobile`}
    `;

    expect(staticStyle).toMatch(/(?=[\s\S]*base)(?=[\s\S]*mobile)/gm);
  });
  test('css wrapper works', () => {
    const mobileWrapper = (style: TemplateStringsArray) => css`
      @media screen and (max-width: 768px) {
        ${style}
      }
    `;
    const { staticStyle } = resolveClassNames<TestProps>({})`
    base 
      ${mobileWrapper`
          mobile 
      `}
    `;
    expect(staticStyle).toMatch(/(?=[\s\S]*base)(?=[\s\S]*mobile)/gm);
  });
});
