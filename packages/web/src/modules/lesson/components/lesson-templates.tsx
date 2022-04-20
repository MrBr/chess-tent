import React, { useCallback } from 'react';
import { hooks, ui } from '@application';
import { Components } from '@types';
import { Lesson } from '@chess-tent/models';
import LessonCard from '../components/lesson-card';

const { Row, Col } = ui;
const { useHistory } = hooks;

const LessonTemplates: Components['LessonTemplates'] = ({ lessons }) => {
  const history = useHistory();

  const handleLessonClick = useCallback(
    (lesson: Lesson) => {
      history.push(`/lesson/${lesson.id}`);
    },
    [history],
  );

  return (
    <Row>
      {lessons?.map(lesson => (
        <Col key={lesson.id} className="col-auto">
          <LessonCard lesson={lesson} onClick={handleLessonClick} />
        </Col>
      ))}
    </Row>
  );
};

export default LessonTemplates;
