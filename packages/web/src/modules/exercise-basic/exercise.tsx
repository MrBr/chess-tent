import React, { useCallback, useEffect, useMemo } from 'react';
import uuid from 'uuid/v1';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
  Exercise,
  Section,
  Step,
  createExercise,
  createSection,
  getActiveStepSection,
  getExercisePreviousStep,
  getSectionLastStep,
} from '@chess-tent/models';
import { AppState } from '@types';
import { state, hooks, constants, components, stepModules } from '@application';

const { Stepper, StepRenderer } = components;
const { createStep, getStepEndSetup } = stepModules;
const {
  selectors: { exerciseSelector },
  actions: { setExerciseActiveStep, updateEntities, addSectionChild },
} = state;
const { useDispatchBatched } = hooks;
const { START_FEN } = constants;

const ExerciseComponent = () => {
  const dispatch = useDispatchBatched();

  useEffect(() => {
    const defaultStep: Step = createStep('description', uuid(), START_FEN);
    const defaultSection = createSection(uuid(), [defaultStep]);
    const defaultExercise: Exercise = createExercise(
      '1',
      defaultSection,
      defaultStep,
    );
    dispatch(updateEntities(defaultExercise));
  }, [dispatch]);
  const exercise = useSelector<AppState, Exercise>(exerciseSelector('1'));
  const { section, activeStep } = exercise || {};

  const prevStep = exercise && getExercisePreviousStep(exercise, activeStep);

  const prevPosition = useMemo(
    () => (prevStep ? getStepEndSetup(prevStep).position : START_FEN),
    [prevStep],
  );

  const addSection = useCallback(
    (children: Section['children'] = []) => {
      const activeSection = getActiveStepSection(exercise);
      const activeStepPosition = getStepEndSetup(activeStep).position;
      const newSection: Section = {
        id: uuid(),
        children: children,
        schema: 'sections',
      };
      let newActiveStep: Step | undefined = getSectionLastStep(newSection);
      if (!newActiveStep) {
        newActiveStep = createStep('description', uuid(), activeStepPosition);
        newSection.children.push(newActiveStep);
      }
      dispatch(
        updateEntities(newSection),
        addSectionChild(activeSection, newSection),
        setExerciseActiveStep(exercise, newActiveStep),
      );
    },
    [dispatch, exercise, activeStep],
  );

  const addStep = useCallback(() => {
    const activeSection = getActiveStepSection(exercise);
    const activeStepPosition = getStepEndSetup(activeStep).position;
    const newStep: Step = createStep('description', uuid(), activeStepPosition);
    dispatch(
      updateEntities(newStep),
      addSectionChild(activeSection, newStep),
      setExerciseActiveStep(exercise, newStep),
    );
  }, [dispatch, exercise, activeStep]);

  const updateActiveStep = useCallback(
    (step: Step) => {
      dispatch(setExerciseActiveStep(exercise, step));
    },
    [dispatch, exercise],
  );

  return (
    <>
      <Container style={{ height: '100%' }}>
        <Row noGutters style={{ height: '100%' }}>
          <Col sm={3} style={{ background: '#CCC', height: '100%' }}>
            <h1>Exercise</h1>
            <Stepper
              section={section}
              addSection={addSection}
              addStep={addStep}
              prevPosition={prevPosition}
              current={activeStep}
              onStepClick={updateActiveStep}
            />
          </Col>
          <Col>
            {activeStep && (
              <StepRenderer
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
