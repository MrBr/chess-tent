import React from 'react';
import { components, ui } from '@application';
import { Components } from '@types';
import { isLessonTraining } from '../service';

const { TrainingCard } = components;
const { Container, Row, Col, Headline3 } = ui;

const LessonTrainings: Components['LessonTrainings'] = ({ trainings }) => {
  const lessonTrainings = trainings.filter(isLessonTraining);

  if (lessonTrainings.length === 0) {
    return null;
  }

  return (
    <Container fluid>
      <Headline3>Practice on your own</Headline3>
      <Row>
        {lessonTrainings.map(lesson => (
          <Col md={6} xs={12} className="mb-4" key={lesson.id}>
            <TrainingCard training={lesson} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default LessonTrainings;
