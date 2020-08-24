import React from 'react';
import { ActivityComponent, LessonActivity } from '@types';
import { components, ui } from '@application';

const { Container, Row, Col } = ui;
const { StepRenderer } = components;

const Activity: ActivityComponent<LessonActivity> = ({ activity }) => {
  const lesson = activity.subject;
  const activeStep = activity.subject.state.steps[0];

  return (
    <>
      <Container fluid>
        <Row noGutters>
          <Col>
            <StepRenderer<'Playground'>
              step={activeStep}
              component="Playground"
              activeStep={activeStep}
              lesson={lesson}
              setActiveStep={() => {}}
              nextStep={() => {}}
              prevStep={() => {}}
            />
          </Col>
          <Col sm={3}>Analysis</Col>
        </Row>
      </Container>
    </>
  );
};

export default Activity;
