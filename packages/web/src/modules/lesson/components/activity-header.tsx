import React from 'react';
import { ui } from '@application';
import { Lesson } from '@chess-tent/models';

const { Avatar, Headline3, Text } = ui;

export default ({ lesson }: { lesson: Lesson }) => (
  <>
    <Headline3 className="mt-0 mb-0">{lesson.state.title}</Headline3>
    <Text className="mb-4">
      <Avatar src={lesson.owner.imageUrl} size="extra-small" />
      <Text inline className="ml-2" fontSize="extra-small">
        {lesson.owner.name}
      </Text>
    </Text>
  </>
);
