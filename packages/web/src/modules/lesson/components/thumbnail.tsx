import React from 'react';
import { ui } from '@application';
import { Difficulty } from '@chess-tent/models';
import styled from '@emotion/styled';

import lessonBeginner from '../images/lesson-beginner.svg';
import lessonIntermediate from '../images/lesson-intermediate.svg';
import lessonAdvanced from '../images/lesson-advanced.svg';

const { Img } = ui;

const difficultyImages = {
  [Difficulty.BEGINNER]: lessonBeginner,
  [Difficulty.INTERMEDIATE]: lessonIntermediate,
  [Difficulty.ADVANCED]: lessonAdvanced,
};

export default styled(
  ({
    difficulty,
    className,
  }: {
    className?: string;
    difficulty: Difficulty;
    size?: 'small';
  }) => {
    return <Img className={className} src={difficultyImages[difficulty]} />;
  },
)(({ size }) =>
  size
    ? {
        width: 64,
        height: 64,
        objectFit: 'cover',
        borderRadius: 16,
      }
    : undefined,
);