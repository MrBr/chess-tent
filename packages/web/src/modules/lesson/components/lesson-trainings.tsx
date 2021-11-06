import React from 'react';
import { components, ui, hooks } from '@application';
import { Components } from '@types';
import { isLessonTraining } from '../service';

const { TrainingCard } = components;
const { Container, Row, Col, Headline3 } = ui;
const { useCoaches, useStudents } = hooks;

const LessonTrainings: Components['LessonTrainings'] = ({
  trainings,
  user,
}) => {
  // If no related user with the lesson is my coach then
  // this is just a standalone lesson which user solves on its own
  const { value: coaches } = useCoaches(user);
  const { value: students } = useStudents(user);
  const lessonTrainings = trainings.filter(training =>
    isLessonTraining(training, [...(students || []), ...(coaches || [])], user),
  );

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
