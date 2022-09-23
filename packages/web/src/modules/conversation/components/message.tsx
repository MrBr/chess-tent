import React, { ComponentProps } from 'react';
import { ui } from '@application';
import styled from '@chess-tent/styled-props';

import { formatMessageLinks } from '../utils';

const { Text } = ui;

const Message = styled<ComponentProps<typeof Text>>(
  ({ children, ...props }) => {
    const formattedMessage =
      typeof children === 'string'
        ? formatMessageLinks(children as string)
        : children;
    return (
      <Text weight={300} {...props}>
        {formattedMessage}
      </Text>
    );
  },
).props.owner.css<{ owner?: boolean }>`
  ${{ omitProps: ['owner'] }}
  background: var(--grey-300-color);
  border-radius: 8px;
  padding: 0.5em 0.5em;
  align-self: end;
  max-width: 100%;
  word-break: break-word;
  
  a {
    color: inherit;
  }
  
  &:not(.owner) {
    background: var(--black-color);
    color: var(--light-color);
  }
`;

Message.defaultProps = {
  fontSize: 'small',
};

export default Message;
