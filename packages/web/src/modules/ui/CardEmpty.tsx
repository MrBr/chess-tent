import React, { ComponentProps } from 'react';
import styled from '@chess-tent/styled-props';
import { UI } from '@types';

import Card from './Card';
import Icon from './Icon';
import { Text, Headline5 } from './Text';
import { Button } from './Button';

const CardEmpty = styled<ComponentProps<UI['CardEmpty']>>(
  ({ className, title, subtitle, cta }) => {
    return (
      <Card className={className}>
        <Card.Body>
          <Icon type="search" />
          <Headline5>{title}</Headline5>
          <Text fontSize="extra-small">{subtitle}</Text>
          <Button variant="ghost">{cta}</Button>
        </Card.Body>
      </Card>
    );
  },
).css`` as UI['CardEmpty'];

export default CardEmpty;
