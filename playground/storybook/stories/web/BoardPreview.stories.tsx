import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Components } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'Components/ChessboardPreview',
} as ComponentMeta<Components['ChessboardPreview']>;

export const Default: ComponentStory<Components['ChessboardPreview']> =
  withWebNamespace('components', (args, { ChessboardPreview }) => {
    return (
      <ChessboardPreview fen="rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2" />
    );
  });
