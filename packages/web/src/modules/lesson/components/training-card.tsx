import React from 'react';
import { LessonActivity } from '@types';
import { ui } from '@application';
import LessonThumbnail from './thumbnail';

const { Row, Col, Headline6 } = ui;

export default (props: { training: LessonActivity }) => {
  const lesson = props.training.subject;
  return (
    <Row noGutters>
      <Col className="col-auto mr-2">
        <LessonThumbnail difficulty={lesson.difficulty} size="small" />
      </Col>
      <Col>
        <Headline6 className="mt-0">{lesson.state.title}</Headline6>
      </Col>
    </Row>
  );
};
