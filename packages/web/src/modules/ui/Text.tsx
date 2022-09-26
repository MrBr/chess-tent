import React, { ComponentType } from 'react';
import styled, { css } from '@chess-tent/styled-props';
import { TextProps } from '@types';
import { withHtml } from './hoc';
import { mobileCss } from './enhancers';

const inherit = styled.props.inherit.css`
 &.inherit {
    font-size: inherit;
    color: inherit;
    line-height: inherit;
    font-family: inherit;
    font-weight: inherit;
    display: inline;
  }
`;

const size = styled.props.fontSize.css`
  line-height: 1.5;
  font-size: 20px;

  &.large {
    font-size: 24px;
  }

  &.small {
    font-size: 18px;
  }

  &.extra-small {
    font-size: 16px;
  }

 ${mobileCss`
   font-size: 18px;

   &.large {
     font-size: 20px;
   }

   &.small {
     font-size: 16px;
   }

   &.extra-small {
     font-size: 14px;
   }
 `}
`;

const color = styled.props.color.css`
  &.primary {
    color: var(--primary-color);
  }

  &.secondary {
    color: var(--secondary-color);
  }

  &.black {
    color: var(--black-color);
  }
  
  &.grey {
    color: var(--grey-700-color);
  }

  &.light {
    color: var(--light-color);
  }

  &.error {
    color: var(--error-color);
  }

  color: var(--grey-800-color);
`;

const dynamicStyle = (props: TextProps) =>
  css`
    font-weight: ${props.weight || 300};
    text-align: ${props.align || 'left'};
  `;

const BaseText: ComponentType<TextProps> = withHtml<TextProps>(
  ({ inline, inherit, html, as, ...textProps }) => {
    const Component = as || (inherit || inline ? 'span' : 'p');
    return <Component {...textProps} />;
  },
);

const Text = styled(BaseText).css<TextProps>`
  ${dynamicStyle}
  ${inherit}
  ${color}
  ${size}
`;

const headingStyle = styled.css<TextProps>`
  font-family: Inter, sans-serif;
  line-height: 1.21;
  ${inherit}
  ${color}
  ${dynamicStyle}
`;

const Hero = styled(BaseText).css`
  font-size: 60px;

  ${headingStyle}
  ${mobileCss`
    font-size: 48px;
  `}
`;

Hero.defaultProps = {
  color: 'black',
  weight: 700,
};

const Headline1 = styled(BaseText).css`
  font-size: 56px;
  
    ${headingStyle}
  ${mobileCss`
    font-size: 32px;
  `}
`;
Headline1.defaultProps = {
  as: 'h1',
  color: 'black',
  weight: 700,
};

const Headline2 = styled(BaseText).css`
  font-size: 48px;
  
  ${headingStyle}
  ${mobileCss`
    font-size: 24px;
  `}
`;
Headline2.defaultProps = {
  as: 'h2',
  color: 'black',
  weight: 700,
};

const Headline3 = styled(BaseText).css`
  font-size: 40px;
  
  ${headingStyle}
  ${mobileCss`
    font-size: 22px;
  `}
`;
Headline3.defaultProps = {
  as: 'h3',
  color: 'black',
  weight: 700,
};

const Headline4 = styled(BaseText).css`
  font-size: 32px;
  
  ${headingStyle}
  ${mobileCss`
    font-size: 18px;
  `}
`;
Headline4.defaultProps = {
  as: 'h4',
  color: 'black',
  weight: 700,
};

const Headline5 = styled(BaseText).css`
  font-size: 24px;
  
  ${headingStyle}
  ${mobileCss`
    font-size: 16px;
  `}
`;
Headline5.defaultProps = {
  as: 'h5',
  color: 'black',
  weight: 700,
};

const Headline6 = styled(BaseText).css`
  font-size: 18px;
  
  ${headingStyle}
  ${mobileCss`
    font-size: 16px;
  `}
`;
Headline6.defaultProps = {
  as: 'h6',
  color: 'black',
  weight: 700,
};

export {
  Text,
  Hero,
  Headline1,
  Headline2,
  Headline3,
  Headline4,
  Headline5,
  Headline6,
};
