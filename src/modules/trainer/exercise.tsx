import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import uuid from 'uuid/v1';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { getStep, getStepComponent } from '../app';
import {
  Exercise,
  Section,
  StepInstance,
  StepModuleComponentKey,
  StepProps,
} from '../app/types';
import {
  addSectionChildAction,
  exerciseSelector,
  setExerciseActiveStepAction,
  updateEntitiesAction,
} from './redux';
import { Stepper } from './step';
import {
  createExercise,
  createSection,
  getActiveStepSection,
  getExercisePreviousStep,
} from './service';
import { useDispatchBatched } from '../app/hooks';
import { START_FEN } from '../chessboard';

const Step: FunctionComponent<StepProps<
  any,
  {
    component: StepModuleComponentKey;
  }
>> = ({ component, step, ...stepProps }) => {
  const Step = getStep(step.type);
  const Component = getStepComponent(Step, component);
  return <Component key={step.id} step={step} {...stepProps} />;
};

const ExerciseComponent = () => {
  const dispatch = useDispatchBatched();

  useEffect(() => {
    const defaultStep: StepInstance = getStep('description').createStep(
      uuid(),
      START_FEN,
    );
    const defaultSection = createSection(uuid(), [defaultStep]);
    const defaultExercise: Exercise = createExercise(
      '1',
      defaultSection,
      defaultStep,
    );
    dispatch(updateEntitiesAction(defaultExercise));
  }, [dispatch]);
  const exercise = useSelector<any, any>(exerciseSelector('1'));
  const { section, activeStep } = exercise || {};

  const prevStep = exercise && getExercisePreviousStep(exercise, activeStep);
  const prevPosition = useMemo(
    () =>
      prevStep
        ? getStep(prevStep.type).getEndSetup(prevStep).position
        : START_FEN,
    [prevStep],
  );

  const addSection = useCallback(() => {
    const activeSection = getActiveStepSection(exercise);
    const activeStepPosition = getStep(activeStep.type).getEndSetup(activeStep)
      .position;
    const newStep: StepInstance = getStep('description').createStep(
      uuid(),
      activeStepPosition,
    );
    const newSection: Section = {
      id: uuid(),
      children: [newStep],
      schema: 'sections',
    };
    dispatch(
      updateEntitiesAction(newSection),
      addSectionChildAction(activeSection, newSection),
      setExerciseActiveStepAction(exercise, newStep),
    );
  }, [dispatch, exercise, activeStep]);

  const addStep = useCallback(() => {
    const activeSection = getActiveStepSection(exercise);
    const activeStepPosition = getStep(activeStep.type).getEndSetup(activeStep)
      .position;
    const newStep: StepInstance = getStep('description').createStep(
      uuid(),
      activeStepPosition,
    );
    dispatch(
      updateEntitiesAction(newStep),
      addSectionChildAction(activeSection, newStep),
      setExerciseActiveStepAction(exercise, newStep),
    );
  }, [dispatch, exercise, activeStep]);

  return (
    <>
      <Container style={{ height: '100%' }}>
        <Row noGutters style={{ height: '100%' }}>
          <Col sm={3} style={{ background: '#CCC', height: '100%' }}>
            <h1>Exercise</h1>
            <Stepper section={section} />
          </Col>
          <Col>
            {activeStep && (
              <Step
                step={activeStep}
                component="Editor"
                addSection={addSection}
                addStep={addStep}
                prevPosition={prevPosition}
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ExerciseComponent;
