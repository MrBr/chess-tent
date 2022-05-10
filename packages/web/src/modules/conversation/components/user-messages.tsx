import { ComponentProps } from 'react';
import { ui } from '@application';
import styled from '@chess-tent/styled-props';

const { Text } = ui;

const UserMessages = styled<
  ComponentProps<typeof Text> & { variant?: 'tertiary' }
>(Text).props.variant.css`
  background: var(--grey-300-color);
  border-radius: 8px;
  padding: 0.25em 0.5em;
  align-self: end;
  
  &.tertiary {
    background: var(--black-color);
    color: var(--light-color);
  }
`;

UserMessages.defaultProps = {
  fontSize: 'small',
};

export default UserMessages;
