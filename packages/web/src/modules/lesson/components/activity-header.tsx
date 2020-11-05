import React from 'react';
import { components, ui } from '@application';
import { Lesson } from '@chess-tent/models';

const { Headline3, Text } = ui;
const { UserAvatar } = components;

export default ({ lesson }: { lesson: Lesson }) => (
  <>
    <Headline3 className="mt-0 mb-0">{lesson.state.title}</Headline3>
    <Text className="mb-4">
      <UserAvatar user={lesson.owner} size="extra-small" />
      <Text inline className="ml-2" fontSize="extra-small">
        {lesson.owner.name}
      </Text>
    </Text>
  </>
);
