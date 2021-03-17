import { ComponentProps } from 'react';
import styled from '@emotion/styled';
import { UI } from '@types';

export const Dot = styled.span<ComponentProps<UI['Dot']>>(({ background }) => ({
  borderRadius: '50%',
  background: background || 'red',
  display: 'inline-block',
  width: 7,
  height: 7,
}));
