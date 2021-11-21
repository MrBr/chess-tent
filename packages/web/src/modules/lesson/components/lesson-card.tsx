import React from 'react';
import { ui } from '@application';
import { Lesson } from '@chess-tent/models';
import LessonThumbnail from './thumbnail';

const { Headline5, Text, Card, Container, Tag, Absolute } = ui;

const LessonCard: React.FC<{
  lesson: Lesson;
  onClick: (lesson: Lesson) => void;
  owned?: boolean;
}> = ({ lesson, onClick, owned }) => (
  <Card
    key={lesson.id}
    onClick={() => onClick(lesson)}
    className="cursor-pointer mb-4 shadow-none"
  >
    {owned && (
      <Absolute left={10} top={10}>
        <Tag variant="light" className="p-2">
          <Text inline>Owned</Text>
        </Tag>
      </Absolute>
    )}
    <LessonThumbnail size="large" difficulty={lesson.difficulty} />
    <Headline5 className="mt-2 mb-2">{lesson.state.title}</Headline5>
    <Text fontSize="extra-small" weight={700} className="mb-1">
      {lesson.difficulty}
    </Text>
    <Container className="pl-0">
      {lesson.tags?.map(({ text, id }) => (
        <Tag pill key={id} variant="success" className="mr-1">
          <Text fontSize="extra-small" inline weight={700} color="inherit">
            {text}
          </Text>
        </Tag>
      ))}
    </Container>
  </Card>
);

export default LessonCard;
