import React, { FunctionComponent, useCallback, useEffect } from 'react';
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

interface StepProps {
  step: StepInstance;
  component: StepModuleComponentKey;
  addSection: () => void;
  addStep: () => void;
}

const Step: FunctionComponent<StepProps> = ({
  component,
  step,
  ...stepProps
}) => {
  const Step = getStep(step.type);
  const Component = getStepComponent(Step, component);
  return <Component step={step} {...stepProps} />;
};

const ExerciseComponent = () => {
  const dispatch = useDispatchBatched();

  useEffect(() => {
    const defaultStep: StepInstance = getStep('description').createStep(uuid());
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

  const addSection = useCallback(() => {
    const activeSection = getActiveStepSection(exercise);
    const newStep: StepInstance = getStep('description').createStep(uuid());
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
  }, [dispatch, exercise]);

  const addStep = useCallback(() => {
    const activeSection = getActiveStepSection(exercise);
    const newStep: StepInstance = getStep('description').createStep(uuid());
    dispatch(
      updateEntitiesAction(newStep),
      addSectionChildAction(activeSection, newStep),
      setExerciseActiveStepAction(exercise, newStep),
    );
  }, [dispatch, exercise]);

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
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ExerciseComponent;
