import React from 'react';
import { ui } from '@application';
import { Components } from '@types';
import TemplateCard from './template-card';

const { Row, Col } = ui;

const TemplateBrowser: Components['LessonTemplates'] = ({
  lessons,
  onLessonClick,
}) => {
  if (!lessons) {
    return null;
  }

  return (
    <Row>
      {lessons.map(lesson => (
        <Col key={lesson.id} className="col-auto mb-4">
          <TemplateCard lesson={lesson} onClick={onLessonClick} />
        </Col>
      ))}
    </Row>
  );
};

export default TemplateBrowser;
