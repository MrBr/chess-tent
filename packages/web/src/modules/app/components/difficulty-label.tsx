import React from 'react';
import { ui } from '@application';
import { Components, Icons } from '@types';
import { Difficulty } from '@chess-tent/models';

const { Icon, Text } = ui;

const getDifficultyIconName = (difficulty: Difficulty): Icons => {
  switch (difficulty) {
    case Difficulty.BEGINNER:
      return 'beginner';
    case Difficulty.INTERMEDIATE:
      return 'intermediate';
    case Difficulty.ADVANCED:
      return 'advanced';
    default:
      throw new Error('Unknown difficulty');
  }
};

const DifficultyLabel: Components['DifficultyLabel'] = ({ difficulty }) => {
  if (!difficulty) {
    return null;
  }

  const icon = getDifficultyIconName(difficulty);
  return (
    <Text className="text-uppercase m-0" fontSize="small" inline>
      <Icon type={icon} textual /> {difficulty}
    </Text>
  );
};

export default DifficultyLabel;
