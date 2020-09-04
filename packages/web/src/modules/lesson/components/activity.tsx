import React, { useCallback, useMemo } from 'react';
import { ActivityComponent, LessonActivity } from '@types';
import { components, hooks, state, ui } from '@application';
import {
  getLessonNextStep,
  getLessonPreviousStep,
  getLessonStep,
  getLessonStepIndex,
  getLessonStepsCount,
} from '@chess-tent/models';

const { Container, Row, Col, Button } = ui;
const { StepRenderer, Chessboard } = components;
const { useDispatchBatched, useLocation } = hooks;
const {
  actions: { updateActivityState, setActivityActiveStep },
} = state;

const Footer = ({
  next,
  prev,
  currentStep,
  stepsCount,
}: {
  next: () => void;
  prev: () => void;
  stepsCount: number;
  currentStep: number;
}) => {
  return (
    <Container>
      <div>
        {currentStep}/{stepsCount}
      </div>
      <Button onClick={prev}>Prev</Button>
      <Button onClick={next}>Next</Button>
    </Container>
  );
};

const Activity: ActivityComponent<LessonActivity> = ({ activity }) => {
  const dispatch = useDispatchBatched();
  const lesson = activity.subject;
  const location = useLocation();
  const activeStepId =
    new URLSearchParams(location.search).get('activeStep') ||
    activity.subject.state.steps[0].id;
  const activeStep = getLessonStep(lesson, activeStepId);
  const activeStepActivityState = activity.state[activeStep.id] || {};

  const stepsCount = useMemo(() => getLessonStepsCount(lesson), [lesson]);
  const currentStepIndex = useMemo(
    () => getLessonStepIndex(lesson, activeStep),
    [lesson, activeStep],
  );

  const setStepActivityState = useCallback(
    state => {
      dispatch(updateActivityState(activity, { [activeStep.id]: state }));
    },
    [activity, dispatch, activeStep.id],
  );

  const nextActivityStep = useCallback(() => {
    const nextStep = getLessonNextStep(lesson, activeStep);
    nextStep && dispatch(setActivityActiveStep(activity, nextStep));
  }, [activity, activeStep, dispatch, lesson]);

  const prevActivityStep = useCallback(() => {
    const prevStep = getLessonPreviousStep(lesson, activeStep);
    prevStep && dispatch(setActivityActiveStep(activity, prevStep));
  }, [activity, activeStep, dispatch, lesson]);

  return (
    <Container fluid>
      <Row noGutters>
        <Col>
          <StepRenderer<'Playground'>
            step={activeStep}
            component="Playground"
            activeStep={activeStep}
            lesson={lesson}
            setActiveStep={() => {}}
            setStepActivityState={setStepActivityState}
            stepActivityState={activeStepActivityState}
            nextStep={nextActivityStep}
            prevStep={prevActivityStep}
            Chessboard={Chessboard}
            footer={
              <Footer
                next={nextActivityStep}
                prev={prevActivityStep}
                stepsCount={stepsCount}
                currentStep={currentStepIndex}
              />
            }
          />
        </Col>
        <Col sm={3}>Analysis</Col>
      </Row>
    </Container>
  );
};

export default Activity;
