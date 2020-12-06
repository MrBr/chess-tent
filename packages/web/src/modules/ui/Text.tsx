import React, { ComponentProps, FunctionComponent } from 'react';
import styled, { CSSObject } from '@emotion/styled';
import { TextProps, UI } from '@types';

const headingStyle = {
  margin: '2.75rem 0 1.05rem',
  fontFamily: 'Inter, sans-serif',
  lineHeight: 1.21,
};

const fontSize = (props: TextProps) => {
  switch (props.fontSize) {
    case 'display1':
      return '5.653em';
    case 'display2':
      return '3.998em';
    case 'headline1':
      return '2.827em';
    case 'headline2':
      return '1.999em';
    case 'headline3':
      return '1.444em';
    case 'headline4':
      return '1.125em';
    case 'headline5':
      return '1em';
    case 'headline6':
      return '0.875em';
    case 'small':
      return '0.875em';
    case 'extra-small':
      return '0.707em';
    default:
      // base
      return '1em';
  }
};

const fontColor = (props: TextProps) => {
  switch (props.color) {
    case 'title':
      return '#182235';
    case 'subtitle':
      return '#2F3849';
    case 'alt-title':
      return 'rgba(255,255,255,1)';
    case 'alt-subtitle':
      return 'rgba(255,255,255,0.8)';
    case 'alt':
      return 'rgba(255,255,255,0.8)';
    default:
      // base
      return '#747A86';
  }
};

const textDynamicStyle = (props: TextProps): CSSObject => ({
  fontWeight: props.weight || 400,
  textAlign: props.align || 'left',
  fontSize: fontSize(props),
  color: fontColor(props),
});

const Text = styled<FunctionComponent<TextProps>>(
  ({ children, className, onClick, inline, contentEditable }) =>
    inline ? (
      <span
        className={className}
        onClick={onClick}
        contentEditable={contentEditable}
      >
        {children}
      </span>
    ) : (
      <p
        className={className}
        onClick={onClick}
        contentEditable={contentEditable}
      >
        {children}
      </p>
    ),
)(
  {
    marginBottom: '0.5rem',
  },
  textDynamicStyle,
);

const Display1 = styled(Text)(headingStyle); // 90
Display1.defaultProps = {
  color: 'title',
  fontSize: 'display1',
  weight: 700,
};
const Display2 = styled(Text)(headingStyle); // 64
Display2.defaultProps = {
  color: 'title',
  fontSize: 'display2',
  weight: 700,
};
const Headline1 = styled(Text)(headingStyle); // 45
Headline1.defaultProps = {
  color: 'title',
  fontSize: 'headline1',
  weight: 700,
};
const Headline2 = styled(Text)(headingStyle); // 32
Headline2.defaultProps = {
  color: 'title',
  fontSize: 'headline2',
  weight: 700,
};
const Headline3 = styled(Text)(headingStyle); // 23
Headline3.defaultProps = {
  color: 'title',
  fontSize: 'headline3',
  weight: 700,
};
const Headline4 = styled(Text)(headingStyle); // 18
Headline4.defaultProps = {
  color: 'title',
  fontSize: 'headline4',
  weight: 700,
};
const Headline5 = styled(Text)(headingStyle); // 16
Headline5.defaultProps = {
  color: 'title',
  fontSize: 'headline5',
  weight: 700,
};
const Headline6 = styled(Text)(headingStyle); // 14
Headline6.defaultProps = {
  color: 'title',
  fontSize: 'headline6',
  weight: 700,
};

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
