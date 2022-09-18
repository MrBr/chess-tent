import React from 'react';
import { components, ui } from '@application';
import { Lesson } from '@chess-tent/models';
import { css } from '@chess-tent/styled-props';

import LessonThumbnail from './thumbnail';

const { Headline6, Text, Card, Row, Col } = ui;
const { UserAvatar } = components;

const { className } = css`
  width: 300px;
  height: 300px;

  .thumbnail-container {
    height: 165px;
    width: 100%;
    position: relative;
  }
`;

const LessonCard: React.FC<{
  lesson: Lesson;
  onClick?: (lesson: Lesson) => void;
  owned?: boolean;
}> = ({ lesson, onClick }) => (
  <Card
    key={lesson.id}
    onClick={() => onClick && onClick(lesson)}
    className={className}
  >
    <Card.Body>
      <Row className="g-0 mb-3">
        <Col className="thumbnail-container">
          <LessonThumbnail stepRoot={lesson.state.chapters[0]} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Text className="m-0 mb-1" fontSize="extra-small" weight={400}>
            {lesson.difficulty}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Headline6 className="m-0 mb-2 text-truncate">
            {lesson.state.title}
          </Headline6>
        </Col>
      </Row>
      <Row className="g-0">
        <Col className="col-auto me-2">
          <UserAvatar user={lesson.owner} size="extra-small" />
        </Col>
        <Col>
          <Text fontSize="extra-small" weight={400}>
            {lesson.owner.name}
          </Text>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

export default LessonCard;
