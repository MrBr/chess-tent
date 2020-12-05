import React from 'react';
import { hooks, ui } from '@application';
import { Lesson } from '@chess-tent/models';
import LessonThumbnail from './thumbnail';

const { Headline5, Text, Card, Container } = ui;
const { useHistory } = hooks;

const LessonCard: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  const history = useHistory();

  return (
    <Card
      onClick={() => history.push(`/lesson/${lesson.id}`)}
      className="cursor-pointer mb-4 shadow-none"
    >
      <LessonThumbnail size="large" difficulty={lesson.difficulty} />
      <Headline5 className="mt-2 mb-2">{lesson.state.title}</Headline5>
      <Text fontSize="extra-small" weight={700} className="mb-1">
        {lesson.difficulty}
      </Text>
      <Container>
        {lesson.tags?.map(({ text }) => (
          <Text fontSize="extra-small" inline className="mr-1" weight={700}>
            {text}
          </Text>
        ))}
      </Container>
    </Card>
  );
};

export default LessonCard;
