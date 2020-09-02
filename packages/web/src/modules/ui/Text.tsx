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

const Display1 = styled.p(headingStyle, { fontSize: '5.653em' });
const Display2 = styled.p(headingStyle, { fontSize: '3.998em' });
const Headline1 = styled.h1(headingStyle, { fontSize: '2.827em' });
const Headline2 = styled.h2(headingStyle, { fontSize: '1.999em' });
const Headline3 = styled.h3(headingStyle, { fontSize: '1.414em' });
const Headline4 = styled.h4(headingStyle, { fontSize: '1.125em' });

export { Text, Display1, Display2, Headline1, Headline2, Headline3, Headline4 };
