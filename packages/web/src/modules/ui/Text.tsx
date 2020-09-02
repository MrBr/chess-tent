import React, { FunctionComponent } from 'react';
import styled, { CSSObject } from '@emotion/styled';
import { TextProps } from '@types';

const headingStyle = {
  margin: '2.75rem 0 1.05rem',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700,
  lineHeight: 1.21,
};

const fontSize = (props: TextProps) => {
  switch (props.fontSize) {
    case 'small':
      return '0.875em';
    case 'extra-small':
      return '0.707em';
    default:
      // base
      return '1em';
  }
};

const textDynamicStyle = (props: TextProps): CSSObject => ({
  fontWeight: props.weight || 400,
  textAlign: props.align || 'left',
  fontSize: fontSize(props),
});

const Text = styled<FunctionComponent<TextProps>>(
  ({ children, className, inline }) =>
    inline ? (
      <span className={className}>{children}</span>
    ) : (
      <p className={className}>{children}</p>
    ),
)(
  {
    marginBottom: '1.15rem',
  },
  textDynamicStyle,
);

const Display1 = styled.p(headingStyle, { fontSize: '5.653em' }); // 90
const Display2 = styled.p(headingStyle, { fontSize: '3.998em' }); // 64
const Headline1 = styled.h1(headingStyle, { fontSize: '2.827em' }); // 45
const Headline2 = styled.h2(headingStyle, { fontSize: '1.999em' }); // 32
const Headline3 = styled.h3(headingStyle, { fontSize: '1.444em' }); // 23
const Headline4 = styled.h4(headingStyle, { fontSize: '1.125em' }); // 18
const Headline5 = styled.h4(headingStyle, { fontSize: '1em' }); // 16
const Headline6 = styled.h4(headingStyle, { fontSize: '0.875em' }); // 14

export {
  Text,
  Display1,
  Display2,
  Headline1,
  Headline2,
  Headline3,
  Headline4,
  Headline5,
  Headline6,
};
