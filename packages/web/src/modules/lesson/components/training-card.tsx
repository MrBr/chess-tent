import React from 'react';
import { LessonActivity } from '@types';
import { hooks, ui } from '@application';
import LessonThumbnail from './thumbnail';

const { Row, Col, Headline6, Text } = ui;
const { useHistory } = hooks;

export default (props: { training: LessonActivity }) => {
  const lesson = props.training.subject;
  const history = useHistory();
  return (
    <Row
      noGutters
      onClick={() => history.push(`/activity/${props.training.id}`)}
      className="cursor-pointer"
    >
      <Col className="col-auto mr-2">
        <LessonThumbnail difficulty={lesson.difficulty} size="small" />
      </Col>
      <Col>
        <Headline6 className="mt-2 ml-2 m-0">{lesson.state.title}</Headline6>
        <Text className="ml-2" fontSize="extra-small">
          {lesson.difficulty}
        </Text>
      </Col>
    </Row>
  );
};
