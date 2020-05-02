import React, { FunctionComponent, useCallback, useEffect } from 'react';
import uuid from 'uuid/v1';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { getStep, getStepComponent } from '../app';
import {
  exerciseSchema,
  Section,
  StepInstance,
  StepModuleComponentKey,
} from '../app/types';
import {
  addSectionSection,
  addSectionStep,
  exerciseSelector,
  setExerciseActiveStepAction,
} from './redux';
import { Stepper } from './step';
import { getActiveStepSection } from './service';
import { useDispatchBatched, useDispatchNormalizeBatched } from '../app/hooks';

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

const Exercise = () => {
  const dispatch = useDispatchBatched();
  const dispatchNormalize = useDispatchNormalizeBatched();

  useEffect(() => {
    const defaultStep: StepInstance = {
      id: '1',
      type: 'description',
      moves: [],
      shapes: [],
      schema: 'steps',
      position: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR',
    };
    const defaultExercise = {
      id: '1',
      schema: 'exercises',
      section: {
        id: '1',
        schema: 'sections',
        children: [
          {
            id: '2',
            schema: 'sections',
            children: [defaultStep],
          },
        ],
      },
      activeStep: defaultStep,
    };
    dispatchNormalize(defaultExercise, exerciseSchema);
  }, [dispatchNormalize]);
  const exercise = useSelector<any, any>(exerciseSelector('1'));
  const { section, activeStep } = exercise || {};

  const addSection = useCallback(() => {
    const activeSection = getActiveStepSection(exercise);
    const newStep: StepInstance = {
      id: uuid(),
      moves: [],
      shapes: [],
      type: 'description',
      schema: 'steps',
    };
    const newSection: Section = {
      id: uuid(),
      children: [newStep],
      schema: 'sections',
    };
    dispatch(
      addSectionSection(activeSection, newSection),
      setExerciseActiveStepAction(exercise, newStep),
    );
  }, [dispatch, exercise]);

  const addStep = useCallback(() => {
    const activeSection = getActiveStepSection(exercise);
    const newStep: StepInstance = {
      id: uuid(),
      moves: [],
      shapes: [],
      type: 'description',
      schema: 'steps',
    };
    dispatch(
      addSectionStep(activeSection, newStep),
      setExerciseActiveStepAction(exercise, newStep),
    );
  }, [dispatch, exercise]);

  return (
    <>
      <Container style={{ height: '100%' }}>
        <Row noGutters style={{ height: '100%' }}>
          <Col sm={2} style={{ background: '#CCC', height: '100%' }}>
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

export default Exercise;
