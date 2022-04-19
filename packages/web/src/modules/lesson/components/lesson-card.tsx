import React from 'react';
import { ui } from '@application';
import { Lesson } from '@chess-tent/models';
import { css } from '@chess-tent/styled-props';

import LessonThumbnail from './thumbnail';

const { Headline6, Text, Card, Row, Col, Line } = ui;

const { className } = css`
  width: 300px;
  height: 345px;

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
          <Text className="m-0 mb-1" fontSize="extra-small">
            {lesson.difficulty || 'TRAINING'}
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Headline6 className="m-0 mb-3">{lesson.state.title}</Headline6>
        </Col>
      </Row>
      <Row className="mb-2">
        <Text fontSize="extra-small" className="mb-0">
          {lesson.published
            ? 'Finalize the lesson'
            : `${lesson.state.chapters.length} chapters`}
        </Text>
      </Row>
      <Line className="mb-2" />
      <Row className="g-0">
        <Col xs={8}>{lesson.published ? 'Published' : 'Draft'}</Col>
      </Row>
    </Card.Body>
  </Card>
);

export default LessonCard;
