import React from 'react';
import { components, ui } from '@application';
import { Lesson } from '@chess-tent/models';

const { Headline3, Text, Container } = ui;
const { UserAvatar } = components;

export default ({ lesson }: { lesson: Lesson }) => (
  <>
    <Headline3 className="mt-0 mb-0">{lesson.state.title}</Headline3>
    <Container className="mb-4 p-0">
      <UserAvatar user={lesson.owner} size="extra-small" />
      <Text as="span" className="ml-2" fontSize="extra-small">
        {lesson.owner.name}
      </Text>
    </Container>
  </>
);
