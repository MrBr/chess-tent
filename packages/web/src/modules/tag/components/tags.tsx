import React from 'react';
import { Components } from '@types';
import styled from '@chess-tent/styled-props';
import { ui } from '@application';

const { Text } = ui;

const Tags = styled<Components['Tags']>(({ tags, className }) => {
  if (!tags) {
    return null;
  }

  return (
    <>
      {tags.map(({ text, id }) => (
        <Text inline className={className} key={id} fontSize="small">
          {text}
        </Text>
      ))}
    </>
  );
}).props.inline.css`
  margin: 0;
  margin-right: 0.5rem;
  text-transform: uppercase;
  
  :before {
    content: "";
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--grey-500-color);
    overflow: hidden;
    margin-right: 0.5rem;
    margin-bottom: 5px;
    display: inline-block;
  }
  &:first-child:before {
    display: none;
  }
  &.inline:first-child:before {
    display: inline-block;
  }
  :last-child {
    margin-right: 0;
  }
`;

export default Tags;
