import React, { ComponentProps } from 'react';
import { ui } from '@application';
import styled from '@chess-tent/styled-props';

import { formatMessageLinks } from '../utils';

const { Text } = ui;

const Message = styled<ComponentProps<typeof Text> & { variant?: 'tertiary' }>(
  ({ children, ...props }) => {
    const formattedMessage =
      typeof children === 'string'
        ? formatMessageLinks(children as string)
        : children;
    return <Text {...props}>{formattedMessage}</Text>;
  },
).props.variant.css`
  background: var(--grey-300-color);
  border-radius: 8px;
  padding: 0.25em 0.5em;
  align-self: end;
  
  &.tertiary {
    background: var(--black-color);
    color: var(--light-color);
  }
`;

Message.defaultProps = {
  fontSize: 'small',
};

export default Message;
